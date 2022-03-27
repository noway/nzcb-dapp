import { useContext, useEffect, useState } from "react";
import { groth16 } from 'snarkjs'
import { compare, toHexString } from "./utils";
import { getNZCPPubIdentity,  getNZCPCircuitInput, signalsToPubIdentity, getProofArgs, getRS, PubIdentity, Proof, PublicSignals } from "./nzcpCircom";
import { BigNumber, providers } from "ethers";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { CONTRACT_ADDRESS } from "./config";
import { EIP1193Provider } from "@web3-onboard/core";
import { RouteContext } from "./contexts";

type Props = Readonly<{
  passURI: string
  // eip1193Provider: EIP1193Provider
  address: string
}>;

export function Prover(props: Props) {
  const routeContext = useContext(RouteContext);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignals | null>(null);
  const passURI = props.passURI
  const address = props.address
  const [pubIdentity, setPubIdentity] = useState<PubIdentity | null>(null);

  useEffect(() => {
    prove(passURI)
  }, [passURI])

  async function prove(passURI: string) {
    setProving(true)
    setProvingError(null)
    try {
      const pubIdentity = await getNZCPPubIdentity(passURI, address);
      setPubIdentity(pubIdentity)
      const circuitInput = getNZCPCircuitInput(passURI, address);
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

  function proceed(proof: Proof, publicSignals: PublicSignals, pubIdentity: PubIdentity) {
      routeContext.navigate(["mint", { passURI, proof, publicSignals, pubIdentity }])
  }

  return (
    <div>
      <div>{proving ? "Proving, this may take a while..." : ""}</div>
      <div>{provingError ? "Error while proving:  " + provingError.message : ""}</div>
      {proof && publicSignals && pubIdentity ? 
        <button type="button" onClick={() => proceed(proof, publicSignals, pubIdentity)} disabled={false}>Proceed</button> : 
        <button type="button" disabled={true}>Loading...</button>}
    </div>
  );
}