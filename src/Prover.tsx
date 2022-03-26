import React, { useEffect, useState } from "react";
import { groth16 } from 'snarkjs'
import { compare } from "./utils";
import { getNZCPPubIdentity,  getNZCPCircuitInput, signalsToPubIdentity, getProofArgs, getRS, PubIdentity, Proof, PublicSignals } from "./nzcpCircom";
import { ContractReceipt, providers, Wallet } from "ethers";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { CONTRACT_ADDRESS } from "./config";
import { EIP1193Provider } from "@web3-onboard/core";

type Props = Readonly<{
  passURI: string
  eip1193Provider: EIP1193Provider
  address: string
}>;

function comparePubIdentities(a: PubIdentity, b: PubIdentity) {
  return compare(a.nullifierHashPart, b.nullifierHashPart)
    && compare(a.toBeSignedHash, b.toBeSignedHash)
    && compare(a.data, b.data)
    && a.exp === b.exp
}

export function Prover(props: Props) {

  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);

  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignals | null>(null);
  const passURI = props.passURI
  const eip1193Provider = props.eip1193Provider
  const address = props.address
  const provider = new providers.Web3Provider(eip1193Provider);
  const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, provider.getSigner())

  useEffect(() => {
    prove(passURI)
  }, [passURI])


  const prove = async (passURI: string) => {
    setProving(true)
    try {

      const expectedPubIdentity = await getNZCPPubIdentity(passURI, address);
      console.log('expectedPubIdentity',expectedPubIdentity)

      const circuitInput = getNZCPCircuitInput(passURI, address);
      console.log('proving...', circuitInput)

      const { proof, publicSignals } = await groth16.fullProve(circuitInput, "nzcp_example.wasm", "nzcp_example_0001.zkey")
      setProof(proof)
      setPublicSignals(publicSignals)
    }
    catch (e) {
      setProvingError(e as Error);
      console.log('proof error', e)
    }
    setProving(false);
  }

  async function mint(proof: Proof, publicSignals: PublicSignals) {
    const rs = getRS(passURI);
    const { a, b, c, input } = getProofArgs(proof, publicSignals);

    const tx = await nzCovidBadge.mint(a, b, c, input, rs)
    const receipt = await tx.wait()
  }

  return (
    <div>
      {proving ? "Proving, this may take a while..." : ""}
      {provingError ? "Error while proving:  " + provingError.message : ""}
      {proof && publicSignals ? 
        <button type="button" onClick={() => mint(proof, publicSignals)} disabled={proving}>Mint</button> : 
        <button type="button" disabled={true}>Loading...</button>}
    </div>
  );
}