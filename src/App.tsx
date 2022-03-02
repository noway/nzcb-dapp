import { DID_DOCUMENTS, verifyPassURIOffline } from "@vaxxnz/nzcp";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { getToBeSigned } from "./nzcp";
import {groth16} from 'snarkjs'

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"

function prepareToBeSigned(input: Uint8Array, maxLen: number) {
  const bytes = new Uint8Array(maxLen);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input[i];
  }
  const bytesLen = input.length;
  return { bytes, bytesLen }
}

function bufferToBitArray(b: Uint8Array) {
  const res = [];
  for (let i = 0; i < b.length; i++) {
      for (let j = 0; j < 8; j++) {
          res.push(b[i] >> (7 - j) & 1);
      }
  }
  return res;
}


function App() {
  const [passURI, setPassURI] = useState(EXAMPLE_PASS_URI);
  const verify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passURI.length > 0) {
      const result = verifyPassURIOffline(passURI, { didDocument: DID_DOCUMENTS.MOH_EXAMPLE });
      const ToBeSigned = getToBeSigned(passURI)
      const data = prepareToBeSigned(ToBeSigned, 314)
      const input = { toBeSigned: bufferToBitArray(data.bytes), toBeSignedLen: data.bytesLen }
      console.log('proving...', input)
      try {
        const { proof, publicSignals } = await groth16.fullProve(input, "nzcp_example.wasm", "nzcp_example_0001.zkey")
        console.log('proof', proof, publicSignals)
      }
      catch (e) {
        console.log('proof error', e)
      }
      // const buff = await witnessCalculator.current.calculateWTNSBin(input, 0);

      // alert(JSON.stringify(input, null, 2));
      // console.log(buff)
    }
  };
  return (
    <div className="App">
      <header className="App-header">
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
