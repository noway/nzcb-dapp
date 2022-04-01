import { WalletState } from "@web3-onboard/core";

export function bufferToBitArray(b: Uint8Array) {
  const res = [];
  for (let i = 0; i < b.length; i++) {
    for (let j = 0; j < 8; j++) {
      res.push((b[i] >> (7 - j)) & 1);
    }
  }
  return res;
}

export function bitArrayToBuffer(a: number[]) {
  const len = Math.floor((a.length - 1) / 8) + 1;
  const b = new Uint8Array(len);

  for (let i = 0; i < a.length; i++) {
    const p = Math.floor(i / 8);
    b[p] = b[p] | (Number(a[i]) << (7 - (i % 8)));
  }
  return b;
}

export function compare(a: Uint8Array, b: Uint8Array) {
  for (let i = a.length; -1 < i; i -= 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function fitBytes(input: Uint8Array, maxLen: number) {
  const bytes = new Uint8Array(maxLen);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input[i];
  }
  return bytes;
}

export function chunksToBits(chunks: bigint[], chunkSize: number) {
  let bits: number[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    bits = [...bits, ...chunkToBits(chunk, chunkSize)];
  }
  return bits;
}

export function chunkToBits(chunk: bigint, chunkSize: number) {
  const bits = [];
  for (let j = 0; j < chunkSize; j++) {
    const byte = (chunk >> BigInt(j)) & 1n;
    bits.push(Number(byte));
  }
  return bits;
}

export function bitArrayToNum(a: number[]) {
  let num = 0n;
  for (let i = 0; i < a.length; i++) {
    num |= BigInt(a[i]) << BigInt(i);
  }
  return num;
}

export function numToBitArray(n: bigint, len: number) {
  const res: number[] = new Array(len);
  for (let i = 0; i < len; i++) {
    res[i] = Number((n >> BigInt(i)) & 1n);
  }
  return res;
}

export function evmRearrangeBits(bitArray: number[]) {
  const res = [];
  const BYTE_LEN = 8;
  for (let k = 0; k < bitArray.length / BYTE_LEN; k++) {
    const b = bitArray.length / BYTE_LEN - 1 - k;
    for (let i = 0; i < BYTE_LEN; i++) {
      res[b * BYTE_LEN + (7 - i)] = bitArray[k * BYTE_LEN + i];
    }
  }
  return res;
}

export function evmBytesToNum(bytes: Uint8Array) {
  return bitArrayToNum(
    bufferToBitArray(
      bitArrayToBuffer(evmRearrangeBits(bufferToBitArray(bytes)))
    )
  );
}

export function evmRearrangeBytes(bytes: Uint8Array) {
  return bitArrayToBuffer(evmRearrangeBits(bufferToBitArray(bytes)));
}

export function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export function getFirstAccount(wallet: WalletState | null) {
  return wallet?.accounts[0];
}
