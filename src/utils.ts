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
  const bits = new Array(chunks.length * chunkSize);
  for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      for (let j = 0; j < chunkSize; j++) {
          const bitIdx = i * chunkSize + j;
          const byte = (chunk >> BigInt(j)) & 1n;
          bits[bitIdx] = Number(byte);
      }
  }
  return bits
}
