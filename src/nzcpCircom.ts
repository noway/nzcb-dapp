import { Data, decodeBytes, decodeCBOR, decodeCOSE, encodeToBeSigned } from "./nzcpTools";

export function fitBytes(input: Uint8Array, maxLen: number) {
  const bytes = new Uint8Array(maxLen);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input[i];
  }
  return bytes;
}

export async function getNZCPPubIdentity(passURI: string) {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
  const exp = claims.get(4);
  const vc = claims.get("vc") as Map<string, Data>
  const credentialSubject = vc.get("credentialSubject") as Map<string, string>;
  const givenName = credentialSubject.get("givenName");
  const familyName = credentialSubject.get("familyName");
  const dob = credentialSubject.get("dob");
  const credSubjConcat = `${givenName},${familyName},${dob}`
  const toBeSignedByteArray = encodeToBeSigned(cose.bodyProtected, cose.payload)
  const credSubjHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(credSubjConcat))
  const toBeSignedHash = await crypto.subtle.digest("SHA-256", toBeSignedByteArray)
  const pubIdentity = { credSubjHash, toBeSignedHash, exp };
  console.log('credSubjConcat', credSubjConcat);
  return pubIdentity;
}
