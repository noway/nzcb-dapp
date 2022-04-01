import { useConnectWallet } from "@web3-onboard/react";
import { useContext, useEffect } from "react";
import { RouteContext } from "./contexts";

export function ConnectWallet() {
  const routeContext = useContext(RouteContext);
  const [{ wallet, connecting }, connect ] = useConnectWallet()

  useEffect(() => {
    if (wallet && !connecting) {
      routeContext.navigate(["account", null]);
    }
  }, [wallet, connecting, routeContext])

  function connectWallet() {
    window.scrollTo(0, 0)
    connect({})
  }

  return connecting ? 
    <button type="button" disabled={true}>Connecting...</button> :
    <button type="button" onClick={connectWallet}>Connect Wallet</button>  
}