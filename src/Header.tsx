import Onboard, { EIP1193Provider } from "@web3-onboard/core";
import { Account } from "@web3-onboard/core/dist/types";
import injectedModule from "@web3-onboard/injected-wallets";
import { init, useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import walletConnectModule from "@web3-onboard/walletconnect";
import { useState } from "react";
import { styled } from "./styles";
import { Wallet } from "./Wallet";

export const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between"
});

const allowedChainIds = ["0x1", "0x539"];


export function Header() {


  function back() {
  }


  return (
    <header>
      <Navigation>
        <button type="button" onClick={back}>Back</button>
        <Wallet />
      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}