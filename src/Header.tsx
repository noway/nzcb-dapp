import Onboard, { EIP1193Provider } from "@web3-onboard/core";
import { Account } from "@web3-onboard/core/dist/types";
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
  const [loading, setLoading] = useState(false); 
  const [account, setAccount] = useState<Account | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [provier, setProvider] = useState<null | EIP1193Provider>(null);
  const [error, setError] = useState<null | Error>(null);
  const [icon, setIcon] = useState("")
  function back() {
  }

  async function connect() {
    setLoading(true);
    try {
      const wallets = await onboard.connectWallet();
      console.log('wallets',wallets)
      if (wallets.length > 0) {
        const { accounts, chains, provider, icon } = wallets[0];
        setIcon(icon);
        const account = accounts[0]
        const chainId = chains[0].id
        if (!allowedChainIds.includes(chainId)) {
          throw new Error("This chain is not allowed")
        }
        setAccount(account);
        setChainId(chainId);
        setProvider(provider);
      }
    } catch (error) {
      setError(error as Error);
    }
    setLoading(false);
  }
  async function disconnect() {
    const [primaryWallet] = await onboard.state.get().wallets;
    if (!primaryWallet) return;
    await onboard.disconnectWallet({ label: primaryWallet.label });
    refreshState();
  }

  const refreshState = () => {
    setAccount(null);
    setChainId("");
    setProvider(null);
  };

  return (
    <header>
      <Navigation>
        <button type="button" onClick={back}>Back</button>
        {loading ? <span>Loading...</span> : null}
        {!loading && error ? <span>Error: {error.message}</span> : null}
        {!loading && !error && !account ? <button type="button" onClick={connect}>Connect Wallet</button> : null}
        {!loading && !error && account ? <div>
          <img src={`data:image/svg+xml,${encodeURIComponent(icon)}`} alt="wallet software" width={16} />
          <span>{`Account: ${truncateAddress(account.address)}`}</span> <span>{chainId}</span>
          <button type="button" onClick={disconnect}>Disconnect</button>
        </div> : null}
      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}