import Onboard, { EIP1193Provider } from "@web3-onboard/core";
import { Account } from "@web3-onboard/core/dist/types";
import injectedModule from "@web3-onboard/injected-wallets";
import { init, useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import walletConnectModule from "@web3-onboard/walletconnect";
import { useState } from "react";
import { styled } from "./styles";

const injected = injectedModule();
const walletConnect = walletConnectModule();

const MAINNET_RPC_URL = `https://eth-mainnet.alchemyapi.io/v2/...`;
const RINKEBY_RPC_URL = `https://eth-rinkeby.alchemyapi.io/v2/...`;
const GANACHE_RPC_URL = `http://localhost:7545`;

init({
  wallets: [walletConnect, injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      namespace: "evm",
      label: "Ethereum Mainnet",
      rpcUrl: MAINNET_RPC_URL
    },
    {
      id: "0x4",
      token: "ETH",
      namespace: "evm",
      label: "Ethereum Rinkeby Testnet",
      rpcUrl: RINKEBY_RPC_URL
    },
    {
      id: "0x539",
      token: "ETH",
      namespace: "evm",
      label: "Ethereum Ganache Localnet",
      rpcUrl: GANACHE_RPC_URL
    },
  ],
  appMetadata: {
    name: "My App",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    description: "My app using Onboard",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" }
    ]
  }
});

export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between"
});

const allowedChainIds = ["0x1", "0x539"];


export function Header() {
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()


  function back() {
  }


  return (
    <header>
      <Navigation>
        <button type="button" onClick={back}>Back</button>

        <button onClick={() => connect({})}>
          {connecting ? 'connecting' : 'connect'}
        </button>
        {wallet && (
          <div>
            <label>Switch Chain</label>
            {settingChain ? (
              <span>Switching chain...</span>
            ) : (
              <select
                onChange={({ target: { value } }) =>
                  {
                    console.log('onChange called')
                    setChain({ chainId: value })
                  }
                }
                value={connectedChain ? connectedChain.id : undefined}
              >
                {chains.map(({ id, label }) => {
                  return <option key={id} value={id}>{label}</option>
                })}
              </select>
            )}
            <button onClick={() => disconnect(wallet)}>
              Disconnect Wallet
            </button>
          </div>
        )}

        {connectedWallets.map(({ label, accounts }) => {
          return (
            <div key={label}>
              <div>{label}</div>
              <div>Accounts: {JSON.stringify(accounts, null, 2)}</div>
            </div>
          )
        })}


      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}