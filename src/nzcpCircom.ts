import { utils } from "ethers";
import { Data, decodeBytes, decodeCBOR, decodeCOSE, encodeToBeSigned } from "./nzcpTools";
import { bitArrayToBuffer, bitArrayToNum, bufferToBitArray, chunksToBits, fitBytes } from "./utils";

const TO_BE_SIGNED_MAX_LEN = 314;

export interface PubIdentity {
  credSubjHash: Uint8Array;
  toBeSignedHash: Uint8Array;
  nbf: number;
  exp: number;
  data: Uint8Array;
}

export async function getNZCPPubIdentity(passURI: string, signerAddress: string): Promise<PubIdentity> {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
  const nbf = claims.get(5) as number;
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
  const data = fitBytes(signedAddressBytes, 21);
  const pubIdentity = { credSubjHash, toBeSignedHash, exp, nbf, data };
  console.log('exp', exp);
  console.log('credSubjConcat', credSubjConcat);
  return pubIdentity;
}

export function signalsToPubIdentity(publicSignals: string[]): PubIdentity {
  const SHA256_BYTES = 32;
  const TIMESTAMP_BITS = 8 * 4;

  const bigintSignals = publicSignals.map(s => BigInt(s));
  const bits = chunksToBits(bigintSignals, 248);

  const credSubjHashBits = bits.slice(0, SHA256_BYTES * 8);
  const toBeSignedHashBits = bits.slice(SHA256_BYTES * 8, 2 * SHA256_BYTES * 8);
  const nbfBits = bits.slice(2 * SHA256_BYTES * 8, 2 * SHA256_BYTES * 8 + TIMESTAMP_BITS);
  const expBits = bits.slice(2 * SHA256_BYTES * 8 + TIMESTAMP_BITS, 2 * SHA256_BYTES * 8 + 2 * TIMESTAMP_BITS);
  const dataBits = bits.slice(2 * SHA256_BYTES * 8 + 2 * TIMESTAMP_BITS);

  const credSubjHash = bitArrayToBuffer(credSubjHashBits)
  const toBeSignedHash = bitArrayToBuffer(toBeSignedHashBits)
  const nbf = bitArrayToNum(nbfBits);
  const exp = bitArrayToNum(expBits);
  const data = bitArrayToBuffer(dataBits)

  const pubIdentity = { credSubjHash, toBeSignedHash, nbf, exp, data };
  return pubIdentity;
}

export function getNZCPCircuitInput(passURI: string, signerAddress: string) {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const ToBeSigned = encodeToBeSigned(cose.bodyProtected, cose.payload);
  const fitToBeSigned = fitBytes(ToBeSigned, TO_BE_SIGNED_MAX_LEN);
  const signedAddressBytes = utils.arrayify(signerAddress)
  const data = fitBytes(signedAddressBytes, 21);
  const input = { toBeSigned: bufferToBitArray(fitToBeSigned), toBeSignedLen: ToBeSigned.length, data: bufferToBitArray(data) };
  return input;
}

interface ProofArgs {
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
  input: [bigint, bigint, bigint];
}

interface Proof {
  pi_a: [string, string]
  pi_b: [[string, string], [string, string]]
  pi_c: [string, string]
}

type PublicSignals = [string, string, string]; 

export function getProofArgs(proof: Proof, publicSignals: PublicSignals): ProofArgs {
  const { pi_a, pi_b, pi_c } = proof;
  const a: [bigint, bigint] = [BigInt(pi_a[0]), BigInt(pi_a[1])];
  const b: [[bigint, bigint], [bigint, bigint]] = [[BigInt(pi_b[0][1]), BigInt(pi_b[0][0])], [BigInt(pi_b[1][1]), BigInt(pi_b[1][0])]];
  const c: [bigint, bigint] = [BigInt(pi_c[0]), BigInt(pi_c[1])];
  const input: [bigint, bigint, bigint] = [BigInt(publicSignals[0]), BigInt(publicSignals[1]), BigInt(publicSignals[2])];
  return { a, b, c, input };
}

