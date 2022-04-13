import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { globalStyles } from './styles';
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import { init } from "@web3-onboard/react";


const injected = injectedModule();
const walletConnect = walletConnectModule();

const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;
const MAINNET_RPC_URL = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`;
const RINKEBY_RPC_URL = `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`;
const POLYGON_MAINNET_RPC_URL = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const POLYGON_MUMBAI_RPC_URL = `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
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
      id: "0x89",
      token: "MATIC",
      namespace: "evm",
      label: "Matic Mainnet",
      rpcUrl: POLYGON_MAINNET_RPC_URL
    },
    {
      id: "0x13881",
      token: "MATIC",
      namespace: "evm",
      label: "Polygon Testnet",
      rpcUrl: POLYGON_MUMBAI_RPC_URL
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


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

globalStyles()

