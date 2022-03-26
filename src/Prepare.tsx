import React, { useState } from "react";
import "./App.css";
import { groth16 } from 'snarkjs'
import { compare } from "./utils";
import { getNZCPPubIdentity,  getNZCPCircuitInput, signalsToPubIdentity, getProofArgs, getRS } from "./nzcpCircom";
import { ContractReceipt, providers, Wallet } from "ethers";
import { NZCOVIDBadge__factory } from "./contracts/types";


const CONTRACT_ADDRESS = "0xd5bB79bAa239196858afC864fEfA77beBA4b7AD1"

const provider = new providers.JsonRpcProvider("http://127.0.0.1:7545");
const signer = new Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
console.log('signer.address',signer.address)

const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, signer)

type Props = Readonly<{
  passURI: string
}>;

export function Prepare(props: Props) {
  const [passURI, setPassURI] = useState(props.passURI);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [circuitResultMatches, setCircuitResultMatches] = useState<boolean>(false);
  const [verifierResult, setVerifierResult] = useState<ContractReceipt | null>(null);

  const prove = async (passURI: string) => {
    setProving(true)
    try {
      const rs = getRS(passURI);

      const expectedPubIdentity = await getNZCPPubIdentity(passURI, signer.address);
      console.log('expectedPubIdentity',expectedPubIdentity)

      const circuitInput = getNZCPCircuitInput(passURI, signer.address);
      console.log('proving...', circuitInput)

      const { proof, publicSignals } = await groth16.fullProve(circuitInput, "nzcp_example.wasm", "nzcp_example_0001.zkey")

      const actualPubIdentity = signalsToPubIdentity(publicSignals as string[]);
      console.log('proof', proof, publicSignals, actualPubIdentity)

      const { a, b, c, input } = getProofArgs(proof, publicSignals);
      console.log(a, b, c, input)
      const tx = await nzCovidBadge.mint(a, b, c, input, rs)
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
