import { Header } from "./Header";
import { useConnectWallet } from "@web3-onboard/react";
import { Prover } from "./Prover";

type Props = Readonly<{
  passURI: string
}>;

export function Prepare(props: Props) {
  const [{ wallet }] = useConnectWallet()
  const eip1193Provider = wallet?.provider
  const address = wallet?.accounts[0]?.address // TODO: only ever show 1 account
  const passURI = props.passURI

  return (
    <div>
      <Header showWallet={true} showBack={true} />
      {eip1193Provider && address ? 
        <Prover
          eip1193Provider={eip1193Provider}
          address={address}
          passURI={passURI} 
        /> : 
        <div>Please connect wallet</div>}
    </div>
  );
}

