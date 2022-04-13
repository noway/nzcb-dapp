import { useContext } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { Wallet } from "./Wallet";

const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: 65,
});

const HeaderContainer = styled("div", {
  marginLeft: 20,
  marginRight: 20,
  border: "1px solid lightgrey",
  width: '100%'
})

const Back = styled("div", {
  alignItems: "center",
  display: "flex",
  margin: 10,
  flex: 1
})

const Title = styled("h1", {
  textAlign: "center",
  flex: 3,
})

const WalletContainer = styled("div", {
  alignItems: "center",
  display: "flex",
  margin: 10,
  flex: 1,
  justifyContent: "flex-end"
})

const HomeLink = styled("span", {
  cursor: "pointer",
})

export function Header(props: Readonly<{ isLanding: boolean; showBack: boolean; }>) {

  const { isLanding, showBack } = props
  const routeContext = useContext(RouteContext);

  function back() {
    routeContext.goBack();
  }
  function home() {
    if (isLanding) {
      routeContext.navigate(["landing", null]);
    }
    else {
      routeContext.navigate(["account", null]);
    }
  }

  return (
    <HeaderContainer>
      <Navigation>
        <Back>
          {showBack ? <button type="button" onClick={back}>Back</button> : <span />}
        </Back>
        <Title><HomeLink onClick={home}>NZ COVID Badge</HomeLink></Title>
        <WalletContainer>
          {!isLanding ? <Wallet /> : <span />}
        </WalletContainer>
      </Navigation>
    </HeaderContainer>
  );
}