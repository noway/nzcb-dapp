import React, { useEffect, useState } from "react";
import { groth16 } from 'snarkjs'
import { compare } from "./utils";
import { getNZCPPubIdentity,  getNZCPCircuitInput, signalsToPubIdentity, getProofArgs, getRS } from "./nzcpCircom";
import { ContractReceipt, providers, Wallet } from "ethers";
import { Header } from "./Header";
import { useConnectWallet } from "@web3-onboard/react";
import { Prover } from "./Prover";

type Props = Readonly<{
  passURI: string
}>;

export function Prepare(props: Props) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const eip1193Provider = wallet?.provider
  const address = wallet?.accounts[0]?.address
  const passURI = props.passURI

  return (
    <div>
      <Header showWallet={true} />
      {eip1193Provider && address ? 
        <Prover
          eip1193Provider={eip1193Provider}
          address={address}
          passURI={passURI} 
        /> : 
        <div>please connect wallet</div>}
    </div>
  );
}

