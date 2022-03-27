import { useContext } from "react";
import { RouteContext } from "./contexts";
import { Header } from "./Header";

export function Account() {
  const routeContext = useContext(RouteContext);
  function newBadge() {
    routeContext.navigate(["newbadge", null]);
  }
  return (
    <div>
      <Header showWallet={true} showBack={false} />
      <h1>Account</h1>
      <button type="button" onClick={newBadge}>New Badge</button>
    </div>
  );
}