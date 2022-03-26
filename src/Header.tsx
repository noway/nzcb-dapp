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
}>
export function Header(props: Props) {

  const { showWallet } = props
  const routeContext = useContext(RouteContext);

  function back() {
    routeContext.goBack();
  }

  return (
    <header>
      <Navigation>
        <button type="button" onClick={back}>Back</button>
        {showWallet ? <Wallet /> : null}
      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}