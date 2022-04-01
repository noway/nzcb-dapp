import { useContext } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { Wallet } from "./Wallet";

export const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

type Props = Readonly<{
  showWallet: boolean;
  showBack: boolean;
}>
export function Header(props: Props) {

  const { showWallet, showBack } = props
  const routeContext = useContext(RouteContext);

  function back() {
    routeContext.goBack();
  }

  return (
    <header style={{ marginLeft: 20, marginRight: 20, border: "1px solid lightgrey", width: '100%' }}>
      <Navigation>
        <div style={{ alignItems: "center", display: "flex", margin: 10, flex: 1 }}>
          {showBack ? <button type="button" onClick={back}>Back</button> : <span />}
        </div>
        <h1 style={{ textAlign: "center", flex: 3 }}>NZ COVID Badge</h1>
        <div style={{ alignItems: "center", display: "flex", margin: 10, flex: 1, justifyContent: "flex-end" }}>
          {showWallet ? <Wallet /> : <span />}
        </div>
      </Navigation>
    </header>
  );
}