import { useContext } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { ChainChecker } from "./ChainChecker";
import { Wallet } from "./Wallet";

const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: 65,
});

export const HeaderContainer = styled("div", {
  marginLeft: 20,
  marginRight: 20,
  border: "1px solid lightgrey",
  width: '100%',
  maxWidth: '900px',
  variants: {
    purpose: {
      error: {
        marginTop: 20,
        borderColor: 'red'
      },
    },
  },
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


const Link = styled("a", {
  textDecoration: "none",
  color: 'black'
});

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
    <>
      <HeaderContainer>
        <Navigation>
          <Back>
            {showBack ? <button type="button" onClick={back}>Back</button> : <span />}
          </Back>
          <Title>
            {!isLanding ? <HomeLink onClick={home}>NZ COVID Badge</HomeLink> : <Link href="/">NZ COVID Badge</Link>}
          </Title>
          <WalletContainer>
            {!isLanding ? <Wallet /> : <span />}
          </WalletContainer>
        </Navigation>
      </HeaderContainer>
      <ChainChecker />
    </>
  );
}