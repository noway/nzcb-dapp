import { useConnectWallet } from "@web3-onboard/react";
import { providers, Wallet } from "ethers";
import { useContext, useEffect } from "react";
import { RouteContext } from "./contexts";

type Props = Readonly<{}>

export function ConnectWallet(props: Props) {
  const routeContext = useContext(RouteContext);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  useEffect(() => {
    if (wallet) {
      routeContext.setRoute(["account", null]);
    }
  }, [wallet])

  function connectWallet() {
    connect({})
  }
  return (
    <button type="button" onClick={connectWallet}>Connect Wallet</button>
  )
}