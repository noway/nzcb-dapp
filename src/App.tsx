import React, { useState } from "react";
import "./App.css";
import { decodeBytes, decodeCOSE, encodeToBeSigned } from "./nzcpTools";
import { groth16 } from 'snarkjs'
import { bitArrayToBuffer, bufferToBitArray, compare } from "./utils";
import { getNZCPPubIdentity, fitBytes } from "./nzcpCircom";

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"


function App() {
  const [passURI, setPassURI] = useState(EXAMPLE_PASS_URI);
  const [proving, setProving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [circuitResultMatches, setCircuitResultMatches] = useState<boolean>(false);

  const prove = async (passURI: string) => {
    const bytes = decodeBytes(passURI);
    const cose = decodeCOSE(bytes);
    const ToBeSigned = encodeToBeSigned(cose.bodyProtected, cose.payload);
    const fitToBeSigned = fitBytes(ToBeSigned, 314)
    const input = { toBeSigned: bufferToBitArray(fitToBeSigned), toBeSignedLen: ToBeSigned.length }
    console.log('proving...', input)

    const pubIdentity = await getNZCPPubIdentity(passURI);
    console.log('pubIdentity',pubIdentity)

    setProving(true)
    try {
      const { proof, publicSignals } = await groth16.fullProve(input, "nzcp_example.wasm", "nzcp_example_0001.zkey")

      const credSubjHash = bitArrayToBuffer(publicSignals.slice(0, 256));
      const toBeSignedHash = bitArrayToBuffer(publicSignals.slice(256, 512));
      const exp = Number(publicSignals[512]);
      console.log('proof', proof, publicSignals)

      console.log('credSubjHash',credSubjHash)
      console.log('toBeSignedHash',toBeSignedHash)
      console.log('exp',exp)
      console.log('1',compare(credSubjHash, pubIdentity.credSubjHash))
      console.log('2',compare(toBeSignedHash, pubIdentity.toBeSignedHash))
      console.log('3',exp === pubIdentity.exp)

      if (compare(credSubjHash, pubIdentity.credSubjHash) && compare(toBeSignedHash, pubIdentity.toBeSignedHash) && exp === pubIdentity.exp) {
        setCircuitResultMatches(true)
      } else {
        setCircuitResultMatches(false)
      }
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
        <p>Circuit result matches: {circuitResultMatches ? "yes" : "no"}</p>
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

