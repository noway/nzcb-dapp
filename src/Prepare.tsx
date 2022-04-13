import { Header } from "./Header";
import { useConnectWallet } from "@web3-onboard/react";
import { Prover } from "./Prover";
import { Body } from "./styles";
import { getFirstAccount } from "./utils";
import { Footer } from "./Footer";

export function Prepare(props: Readonly<{ passURI: string }>) {
  const [{ wallet }] = useConnectWallet()
  const account = getFirstAccount(wallet)

  const address = account?.address
  const passURI = props.passURI

  return <>
    <Header isLanding={false} showBack={true} />
    <Body>
      {address ?
        <Prover
          address={address}
          passURI={passURI}
        /> :
        <div>Please connect wallet</div>}
    </Body>
    <Footer />
  </>;
}

