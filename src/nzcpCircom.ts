export function prepareToBeSigned(input: Uint8Array, maxLen: number) {
  const bytes = new Uint8Array(maxLen);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input[i];
  }
  const bytesLen = input.length;
  return { bytes, bytesLen };
}
