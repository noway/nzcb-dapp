import { EIP1193Provider } from "@web3-onboard/core";
import { useConnectWallet } from "@web3-onboard/react";
import { BigNumber, providers } from "ethers";
import { useState } from "react";
import { CONTRACT_ADDRESS } from "./config";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { Header } from "./Header";
import { getProofArgs, getRS, Proof, PubIdentity, PublicSignals, signalsToPubIdentity } from "./nzcpCircom";
import { compare, toHexString } from "./utils";


function comparePubIdentities(a: PubIdentity, b: PubIdentity) {
  return compare(a.nullifierHashPart, b.nullifierHashPart)
    && compare(a.toBeSignedHash, b.toBeSignedHash)
    && compare(a.data, b.data)
    && a.exp === b.exp
}

export function PublicIdentity(props: {pubIdentity: PubIdentity}) {
  const {pubIdentity} = props
  return (
    <code>
      <div>nullifierHashPart: 0x{toHexString(pubIdentity.nullifierHashPart)}</div>
      <div>toBeSignedHash: 0x{toHexString(pubIdentity.toBeSignedHash)}</div>
      <div>address: 0x{toHexString(pubIdentity.data)}</div>
      <div>exp: {Number(pubIdentity.exp)}</div>
    </code>
  )
}

export function Signature(props: {rs: [r: Uint8Array, s: Uint8Array]}) {
  const {rs} = props
  return (
    <code>
      <div>r: 0x{toHexString(rs[0])}</div>
      <div>s: 0x{toHexString(rs[1])}</div>
    </code>
  )
}

export function ProofComponent(props: {proof: Proof}) {
  const {proof} = props
  const {pi_a, pi_b, pi_c} = proof
  function toHex(n: string) {
    return BigNumber.from(n).toHexString()
  }
  return (
    <code>
      <div>a: [{toHex(pi_a[0])}, {toHex(pi_a[1])}]</div>
      <div>b: [[{toHex(pi_b[0][1])}, {toHex(pi_b[0][0])}], [{toHex(pi_b[1][1])}, {toHex(pi_b[1][0])}]]</div>
      <div>c: [{toHex(pi_c[0])}, {toHex(pi_c[1])}]</div>
    </code>
  )
}

type MintContentsProps = Readonly<{
  eip1193Provider: EIP1193Provider
  passURI: string
  publicSignals: PublicSignals
  proof: Proof
  pubIdentity: PubIdentity
}>

type ProviderError = {code: number, data: {code: number, message: string, data: {name: string, stack: string}}, message: string}
type MintingError = Error | ProviderError

function MintContents(props: MintContentsProps) {
  const { eip1193Provider, passURI, publicSignals, proof, pubIdentity } = props 
  const provider = new providers.Web3Provider(eip1193Provider);
  const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, provider.getSigner())
  const [minting, setMinting] = useState(false)
  const [mintingError, setMintingError] = useState<Error | null>(null)

  async function mint() {
    setMinting(true)
    setMintingError(null)
    try {
      const rs = getRS(passURI);
      const { a, b, c, input } = getProofArgs(proof, publicSignals);

      const tx = await nzCovidBadge.mint(a, b, c, input, rs)
      const receipt = await tx.wait()
    }
    catch (e) {
      const error = e as MintingError
      if ("data" in error) {
        setMintingError(new Error(error.data.message))
      }
      else {
        setMintingError(error)
      }
    }
    setMinting(false)
  }
  const pubIdentityMatches = comparePubIdentities(pubIdentity, signalsToPubIdentity(publicSignals));
  return (
    <>
      <h3>To be sent to the blockhain</h3>
      <div>
        <h4>Anonimized identity</h4>
        <PublicIdentity pubIdentity={pubIdentity}/>
        <h4>Pass signature</h4>
        <Signature rs={getRS(passURI)} />
        <h4>Proof</h4>
        <ProofComponent proof={proof}/>
        {pubIdentityMatches ? <div><h4>Pre-flight check</h4>OK</div> : null}
        {!pubIdentityMatches ? <div><h4>Pre-flight check</h4>ERROR</div> : null}
      </div>
      <div>{minting ? "Minting, this may take a while..." : ""}</div>
      <div>{mintingError ? "Error while minting:  " + mintingError.message : ""}</div>
      <button type="button" onClick={() => mint()} disabled={minting}>Mint</button>
    </>
  )
}

type Props = Readonly<{
  passURI: string
  publicSignals: PublicSignals
  proof: Proof
  pubIdentity: PubIdentity
}>

export function Mint(props: Props) {
  const { passURI, publicSignals, proof, pubIdentity } = props
  const [{ wallet }] = useConnectWallet()
  const eip1193Provider = wallet?.provider
  return (
    <div>
      <Header showWallet={true} showBack={true} />
      {eip1193Provider ? 
        <MintContents
          eip1193Provider={eip1193Provider}
          passURI={passURI} 
          publicSignals={publicSignals}
          proof={proof}
          pubIdentity={pubIdentity}
        /> : 
        <div>Please connect wallet</div>}
    </div>
  );
}