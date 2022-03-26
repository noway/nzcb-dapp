import { Wallet } from "ethers";
import { useContext } from "react";
import { RouteContext } from "./contexts";
import { Header } from "./Header";

type Props = Readonly<{
  signer: Wallet
}>;

export function Account(props: Props) {
  const routeContext = useContext(RouteContext);
  function newBadge() {
    routeContext.setRoute(["newbadge", null]);
  }
  return (
    <div>
      <Header />
      <h1>Account</h1>
      <button type="button" onClick={newBadge}>New Badge</button>
    </div>
  );
}