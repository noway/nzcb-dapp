import React, { useEffect, useState } from "react";
import { groth16 } from 'snarkjs'
import { compare } from "./utils";
import { getNZCPPubIdentity,  getNZCPCircuitInput, signalsToPubIdentity, getProofArgs, getRS } from "./nzcpCircom";
import { ContractReceipt, providers, Wallet } from "ethers";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { CONTRACT_ADDRESS } from "./config";
import { EIP1193Provider } from "@web3-onboard/core";

type Props = Readonly<{
  passURI: string
  eip1193Provider: EIP1193Provider
  address: string
}>;


export function Prover(props: Props) {

  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [circuitResultMatches, setCircuitResultMatches] = useState<boolean>(false);
  const [verifierResult, setVerifierResult] = useState<ContractReceipt | null>(null);
  const passURI = props.passURI
  const eip1193Provider = props.eip1193Provider
  const address = props.address
  const provider = new providers.Web3Provider(eip1193Provider);
  const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, provider.getSigner())

  useEffect(() => {
    prove(passURI)
  }, [passURI])


  const prove = async (passURI: string) => {
    setProving(true)
    try {
      const rs = getRS(passURI);

      const expectedPubIdentity = await getNZCPPubIdentity(passURI, address);
      console.log('expectedPubIdentity',expectedPubIdentity)

      const circuitInput = getNZCPCircuitInput(passURI, address);
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

  return (
    <div>
      {proving ? "Proving, this may take a while..." : ""}
      {provingError ? "Error while proving:  " + provingError.message : ""}
      <p>Circuit result matches: {circuitResultMatches ? "yes" : "no"}</p>
      <p>Verifier result: {JSON.stringify(verifierResult, null, 2)}</p>
    </div>

  );
}