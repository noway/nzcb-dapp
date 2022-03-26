import { Wallet } from "ethers";
import { Header } from "./Header";

type Props = Readonly<{
  signer: Wallet
}>;

export function Account(props: Props) {
  return (
    <div>
      <Header />
      <h1>Account</h1>
    </div>
  );
}