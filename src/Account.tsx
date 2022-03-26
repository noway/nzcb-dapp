import { Wallet } from "ethers";
import { useContext } from "react";
import { RouteContext } from "./contexts";
import { Header } from "./Header";

type Props = Readonly<{
}>;

export function Account(props: Props) {
  const routeContext = useContext(RouteContext);
  function newBadge() {
    routeContext.navigate(["newbadge", null]);
  }
  return (
    <div>
      <Header showWallet={true} />
      <h1>Account</h1>
      <button type="button" onClick={newBadge}>New Badge</button>
    </div>
  );
}