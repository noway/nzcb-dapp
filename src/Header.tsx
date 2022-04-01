import { useContext } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { Wallet } from "./Wallet";

export const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between"
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
        {showBack ? <div style={{ alignItems: "center", display: "flex", margin: 10 }}>
          <button type="button" onClick={back}>Back</button>
        </div> : <span />}
        {showWallet ? <div style={{ alignItems: "center", display: "flex", margin: 10 }}>
          <Wallet />
        </div> : <span />}
      </Navigation>
      <h1 style={{ textAlign: "center" }}>NZ COVID Badge</h1>
    </header>
  );
}