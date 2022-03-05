import { Data, decodeBytes, decodeCBOR, decodeCOSE, encodeToBeSigned } from "./nzcpTools";
import { bitArrayToBuffer, bufferToBitArray, fitBytes } from "./utils";

const TO_BE_SIGNED_MAX_LEN = 314;
const SHA256_LEN_BITS = 256;

export interface PubIdentity {
  credSubjHash: Uint8Array;
  toBeSignedHash: Uint8Array;
  exp: number;
}

export async function getNZCPPubIdentity(passURI: string): Promise<PubIdentity> {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
  const exp = claims.get(4) as number;
  const vc = claims.get("vc") as Map<string, Data>
  const credentialSubject = vc.get("credentialSubject") as Map<string, string>;
  const givenName = credentialSubject.get("givenName");
  const familyName = credentialSubject.get("familyName");
  const dob = credentialSubject.get("dob");
  const credSubjConcat = `${givenName},${familyName},${dob}`
  const toBeSignedByteArray = encodeToBeSigned(cose.bodyProtected, cose.payload)
  const credSubjHash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(credSubjConcat)))
  const toBeSignedHash = new Uint8Array(await crypto.subtle.digest("SHA-256", toBeSignedByteArray))
  const pubIdentity = { credSubjHash, toBeSignedHash, exp };
  console.log('credSubjConcat', credSubjConcat);
  return pubIdentity;
}

export function signalsToPubIdentity(publicSignals: number[]): PubIdentity {
  const credSubjHash = bitArrayToBuffer(publicSignals.slice(0, SHA256_LEN_BITS));
  const toBeSignedHash = bitArrayToBuffer(publicSignals.slice(SHA256_LEN_BITS, 2 * SHA256_LEN_BITS));
  const exp = Number(publicSignals[2 * SHA256_LEN_BITS]);
  return { credSubjHash, toBeSignedHash, exp };
}

export function getNZCPCircuitInput(passURI: string) {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const ToBeSigned = encodeToBeSigned(cose.bodyProtected, cose.payload);
  const fitToBeSigned = fitBytes(ToBeSigned, TO_BE_SIGNED_MAX_LEN);
  const input = { toBeSigned: bufferToBitArray(fitToBeSigned), toBeSignedLen: ToBeSigned.length };
  return input;
}

