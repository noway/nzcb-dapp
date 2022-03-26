import { styled } from "./styles";


export const Navigation = styled("div", {
  display: "flex",
  justifyContent: "space-between"
});


export function Header() {
  function back() {
  }

  async function connect() {
  }
  return (
    <header>
      <Navigation>
        <button type="button" onClick={back}>Back</button>
        <button type="button" onClick={connect}>Connect Wallet</button>
      </Navigation>
      <h1>NZ COVID Badge</h1>
    </header>
  );
}