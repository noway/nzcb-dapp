import { utils } from "ethers";
import { Data, decodeBytes, decodeCBOR, decodeCOSE, encodeToBeSigned } from "./nzcpTools";
import { bitArrayToBuffer, bitArrayToNum, bufferToBitArray, chunksToBits, fitBytes, numToBitArray } from "./utils";

const TO_BE_SIGNED_MAX_LEN = 314;

export interface PubIdentity {
  nullifierRange: Uint8Array;
  toBeSignedHash: Uint8Array;
  nbf: bigint;
  exp: bigint;
  data: Uint8Array;
}

export async function getNZCPPubIdentity(passURI: string, secretIndex: Uint8Array, signerAddress: string): Promise<PubIdentity> {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
  const nbf = BigInt(claims.get(5) as number);
  const exp = BigInt(claims.get(4) as number);
  const vc = claims.get("vc") as Map<string, Data>
  const credentialSubject = vc.get("credentialSubject") as Map<string, string>;
  const givenName = credentialSubject.get("givenName");
  const familyName = credentialSubject.get("familyName");
  const dob = credentialSubject.get("dob");
  const nullifer = `${givenName},${familyName},${dob}`
  const toBeSignedByteArray = encodeToBeSigned(cose.bodyProtected, cose.payload)
  // const credSubjHash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nullifer)))
  const nullifierHash = new Uint8Array(await crypto.subtle.digest("SHA-512", new TextEncoder().encode(nullifer)))
  const nullifierRangeNum = bitArrayToNum(bufferToBitArray(nullifierHash)) + bitArrayToNum(bufferToBitArray(secretIndex))
  const nullifierRange = bitArrayToBuffer(numToBitArray(nullifierRangeNum, 512))
  const toBeSignedHash = new Uint8Array(await crypto.subtle.digest("SHA-256", toBeSignedByteArray))
  const signedAddressBytes = utils.arrayify(signerAddress)
  const data = fitBytes(signedAddressBytes, 21);
  const pubIdentity = { nullifierRange, toBeSignedHash, exp, nbf, data };
  console.log('exp', exp);
  console.log('nullifer', nullifer);
  return pubIdentity;
}

export function signalsToPubIdentity(publicSignals: string[]): PubIdentity {
  const SHA512_BITS = 512;
  const SHA256_BITS = 256;
  const TIMESTAMP_BITS = 8 * 4;

  const bigintSignals = publicSignals.map(s => BigInt(s));
  const bits = chunksToBits(bigintSignals, 248);

  const nullifierRangeBits = bits.slice(0, SHA512_BITS);
  const toBeSignedHashBits = bits.slice(SHA512_BITS, SHA512_BITS + SHA256_BITS);
  const nbfBits = bits.slice(SHA512_BITS + SHA256_BITS, SHA512_BITS + SHA256_BITS + TIMESTAMP_BITS);
  const expBits = bits.slice(SHA512_BITS + SHA256_BITS + TIMESTAMP_BITS, SHA512_BITS + SHA256_BITS + 2 * TIMESTAMP_BITS);
  const dataBits = bits.slice(SHA512_BITS + SHA256_BITS + 2 * TIMESTAMP_BITS);

  const nullifierRange = bitArrayToBuffer(nullifierRangeBits)
  const toBeSignedHash = bitArrayToBuffer(toBeSignedHashBits)
  const nbf = bitArrayToNum(nbfBits);
  const exp = bitArrayToNum(expBits);
  const data = bitArrayToBuffer(dataBits)

  const pubIdentity = { nullifierRange, toBeSignedHash, nbf, exp, data };
  return pubIdentity;
}

export function getNZCPCircuitInput(passURI: string, secretIndex: Uint8Array, signerAddress: string) {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const ToBeSigned = encodeToBeSigned(cose.bodyProtected, cose.payload);
  const fitToBeSigned = fitBytes(ToBeSigned, TO_BE_SIGNED_MAX_LEN);
  const signedAddressBytes = utils.arrayify(signerAddress)
  const data = fitBytes(signedAddressBytes, 20);
  const input = { 
    toBeSigned: bufferToBitArray(fitToBeSigned), 
    toBeSignedLen: ToBeSigned.length, 
    secretIndex: bufferToBitArray(secretIndex), 
    data: bufferToBitArray(data) 
  };
  return input;
}

interface ProofArgs {
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
  input: [bigint, bigint, bigint, bigint];
}

interface Proof {
  pi_a: [string, string]
  pi_b: [[string, string], [string, string]]
  pi_c: [string, string]
}

type PublicSignals = [string, string, string, string]; 

export function getProofArgs(proof: Proof, publicSignals: PublicSignals): ProofArgs {
  const { pi_a, pi_b, pi_c } = proof;
  const a: [bigint, bigint] = [BigInt(pi_a[0]), BigInt(pi_a[1])];
  const b: [[bigint, bigint], [bigint, bigint]] = [
    [BigInt(pi_b[0][1]), BigInt(pi_b[0][0])], 
    [BigInt(pi_b[1][1]), BigInt(pi_b[1][0])]
  ];
  const c: [bigint, bigint] = [BigInt(pi_c[0]), BigInt(pi_c[1])];
  const input: [bigint, bigint, bigint, bigint] = [
    BigInt(publicSignals[0]), 
    BigInt(publicSignals[1]),
    BigInt(publicSignals[2]), 
    BigInt(publicSignals[3])
  ];
  return { a, b, c, input };
}

