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
  const [verifierResult, setVerifierResult] = useState<boolean>(false);

  const prove = async (passURI: string) => {
    setProving(true)
    try {
      const circuitInput = getNZCPCircuitInput(passURI);
      console.log('proving...', circuitInput)

      const { proof, publicSignals } = await groth16.fullProve(circuitInput, "nzcp_example.wasm", "nzcp_example_0001.zkey")

      /*
      const proof = {
          "pi_a": [
              "11539412160635928257474705897328090833904257557011703342609204998872599021700",
              "10075336503032401675008831281140418134130223717686211900553986791890393047912",
              "1"
          ],
          "pi_b": [
              [
                  "12577053859341466967328809342389909001282846992486541048083717533911962519196",
                  "3412509244958026751356623685831257262721005109871343475300497514693756809551"
              ],
              [
                  "21449278417468229923175013013204242195790618479058852822382222068633114698253",
                  "184048061663936649139110486270255416945364992762624325173617761547526351785"
              ],
              [
                  "1",
                  "0"
              ]
          ],
          "pi_c": [
              "5449975126432875366447163766082505697678831194928898594313613338480181339695",
              "19230229730190395864604850707670124848599447045112424019625046176191381575300",
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
      */
      const url = "http://127.0.0.1:7545";
      const provider = new providers.JsonRpcProvider(url);

      const actualPubIdentity = signalsToPubIdentity(publicSignals as string[]);
      console.log('proof', proof, publicSignals, actualPubIdentity)

      const expectedPubIdentity = await getNZCPPubIdentity(passURI);
      // console.log('expectedPubIdentity',expectedPubIdentity)

      const signer = new Wallet("e5b2911264f13b902da8790d0136661f418c301dda2e8f37124a3da585983302", provider);
      const verifier = Verifier__factory.connect("0x71d379Db8dbf9d9f8454C95ad56b9D3463cF996B", signer)
      console.log('verifier', verifier)
      const a: [bigint, bigint] = [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])]
      const b: [[bigint, bigint], [bigint, bigint]] = [[BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])], [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])]]
      const c: [bigint, bigint] = [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])]
      const input: [bigint, bigint, bigint, bigint, bigint] = [BigInt(publicSignals[0]), BigInt(publicSignals[1]), BigInt(publicSignals[2]), BigInt(publicSignals[3]), BigInt(publicSignals[4])];
      console.log(a, b, c, input)
      const result = await verifier.verifyProof(a, b, c, input)
      setVerifierResult(result)
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
        <p>Verifier result: {verifierResult ? "true" : "false"}</p>
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
