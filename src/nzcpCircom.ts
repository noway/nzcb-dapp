import { utils as eutils } from "ethers";
import { EXAMPLE_TOBESIGNED_MAX_LEN } from "./config";
import {
  Data,
  decodeBytes,
  decodeCBOR,
  decodeCOSE,
  decodeRS,
  encodeToBeSigned,
} from "./nzcpTools";
import {
  bitArrayToBuffer,
  bufferToBitArray,
  chunkToBits,
  compare,
  evmBytesToNum,
  evmRearrangeBits,
  evmRearrangeBytes,
  fitBytes,
} from "./utils";
import { plonk } from 'snarkjs'
import {utils} from 'ffjavascript';
const unstringifyBigInts = utils.unstringifyBigInts

export type PubIdentity = Readonly<{
  nullifierHashPart: Uint8Array;
  toBeSignedHash: Uint8Array;
  exp: bigint;
  data: Uint8Array;
}>;

export async function getNZCPPubIdentity(
  passURI: string,
  signerAddress: string
): Promise<PubIdentity> {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const claims = decodeCBOR(cose.payload) as Map<Data, Data>;
  const exp = BigInt(claims.get(4) as number);
  const vc = claims.get("vc") as Map<string, Data>;
  const credentialSubject = vc.get("credentialSubject") as Map<string, string>;
  const givenName = credentialSubject.get("givenName");
  const familyName = credentialSubject.get("familyName");
  const dob = credentialSubject.get("dob");
  const nullifier = `${givenName},${familyName},${dob}`;
  const toBeSignedByteArray = encodeToBeSigned(
    cose.bodyProtected,
    cose.payload
  );
  const nullifierBytes = fitBytes(new TextEncoder().encode(nullifier), 64);
  const nullifierHash = new Uint8Array(
    await crypto.subtle.digest("SHA-512", nullifierBytes)
  );
  const nullifierHashPart = nullifierHash.slice(0, 32);
  const toBeSignedHash = new Uint8Array(
    await crypto.subtle.digest("SHA-256", toBeSignedByteArray)
  );
  const signedAddressBytes = eutils.arrayify(signerAddress);
  const data = fitBytes(signedAddressBytes, 25);
  const pubIdentity = { nullifierHashPart, toBeSignedHash, exp, data };
  return pubIdentity;
}

export function signalsToPubIdentity(publicSignals: Readonly<[string,string,string]>): PubIdentity {
  const bigintSignals = publicSignals.map((s) => BigInt(s));

  const out0 = bitArrayToBuffer(
    evmRearrangeBits(chunkToBits(bigintSignals[0], 248))
  );
  const out1 = bitArrayToBuffer(
    evmRearrangeBits(chunkToBits(bigintSignals[1], 248))
  );
  const out2 = bitArrayToBuffer(
    evmRearrangeBits(chunkToBits(bigintSignals[2], 248))
  );

  const nullifierHashPart = new Uint8Array([...Array.from(out0), out1[0]]);
  const toBeSignedHash = new Uint8Array([
    ...Array.from(out1).slice(1),
    out2[0],
    out2[1],
  ]);
  const expBytes = new Uint8Array([out2[2], out2[3], out2[4], out2[5]]);
  const data = out2.slice(6);
  const exp = evmBytesToNum(expBytes);

  const pubIdentity = { nullifierHashPart, toBeSignedHash, exp, data };
  return pubIdentity;
}

export function getNZCPCircuitInput(passURI: string, signerAddress: string) {
  const bytes = decodeBytes(passURI);
  const cose = decodeCOSE(bytes);
  const ToBeSigned = encodeToBeSigned(cose.bodyProtected, cose.payload);
  const fitToBeSigned = fitBytes(ToBeSigned, EXAMPLE_TOBESIGNED_MAX_LEN);
  const signedAddressBytes = eutils.arrayify(signerAddress);
  const data = evmRearrangeBytes(fitBytes(signedAddressBytes, 25));
  const input = {
    toBeSigned: bufferToBitArray(fitToBeSigned),
    toBeSignedLen: ToBeSigned.length,
    data: bufferToBitArray(data),
  };
  return input;
}

export function getRS(passURI: string): [Uint8Array, Uint8Array] {
  return decodeRS(decodeBytes(passURI));
}

type ProofArgs = Readonly<{
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
  input: [bigint, bigint, bigint];
}>;

export type Proof = Readonly<{
  readonly A: string[];
  readonly B: string[];
  readonly C: string[];
  readonly T1: string[];
  readonly T2: string[];
  readonly T3: string[];
  readonly Wxi: string[];
  readonly Wxiw: string[];
  readonly Z: string[];
  readonly curve: string;
  readonly eval_a: string;
  readonly eval_b: string;
  readonly eval_c: string;
  readonly eval_r: string;
  readonly eval_s1: string;
  readonly eval_s2: string;
  readonly eval_zw: string;
  readonly protocol: string;
}>;



export type PublicSignals = Readonly<[string, string, string]>;

export function getProofArgs(
  proof: Proof,
  publicSignals: PublicSignals
): Promise<ProofArgs> {
  return plonk.exportSolidityCallData(unstringifyBigInts(proof), publicSignals)
  // const { pi_a, pi_b, pi_c } = proof;
  // const a: [bigint, bigint] = [BigInt(pi_a[0]), BigInt(pi_a[1])];
  // const b: [[bigint, bigint], [bigint, bigint]] = [
  //   [BigInt(pi_b[0][1]), BigInt(pi_b[0][0])],
  //   [BigInt(pi_b[1][1]), BigInt(pi_b[1][0])],
  // ];
  // const c: [bigint, bigint] = [BigInt(pi_c[0]), BigInt(pi_c[1])];
  // const input: [bigint, bigint, bigint] = [
  //   BigInt(publicSignals[0]),
  //   BigInt(publicSignals[1]),
  //   BigInt(publicSignals[2]),
  // ];
  // return { a, b, c, input };
}

export function comparePubIdentities(a: PubIdentity, b: PubIdentity) {
  return (
    compare(a.nullifierHashPart, b.nullifierHashPart) &&
    compare(a.toBeSignedHash, b.toBeSignedHash) &&
    compare(a.data, b.data) &&
    a.exp === b.exp
  );
}
