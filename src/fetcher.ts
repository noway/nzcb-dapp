import { ZKEY_FILE } from "./config";

export async function fetchZKeyBlob() {
  return URL.createObjectURL(await (await fetch(ZKEY_FILE)).blob())
}