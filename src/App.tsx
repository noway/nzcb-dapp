import React, { useState } from "react";
import "./App.css";
import { groth16 } from 'snarkjs'
import { compare } from "./utils";
import { getNZCPPubIdentity,  getNZCPCircuitInput, signalsToPubIdentity, getProofArgs } from "./nzcpCircom";
import { ContractReceipt, providers, Wallet } from "ethers";
import { NZCOVIDBadge__factory } from "./contracts/types";

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"

const CONTRACT_ADDRESS = "0x2ae22131d63a5aEe587fe61e50fCeC76Df86a9EF"

const provider = new providers.JsonRpcProvider("http://127.0.0.1:7545");
const signer = new Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
console.log('signer.address',signer.address)

// TODO: dynamic
const r = "0xD2E07B1DD7263D833166BDBB4F1A093837A905D7ECA2EE836B6B2ADA23C23154";
const s = "0xFBA88A529F675D6686EE632B09EC581AB08F72B458904BB3396D10FA66D11477";

const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, signer)

function App() {
  const [passURI, setPassURI] = useState(EXAMPLE_PASS_URI);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [circuitResultMatches, setCircuitResultMatches] = useState<boolean>(false);
  const [verifierResult, setVerifierResult] = useState<ContractReceipt | null>(null);

  const prove = async (passURI: string) => {
    setProving(true)
    try {
      const circuitInput = getNZCPCircuitInput(passURI, signer.address);
      console.log('proving...', circuitInput)

      const { proof, publicSignals } = await groth16.fullProve(circuitInput, "nzcp_example.wasm", "nzcp_example_0001.zkey")

      const actualPubIdentity = signalsToPubIdentity(publicSignals as string[]);
      console.log('proof', proof, publicSignals, actualPubIdentity)

      const expectedPubIdentity = await getNZCPPubIdentity(passURI, signer.address);
      console.log('expectedPubIdentity',expectedPubIdentity)

      const { a, b, c, input } = getProofArgs(proof, publicSignals);
      console.log(a, b, c, input)
      const tx = await nzCovidBadge.mint(a, b, c, input, [r, s])
      const receipt = await tx.wait()
      
      setVerifierResult(receipt)
      console.log('receipt', receipt)


      if (
        compare(actualPubIdentity.nullifierHashPart, expectedPubIdentity.nullifierHashPart)
          && compare(actualPubIdentity.toBeSignedHash, expectedPubIdentity.toBeSignedHash)
          && compare(actualPubIdentity.data, expectedPubIdentity.data)
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

  const mint = async (e: React.FormEvent<HTMLFormElement>) => {
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
        <p>Verifier result: {JSON.stringify(verifierResult, null, 2)}</p>
        <form onSubmit={mint}>
          <div>
            <textarea
              onChange={(e) => setPassURI(e.target.value)}
              value={passURI}
              cols={50}
              rows={12}
            />
          </div>
          <button type="submit">Mint</button>
        </form>
      </header>
    </div>
  );
}

export default App;
