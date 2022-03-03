import { DID_DOCUMENTS, verifyPassURIOffline } from "@vaxxnz/nzcp";
import React, { useState } from "react";
import "./App.css";
import { getToBeSigned } from "./nzcp";
import { groth16 } from 'snarkjs'
import { bufferToBitArray } from "./utils";

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"

function prepareToBeSigned(input: Uint8Array, maxLen: number) {
  const bytes = new Uint8Array(maxLen);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input[i];
  }
  const bytesLen = input.length;
  return { bytes, bytesLen }
}


function App() {
  const [passURI, setPassURI] = useState(EXAMPLE_PASS_URI);
  const [proving, setProving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prove = async (passURI: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = verifyPassURIOffline(passURI, { didDocument: DID_DOCUMENTS.MOH_EXAMPLE });
    const ToBeSigned = getToBeSigned(passURI)
    const data = prepareToBeSigned(ToBeSigned, 314)
    const input = { toBeSigned: bufferToBitArray(data.bytes), toBeSignedLen: data.bytesLen }
    console.log('proving...', input)

    setProving(true)
    try {
      const { proof, publicSignals } = await groth16.fullProve(input, "nzcp_example.wasm", "nzcp_example_0001.zkey")
      console.log('proof', proof, publicSignals)
    }
    catch (e) {
      setError(e as Error);
      console.log('proof error', e)
    }
    setProving(false);
  }

  const verify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passURI.length > 0) {
      prove(passURI);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {proving ? "Proving, this may take a while..." : ""}
        {error ? "Error while proving:  " + error.message : ""}
        <form onSubmit={verify}>
          <input
            type="text"
            onChange={(e) => setPassURI(e.target.value)}
            value={passURI}
          />
          <button type="submit">Verify</button>
        </form>
      </header>
    </div>
  );
}

export default App;
