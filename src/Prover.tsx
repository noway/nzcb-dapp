import { useCallback, useContext, useEffect, useState } from "react";
import { groth16 } from 'snarkjs'
import { getNZCPPubIdentity, getNZCPCircuitInput, PubIdentity, Proof, PublicSignals } from "./nzcpCircom";
import { RouteContext } from "./contexts";
import { EXAMPLE_WASM_FILE, EXAMPLE_ZKEY_FILE } from "./config";
import { CtaContainer } from "./styles";
import { DataSection } from "./DataSection";
import { DataBit } from "./DataBit";
import { Data, decodeBytes, decodeCBOR, decodeCOSE } from "./nzcpTools";
import { toHexString } from "./utils";

function ctiToJti(cti: Uint8Array): string {
  // https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.2
  const toHex = toHexString
  const timeLow = toHex(cti.slice(0, 4));
  const timeMid = toHex(cti.slice(4, 6));
  const timeHighAndVersion = toHex(cti.slice(6, 8));
  const clockSeqAndReserved = toHex(cti.slice(8, 9));
  const clockSeqLow = toHex(cti.slice(9, 10));
  const node = toHex(cti.slice(10, 16));
  const uuid = `${timeLow}-${timeMid}-${timeHighAndVersion}-${clockSeqAndReserved}${clockSeqLow}-${node}`;
  const jti = `urn:uuid:${uuid}`;
  return jti;
}

function PassInfo(props: Readonly<{ passURI: string }>) {
  const { passURI } = props
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
  const headers = decodeCBOR(cose.bodyProtected) as Map<Data, Data>;
  const nbf = BigInt(claims.get(5) as number);
  const exp = BigInt(claims.get(4) as number);
  const cti = claims.get(7) as Uint8Array;
  console.log('claims',claims)
  console.log('headers',headers)
  const vc = claims.get("vc") as Map<string, Data>;
  const credentialSubject = vc.get("credentialSubject") as Map<string, string>;
  const givenName = credentialSubject.get("givenName");
  const familyName = credentialSubject.get("familyName");
  const dob = credentialSubject.get("dob");

  return (
    <DataSection title="Pass info">
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