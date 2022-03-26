import { providers, Wallet } from "ethers";
import { useContext } from "react";
import { RouteContext } from "./contexts";

type Props = Readonly<{}>

export function ConnectWallet(props: Props) {
  const routeContext = useContext(RouteContext);
  function connect() {
    routeContext.setRoute(["account", null]);
  }
  return (
    <button type="button" onClick={connect}>Connect Wallet</button>
  )
}