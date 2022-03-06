import React, { useState } from "react";
import "./App.css";
import { groth16 } from 'snarkjs'
import { compare } from "./utils";
import { getNZCPPubIdentity,  getNZCPCircuitInput, signalsToPubIdentity } from "./nzcpCircom";
import { Verifier__factory } from "./contracts/types/factories/Verifier__factory";
import { providers, Signer, Wallet } from "ethers";

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"


function App() {
  const [passURI, setPassURI] = useState(EXAMPLE_PASS_URI);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [circuitResultMatches, setCircuitResultMatches] = useState<boolean>(false);

  const prove = async (passURI: string) => {
    setProving(true)
    try {
      const circuitInput = getNZCPCircuitInput(passURI);
      console.log('proving...', circuitInput)

      // const { proof, publicSignals } = await groth16.fullProve(input, "nzcp_example.wasm", "nzcp_example_0001.zkey")

      const proof = {
          "pi_a": [
              "10559983623578553436402235122090174389135528670967898488723668577847871398320",
              "3935400620593626304442614489333341283002443359241381362434239982808624109085",
              "1"
          ],
          "pi_b": [
              [
                  "19479438927458691554910115241291364864296534895984363894919142500514790956887",
                  "389993346596457333266867371268048524594178655743182573121633278006466896928"
              ],
              [
                  "17435224358837936710071543904742113144014012158704621537639731916823684621721",
                  "10971354047893800883495272237265821498168639020776556093472436115428545859558"
              ],
              [
                  "1",
                  "0"
              ]
          ],
          "pi_c": [
              "16936204637318457359525760583975534273578614645652482559140784522138626975952",
              "16474529755434858873135222241499868101611845329381479939191387208342247800384",
              "1"
          ],
          "protocol": "groth16",
          "curve": "bn128"
      }
      const publicSignals = [
          "332803489704591243828114355286261993890678185647226483553216796488284950010",
          "213",
          "366677313775235426412199931337625106565467678080892143469223808086055532772",
          "119",
          "1951416330"
      ]
      const url = "http://127.0.0.1:7545";
      const provider = new providers.JsonRpcProvider(url);

      const actualPubIdentity = signalsToPubIdentity(publicSignals as string[]);
      console.log('proof', proof, publicSignals, actualPubIdentity)

      const expectedPubIdentity = await getNZCPPubIdentity(passURI);
      // console.log('expectedPubIdentity',expectedPubIdentity)

      // const signer = new Wallet("e5b2911264f13b902da8790d0136661f418c301dda2e8f37124a3da585983302");
      const verifier = Verifier__factory.connect("0xFd3cEA18805701b7Aa2f065772593B3bd9FCe33a", provider)
      console.log('verifier', verifier)
      const a: [bigint, bigint] = [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])]
      const b: [[bigint, bigint],[bigint, bigint]] = [[BigInt(proof.pi_b[0][0]), BigInt(proof.pi_b[0][1])], [BigInt(proof.pi_b[1][0]), BigInt(proof.pi_b[1][1])]]
      const c: [bigint, bigint] = [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])]
      const input: [bigint, bigint, bigint, bigint, bigint] = [BigInt(publicSignals[0]), BigInt(publicSignals[1]), BigInt(publicSignals[2]), BigInt(publicSignals[3]), BigInt(publicSignals[4])];
      console.log(a, b, c, input)
      const result = await verifier.verifyProof(a, b, c, input)
      console.log('result', result)


      if (
        compare(actualPubIdentity.credSubjHash, expectedPubIdentity.credSubjHash)
          && compare(actualPubIdentity.toBeSignedHash, expectedPubIdentity.toBeSignedHash)
          && actualPubIdentity.exp === expectedPubIdentity.exp
      ) {
        setCircuitResultMatches(true)
      } else {
        setCircuitResultMatches(false)
      }
    }
    catch (e) {
      setProvingError(e as Error);
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
        {provingError ? "Error while proving:  " + provingError.message : ""}
        <p>Circuit result matches: {circuitResultMatches ? "yes" : "no"}</p>
        <form onSubmit={verify}>
          <div>
            <textarea
              onChange={(e) => setPassURI(e.target.value)}
              value={passURI}
              cols={50}
              rows={12}
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      </header>
    </div>
  );
}

export default App;
