import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import { InitOptions } from "@web3-onboard/core";

export function getInitOptions(rpcUrl: string | null): InitOptions {
  const injected = injectedModule();
  const walletConnect = walletConnectModule();
  const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;

  return {
    wallets: [walletConnect, injected],
    chains: [
      {
        id: "0x1",
        token: "ETH",
        namespace: "evm",
        label: "Ethereum Mainnet",
        rpcUrl:
          rpcUrl ?? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      },
      {
        id: "0x4",
        token: "ETH",
        namespace: "evm",
        label: "Ethereum Rinkeby Testnet",
        rpcUrl:
          rpcUrl ?? `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      },
      {
        id: "0x89",
        token: "MATIC",
        namespace: "evm",
        label: "Matic Mainnet",
        rpcUrl:
          rpcUrl ??
          `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      },
      {
        id: "0x13881",
        token: "MATIC",
        namespace: "evm",
        label: "Polygon Testnet",
        rpcUrl:
          rpcUrl ??
          `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      },
      {
        id: "0x539",
        token: "ETH",
        namespace: "evm",
        label: "Ethereum Ganache Localnet",
        rpcUrl: rpcUrl ?? `http://localhost:7545`,
      },
    ],
    appMetadata: {
      name: "NZ COVID Badge",
      icon: "https://nzcb.netlify.app/android-chrome-192x192.png",
      logo: "https://nzcb.netlify.app/android-chrome-192x192.png",
      description:
        "An ERC721 project that lets you mint your NZ COVID vaccination status.",
      recommendedInjectedWallets: [
        { name: "MetaMask", url: "https://metamask.io" },
      ],
    },
  };
}
