import { useConnectWallet } from "@web3-onboard/react";
import { useContext, useEffect } from "react";
import { RouteContext } from "./contexts";

export function ConnectWallet() {
  const routeContext = useContext(RouteContext);
  const [{ wallet, connecting }, connect ] = useConnectWallet()
  useEffect(() => {
    console.log('wallet changed', wallet, connecting)
    if (wallet && !connecting) {
      routeContext.navigate(["account", null]);
    }
  }, [wallet, connecting, routeContext])

  function connectWallet() {
    connect({})
  }
  return (
    <button type="button" disabled={connecting} onClick={connectWallet}>{connecting ? "Connecting..." : "Connect Wallet"}</button>
  )
}