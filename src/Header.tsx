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
    <header>
      <Navigation>
        {showBack ? <button type="button" onClick={back}>Back</button> : null}
        {showWallet ? <Wallet /> : null}
      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}