import { DataBit, DataBitTS, DataSection } from "./DataSection";
import { ctiToJti, Data, decodeAlg, decodeBytes, decodeCBOR, decodeCOSE } from "./nzcpTools";

export function PassInfo(props: Readonly<{ passURI: string; }>) {
  const { passURI } = props;
  if (!passURI) {
    return (
      <DataSection title="Pass info">
        <DataBit title="data" value={`empty`} />
      </DataSection>
    )
  }
  try {
    const bytes = decodeBytes(passURI);
    const cose = decodeCOSE(bytes);
    const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
    const headers = decodeCBOR(cose.bodyProtected) as Map<Data, Data>;
    const kid = headers.get(4) as Uint8Array;
    const alg = headers.get(1) as number;
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
        <DataBitTS title="nbf" value={Number(nbf)} />
        <DataBitTS title="exp" value={Number(exp)} />
        <DataBit title="jti" value={`${ctiToJti(cti)}`} />
        <DataBit title="givenName" value={`${givenName}`} />
        <DataBit title="familyName" value={`${familyName}`} />
        <DataBit title="dob" value={`${dob}`} />
      </DataSection>
    );
  } catch (e) {
    return (
      <DataSection title="Pass info">
        <DataBit title="error" value={`${(e as Error).message}`} />
      </DataSection>
    );
  }
}
