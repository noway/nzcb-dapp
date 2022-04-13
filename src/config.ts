import { EXAMPLE_PROOF, EXAMPLE_PUB_SIGNALS } from "./exampleStubs";
import { LIVE_PROOF, LIVE_PUB_SIGNALS } from "./liveStubs";

export const CONTRACT_ADDRESS = "0x14fFB19A685BB8Ec4B925604280f7e441A343af9";
export const USE_REAL_PROOF = true;
export const NETWORK: "mainnet" | "rinkeby" | "polygon" | "polygonMumbai" = "polygon";
export const LIVE = true;

// example pass vars
export const EXAMPLE_ASSET_URL =
  "https://cloudflare-ipfs.com/ipfs/QmXKiU24bL3t86aJNvFTGSbXdSA8CUFJM223MdaKqG9LfP";
export const EXAMPLE_PUBLIC_KEY_JWK = {
  kty: "EC",
  crv: "P-256",
  x: "zRR-XGsCp12Vvbgui4DD6O6cqmhfPuXMhi1OxPl8760",
  y: "Iv5SU6FuW-TRYh5_GOrJlcV_gpF_GpFQhCOD8LSk3T0",
};
export const EXAMPLE_TOBESIGNED_MAX = 314;
export const EXAMPLE_WASM_FILE = "nzcp_example.wasm";
export const EXAMPLE_ZKEY_FILE =
  "https://f004.backblazeb2.com/file/nzcb-zkeys/nzcp_example_final.zkey";

// live pass vars
export const LIVE_ASSET_URL =
  "https://cloudflare-ipfs.com/ipfs/Qma3Tyha3V5FWJpYyhN9FtFTMcitqFZdQ7fafzF4TPmzYH";
export const LIVE_PUBLIC_KEY_JWK = {
  kty: "EC",
  crv: "P-256",
  x: "DQCKJusqMsT0u7CjpmhjVGkHln3A3fS-ayeH4Nu52tc",
  y: "lxgWzsLtVI8fqZmTPPo9nZ-kzGs7w7XO8-rUU68OxmI",
};
export const LIVE_TOBESIGNED_MAX = 351;
export const LIVE_WASM_FILE = "nzcp_live.wasm";
export const LIVE_ZKEY_FILE =
  "https://f004.backblazeb2.com/file/nzcb-zkeys/nzcp_live_final.zkey";

// either live or example pass vars depending on config
export const ASSET_URL = LIVE ? LIVE_ASSET_URL : EXAMPLE_ASSET_URL;
export const PUBLIC_KEY_JWK = LIVE
  ? LIVE_PUBLIC_KEY_JWK
  : EXAMPLE_PUBLIC_KEY_JWK;
export const TOBESIGNED_MAX = LIVE
  ? LIVE_TOBESIGNED_MAX
  : EXAMPLE_TOBESIGNED_MAX;
export const WASM_FILE = LIVE ? LIVE_WASM_FILE : EXAMPLE_WASM_FILE;
export const ZKEY_FILE = LIVE ? LIVE_ZKEY_FILE : EXAMPLE_ZKEY_FILE;

export const STUB_PROOF = LIVE ? LIVE_PROOF : EXAMPLE_PROOF;
export const STUB_PUB_SIGNALS = LIVE ? LIVE_PUB_SIGNALS : EXAMPLE_PUB_SIGNALS;
