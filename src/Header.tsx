import Onboard, { EIP1193Provider } from "@web3-onboard/core";
import { Account } from "@web3-onboard/core/dist/types";
import injectedModule from "@web3-onboard/injected-wallets";
import { init, useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import walletConnectModule from "@web3-onboard/walletconnect";
import { useContext, useState } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { Wallet } from "./Wallet";

export const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between"
});

const allowedChainIds = ["0x1", "0x539"];

type Props = Readonly<{
  showWallet: boolean;
}>
export function Header(props: Props) {

  const { showWallet } = props
  const routeContext = useContext(RouteContext);

  function back() {
    routeContext.goBack();
  }


  return (
    <header>
      <Navigation>
        <button type="button" onClick={back}>Back</button>
        {showWallet ? <Wallet /> : null}
      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}