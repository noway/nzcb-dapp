import { useSetChain } from "@web3-onboard/react";
import { styled } from "./styles";
import { HeaderContainer } from "./Header";
import { NETWORK_ID, NETWORK_LABEL } from "./config";

const SwitchLink = styled("span", {
  textDecoration: 'underline',
  color: 'red',
  cursor: "pointer"
});
const SwitchError = styled("div", {
  color: 'red',
  textAlign: "center",
  backgroundColor: 'rgba(255, 0, 0, 0.2)',
  padding: 20
});
export function ChainChecker(props: Readonly<{}>) {
  const [{ connectedChain }, setChain] = useSetChain();
  function switchChain() {
    setChain({
      chainId: NETWORK_ID,
    });
  }
  return (
    connectedChain && connectedChain.id !== NETWORK_ID ?
      <HeaderContainer purpose="error">
        <SwitchError>
          Wrong Chain - Please Switch to <SwitchLink onClick={switchChain}>{NETWORK_LABEL}</SwitchLink>
        </SwitchError>
      </HeaderContainer> : null
  );
}
