import { useCallback, useContext, useEffect, useState } from "react";
import { groth16 } from 'snarkjs'
import { getNZCPPubIdentity,  getNZCPCircuitInput, PubIdentity, Proof, PublicSignals } from "./nzcpCircom";
import { RouteContext } from "./contexts";
import { EXAMPLE_WASM_FILE, EXAMPLE_ZKEY_FILE } from "./config";

type Props = Readonly<{
  passURI: string
  address: string
}>;

export function Prover(props: Props) {
  const passURI = props.passURI
  const address = props.address
  const routeContext = useContext(RouteContext);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignals | null>(null);
  const [pubIdentity, setPubIdentity] = useState<PubIdentity | null>(null);

  const prove = useCallback(async function(passURI: string) {
    setProving(true)
    setProvingError(null)
    try {
      const pubIdentity = await getNZCPPubIdentity(passURI, address);
      setPubIdentity(pubIdentity)
      const circuitInput = getNZCPCircuitInput(passURI, address);
      const { proof, publicSignals } = await groth16.fullProve(circuitInput, EXAMPLE_WASM_FILE, EXAMPLE_ZKEY_FILE)
      setProof(proof)
      setPublicSignals(publicSignals)
    }
    catch (e) {
      setProvingError(e as Error);
      console.log('proof error', e)
    }
    setProving(false);
  }, [address])

  useEffect(() => {
    prove(passURI)
  }, [passURI, prove])

  function proceed(proof: Proof, publicSignals: PublicSignals, pubIdentity: PubIdentity) {
    routeContext.navigate(["mint", { passURI, proof, publicSignals, pubIdentity }])
  }

  return (
    <div>
      <div>{proving ? "Proving, this may take a while..." : ""}</div>
      <div>{provingError ? "Error while proving:  " + provingError.message : ""}</div>
      {proof && publicSignals && pubIdentity ? 
        <button type="button" onClick={() => proceed(proof, publicSignals, pubIdentity)} disabled={false}>Proceed</button> : 
        <button type="button" disabled={true}>Proving...</button>}
    </div>
  );
}