import Onboard, { EIP1193Provider } from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import { useState } from "react";
import { styled } from "./styles";

const injected = injectedModule();
const walletConnect = walletConnectModule();

const MAINNET_RPC_URL = `https://eth-mainnet.alchemyapi.io/v2/...`;
const RINKEBY_RPC_URL = `https://eth-rinkeby.alchemyapi.io/v2/...`;
const GANACHE_RPC_URL = `http://localhost:7545`;

const onboard = Onboard({
  wallets: [walletConnect, injected],
  chains: [
    {
      id: "0x1", // chain ID must be in hexadecimel
      token: "ETH", // main chain token
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


export function Header() {
  const [loading, setLoading] = useState(false); 
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [provier, setProvider] = useState<null | EIP1193Provider>(null);
  const [error, setError] = useState<null | Error>(null);
  function back() {
  }

  async function connect() {
    try {
      const wallets = await onboard.connectWallet();
      setLoading(true);
      const { accounts, chains, provider } = wallets[0];
      setAccount(accounts[0].address);
      setChainId(chains[0].id);
      setProvider(provider);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
    }
  }
  async function disconnect() {
    const [primaryWallet] = await onboard.state.get().wallets;
    if (!primaryWallet) return;
    await onboard.disconnectWallet({ label: primaryWallet.label });
    refreshState();
  }

  const refreshState = () => {
    setAccount("");
    setChainId("");
    setProvider(null);
  };

  return (
    <header>
      <Navigation>
        <button type="button" onClick={back}>Back</button>
        {!account ? 
          <button type="button" onClick={connect}>Connect Wallet</button> :
          <div>
            <span>{`Account: ${truncateAddress(account)}`}</span>
            <button type="button" onClick={disconnect}>Disconnect</button>
          </div>
        }
      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}