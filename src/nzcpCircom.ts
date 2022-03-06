import { utils } from "ethers";
import { Data, decodeBytes, decodeCBOR, decodeCOSE, encodeToBeSigned } from "./nzcpTools";
import { bitArrayToBuffer, bitArrayToNum, bufferToBitArray, chunksToBits, fitBytes } from "./utils";

const TO_BE_SIGNED_MAX_LEN = 314;

export interface PubIdentity {
  credSubjHash: Uint8Array;
  toBeSignedHash: Uint8Array;
  exp: number;
  data: Uint8Array;
}

export async function getNZCPPubIdentity(passURI: string, signerAddress: string): Promise<PubIdentity> {
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
  const signedAddressBytes = utils.arrayify(signerAddress)
  const data = fitBytes(signedAddressBytes, 25);
  const pubIdentity = { credSubjHash, toBeSignedHash, exp, data };
  console.log('credSubjConcat', credSubjConcat);
  return pubIdentity;
}

export function signalsToPubIdentity(publicSignals: string[]): PubIdentity {
  const SHA256_BYTES = 32;
  const EXP_LEN_BITS = 8 * 4;

  const bigintSignals = publicSignals.map(s => BigInt(s));
  const bits = chunksToBits(bigintSignals, 248);

  const credSubjHashBits = bits.slice(0, SHA256_BYTES * 8);
  const toBeSignedHashBits = bits.slice(SHA256_BYTES * 8, 2 * SHA256_BYTES * 8);
  const expBits = bits.slice(2 * SHA256_BYTES * 8, 2 * SHA256_BYTES * 8 + EXP_LEN_BITS);
  const dataBits = bits.slice(2 * SHA256_BYTES * 8 + EXP_LEN_BITS);

  const credSubjHash = bitArrayToBuffer(credSubjHashBits)
  const toBeSignedHash = bitArrayToBuffer(toBeSignedHashBits)
  const exp = bitArrayToNum(expBits);

  const data = bitArrayToBuffer(dataBits)

  const pubIdentity = { credSubjHash, toBeSignedHash, exp, data };
  return pubIdentity;
}

export function getNZCPCircuitInput(passURI: string, signerAddress: string) {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const ToBeSigned = encodeToBeSigned(cose.bodyProtected, cose.payload);
  const fitToBeSigned = fitBytes(ToBeSigned, TO_BE_SIGNED_MAX_LEN);
  const signedAddressBytes = utils.arrayify(signerAddress)
  const data = fitBytes(signedAddressBytes, 25);
  const input = { toBeSigned: bufferToBitArray(fitToBeSigned), toBeSignedLen: ToBeSigned.length, data: bufferToBitArray(data) };
  return input;
}

