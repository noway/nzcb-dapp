import { useCallback, useContext, useEffect, useState } from "react";
import { groth16 } from 'snarkjs'
import { getNZCPPubIdentity, getNZCPCircuitInput, PubIdentity, Proof, PublicSignals } from "./nzcpCircom";
import { RouteContext } from "./contexts";
import { EXAMPLE_WASM_FILE, EXAMPLE_ZKEY_FILE } from "./config";
import { CtaContainer } from "./styles";
import { DataSection } from "./DataSection";
import { DataBit } from "./DataBit";
import { ctiToJti, Data, decodeAlg, decodeBytes, decodeCBOR, decodeCOSE } from "./nzcpTools";


function PassInfo(props: Readonly<{ passURI: string }>) {
  const { passURI } = props
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
  const headers = decodeCBOR(cose.bodyProtected) as Map<Data, Data>;
  const kid = headers.get(4) as Uint8Array
  const alg = headers.get(1) as number
  const iss = claims.get(1) as string;
  const nbf = BigInt(claims.get(5) as number);
  const exp = BigInt(claims.get(4) as number);
  const cti = claims.get(7) as Uint8Array;
  const vc = claims.get("vc") as Map<string, Data>;
  const credentialSubject = vc.get("credentialSubject") as Map<string, string>;
  const givenName = credentialSubject.get("givenName");
  const familyName = credentialSubject.get("familyName");
  const dob = credentialSubject.get("dob");

  return (
    <DataSection title="Pass info">
      <DataBit title="kid" value={`${new TextDecoder("utf-8").decode(kid)}`} />
      <DataBit title="alg" value={`${decodeAlg(alg)}`} />
      <DataBit title="iss" value={`${iss}`} />
      <DataBit title="nbf" value={`${nbf}`} />
      <DataBit title="exp" value={`${exp}`} />
      <DataBit title="jti" value={`${ctiToJti(cti)}`} />
      <DataBit title="givenName" value={`${givenName}`} />
      <DataBit title="familyName" value={`${familyName}`} />
      <DataBit title="dob" value={`${dob}`} />
    </DataSection>
  )
}

type Props = Readonly<{
  passURI: string
  address: string
}>;

export function Prover(props: Props) {
  const { passURI, address } = props
  const routeContext = useContext(RouteContext);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignals | null>(null);
  const [pubIdentity, setPubIdentity] = useState<PubIdentity | null>(null);

  const prove = useCallback(async function (passURI: string) {
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
      {/* TODO: make this into generic status messages */}
      <div>{proving ? "Proving, this may take a while..." : ""}</div>
      <div>{provingError ? "Error while proving:  " + provingError.message : ""}</div>
      {proof && publicSignals && pubIdentity ? <div>Proof is ready</div> : null}
      <CtaContainer>
        {proof && publicSignals && pubIdentity ?
          <button type="button" onClick={() => proceed(proof, publicSignals, pubIdentity)} disabled={false}>Proceed</button> :
          <button type="button" disabled={true}>Proving...</button>}
      </CtaContainer>
    </div>
  );
}