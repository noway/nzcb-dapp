import { Data, decodeBytes, decodeCBOR, decodeCOSE, encodeToBeSigned } from "./nzcpTools";
import { bitArrayToBuffer, bufferToBitArray } from "./utils";

export interface PubIdentity {
  credSubjHash: Uint8Array;
  toBeSignedHash: Uint8Array;
  exp: number;
}

export function fitBytes(input: Uint8Array, maxLen: number) {
  const bytes = new Uint8Array(maxLen);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input[i];
  }
  return bytes;
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
  const credSubjHash = bitArrayToBuffer(publicSignals.slice(0, 256));
  const toBeSignedHash = bitArrayToBuffer(publicSignals.slice(256, 512));
  const exp = Number(publicSignals[512]);
  return { credSubjHash, toBeSignedHash, exp };
}

export function getNZCPCircuitInput(passURI: string) {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const ToBeSigned = encodeToBeSigned(cose.bodyProtected, cose.payload);
  const fitToBeSigned = fitBytes(ToBeSigned, 314);
  const input = { toBeSigned: bufferToBitArray(fitToBeSigned), toBeSignedLen: ToBeSigned.length };
  return input;
}

