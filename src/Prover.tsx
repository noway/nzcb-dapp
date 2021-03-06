import { useCallback, useContext, useEffect, useState } from "react";
import { plonk } from 'snarkjs'
import { getNZCPPubIdentity, getNZCPCircuitInput, PubIdentity, Proof, PublicSignals, controlVerify } from "./nzcpCircom";
import { RouteContext } from "./contexts";
import { WASM_FILE, USE_REAL_PROOF, STUB_PROOF, STUB_PUB_SIGNALS } from "./config";
import { CtaContainer } from "./styles";
import { PassInfo } from "./PassInfo";
import { Status, StatusError } from "./Status";
import { ProverStatus } from "./ProverStatus";
import { fetchZKeyBlob } from "./fetcher";
import { blink } from "./utils";

export function Prover(props: Readonly<{ passURI: string; address: string }>) {
  const { passURI, address } = props
  const routeContext = useContext(RouteContext);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignals | null>(null);
  const [pubIdentity, setPubIdentity] = useState<PubIdentity | null>(null);
  const [controlStart, setControlStart] = useState<number | null>(null);
  const [controlEnd, setControlEnd] = useState<number | null>(null);
  const [fetchStart, setFetchStart] = useState<null | number>(null);
  const [fetchEnd, setFetchEnd] = useState<null | number>(null);
  const [proveStart, setProveStart] = useState<null | number>(null);
  const [proveEnd, setProveEnd] = useState<null | number>(null);

  const prove = useCallback(async function (passURI: string) {
    setProving(true)
    setProvingError(null)
    setFetchStart(null)
    setFetchEnd(null)
    setProveStart(null)
    setProveEnd(null)
    try {
      const pubIdentity = await getNZCPPubIdentity(passURI, address);
      setPubIdentity(pubIdentity)
      const circuitInput = getNZCPCircuitInput(passURI, address);

      let data: { proof: Proof, publicSignals: PublicSignals };
      if (USE_REAL_PROOF) {

        setControlStart(Date.now())
        await blink()
        console.time("control")
        controlVerify()
        console.timeEnd("control")
        setControlEnd(Date.now())

        setFetchStart(Date.now())
        await blink()
        console.time("fetch")
        const zkeyurl = await fetchZKeyBlob()
        console.timeEnd("fetch")
        setFetchEnd(Date.now())
        await blink()

        setProveStart(Date.now())
        console.time("plonk")
        let realData: any
        try {
          realData = await plonk.fullProve(circuitInput, WASM_FILE, zkeyurl)
        }
        catch (e) {
          if ((e as Error).message.includes("Failed to fetch")) {
            throw new Error("Failed to generate plonk proof, only Mozilla Firefox is supported.")
          }
          throw e
        }
        console.timeEnd("plonk")
        setProveEnd(Date.now())

        data = realData
      }
      else {
        data = { proof: STUB_PROOF, publicSignals: STUB_PUB_SIGNALS }
      }

      const { proof, publicSignals } = data
      setProof(proof)
      setPublicSignals(publicSignals)
    }
    catch (e) {
      console.log((e as Error).stack)
      setProvingError(e as Error);
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
      <PassInfo passURI={passURI} />
      {proving ?
        <ProverStatus
          controlStart={controlStart}
          controlEnd={controlEnd}
          fetchStart={fetchStart}
          fetchEnd={fetchEnd}
          proveStart={proveStart}
          proveEnd={proveEnd}
        /> : null}
      {provingError ? <StatusError error={provingError} /> : null}
      {proof && publicSignals && pubIdentity ? <Status status="Proof is ready" /> : null}
      <CtaContainer>
        {proof && publicSignals && pubIdentity ?
          <button type="button" onClick={() => proceed(proof, publicSignals, pubIdentity)} disabled={false}>Proceed</button> :
          <button type="button" disabled={true}>Proving...</button>}
      </CtaContainer>
    </div>
  );
}

