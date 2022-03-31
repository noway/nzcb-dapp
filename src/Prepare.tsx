import { Header } from "./Header";
import { useConnectWallet } from "@web3-onboard/react";
import { Prover } from "./Prover";
import { Body } from "./styles";

type Props = Readonly<{
  passURI: string
}>;

export function Prepare(props: Props) {
  const [{ wallet }] = useConnectWallet()
  const address = wallet?.accounts[0]?.address // TODO: only ever show 1 account
  const passURI = props.passURI

  return <>
    <Header showWallet={true} showBack={true} />
    <Body>
      {address ? 
        <Prover
          address={address}
          passURI={passURI} 
        /> : 
        <div>Please connect wallet</div>}
    </Body>
  </>;
}

