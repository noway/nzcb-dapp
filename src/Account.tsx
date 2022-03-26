import { Wallet } from "ethers";

type Props = Readonly<{
  signer: Wallet
}>;

export function Account(props: Props) {
  return (
    <div>
      <h1>Account</h1>
    </div>
  );
}