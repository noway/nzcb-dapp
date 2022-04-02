import { EIP1193Provider } from "@web3-onboard/core";
import { useConnectWallet } from "@web3-onboard/react";
import { BigNumber, ContractReceipt, providers } from "ethers";
import { ReactNode, useContext, useState } from "react";
import { CONTRACT_ADDRESS } from "./config";
import { RouteContext } from "./contexts";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { DataBit } from "./DataBit";
import { Header } from "./Header";
import { comparePubIdentities, getProofArgs, getRS, Proof, PubIdentity, PublicSignals, signalsToPubIdentity } from "./nzcpCircom";
import { Body, CtaContainer } from "./styles";
import { toHexString } from "./utils";

function DataSection(props: Readonly<{ title: string, children: ReactNode }>) {
  const { title } = props
  return (
    <div style={{ border: "1px solid lightgrey", marginTop: 20, padding: 10 }}>
      <h4>{title}</h4>
      <div style={{ marginTop: 10 }}>
        {props.children}
      </div>
    </div>
  )
}

function PublicIdentity(props: { pubIdentity: PubIdentity }) {
  const { pubIdentity } = props
  const { nullifierHashPart, toBeSignedHash, data, exp } = pubIdentity
  return (
    <DataSection title="Anonymized identity">
      <DataBit title="nullifierHashPart" value={`0x${toHexString(nullifierHashPart)}`} />
      <DataBit title="toBeSignedHash" value={`0x${toHexString(toBeSignedHash)}`} />
      <DataBit title="address" value={`0x${toHexString(data)}`} />
      <DataBit title="exp" value={`${Number(exp)}`} />
    </DataSection>
  )
}

function Signature(props: { rs: [r: Uint8Array, s: Uint8Array] }) {
  const { rs } = props
  return (
    <DataSection title="Pass signature">
      <DataBit title="r" value={`0x${toHexString(rs[0])}`} />
      <DataBit title="s" value={`0x${toHexString(rs[1])}`} />
    </DataSection>
  )
}

function ProofComponent(props: { proof: Proof }) {
  const { proof } = props
  const { pi_a: a, pi_b: b, pi_c: c } = proof
  function toHex(n: string) {
    return BigNumber.from(n).toHexString()
  }
  return (
    <DataSection title="Proof">
      <DataBit title="a" value={`[${toHex(a[0])}, ${toHex(a[1])}]`} />
      <DataBit title="b" value={`[[${toHex(b[0][1])}, ${toHex(b[0][0])}], [${toHex(b[1][1])}, ${toHex(b[1][0])}]]`} />
      <DataBit title="c" value={`[${toHex(c[0])}, ${toHex(c[1])}]`} />
    </DataSection>
  )
}
function PreFlightCheck(props: { pubIdentityMatches: boolean }) {
  const { pubIdentityMatches } = props
  return (
    <DataSection title="Pre-flight check">
      <DataBit title="matches" value={pubIdentityMatches ? "yes" : "no"} />
    </DataSection>
  )
}

type SuccessProps = Readonly<{
  receipt: ContractReceipt
}>
function Success(props: SuccessProps) {
  const { receipt } = props
  const { transactionHash } = receipt
  const events = receipt.events || []
  const event = events.find(e => e.transactionHash === transactionHash)
  const id = event?.args?.id as BigNumber
  return (
    <div>
      <h3>Success</h3>
      {/* TODO: block explorer links */}
      <div>Transaction Hash: {receipt.transactionHash}</div>
      <div>NZ COVID Badge #{id.toString()}</div>
    </div>
  )
}


type MintContentsProps = Readonly<{
  eip1193Provider: EIP1193Provider
  passURI: string
  publicSignals: PublicSignals
  proof: Proof
  pubIdentity: PubIdentity
}>

type ProviderError = { code: number, data: { code: number, message: string, data: { name: string, stack: string } }, message: string }
type MintingError = Error | ProviderError

function MintContents(props: MintContentsProps) {
  const { eip1193Provider, passURI, publicSignals, proof, pubIdentity } = props
  const provider = new providers.Web3Provider(eip1193Provider);
  const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, provider.getSigner())
  const [minting, setMinting] = useState(false)
  const [mintingError, setMintingError] = useState<Error | null>(null)
  const [receipt, setReceipt] = useState<ContractReceipt | null>(null)
  const routeContext = useContext(RouteContext);

  async function mint() {
    setMinting(true)
    setMintingError(null)
    try {
      const rs = getRS(passURI);
      const { a, b, c, input } = getProofArgs(proof, publicSignals);

      const tx = await nzCovidBadge.mint(a, b, c, input, rs)
      const receipt = await tx.wait()
      setReceipt(receipt)
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

  function done() {
    routeContext.navigate(["account", null]);
  }
  return (
    <>
      <h3 style={{ marginTop: 20 }}>Proof</h3>
      <PreFlightCheck pubIdentityMatches={pubIdentityMatches} />
      <h3 style={{ marginTop: 20 }}>To be sent to the smart contract</h3>
      <PublicIdentity pubIdentity={pubIdentity} />
      <Signature rs={getRS(passURI)} />
      <ProofComponent proof={proof} />
      <div>{minting ? "Minting..." : ""}</div>
      <div>{mintingError ? "Error while minting:  " + mintingError.message : ""}</div>
      {receipt ? <Success receipt={receipt} /> : null}
      {/* TODO: add disclaimers */}
      <CtaContainer>
        {!receipt ?
          <button type="button" onClick={() => mint()} disabled={minting || !pubIdentityMatches}>Mint</button> :
          <button type="button" onClick={() => done()}>Done</button>
        }
      </CtaContainer>
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
  return <>
    <Header showWallet={true} showBack={true} />
    <Body>
      {eip1193Provider ?
        <MintContents
          eip1193Provider={eip1193Provider}
          passURI={passURI}
          publicSignals={publicSignals}
          proof={proof}
          pubIdentity={pubIdentity}
        /> :
        <div>Please connect wallet</div>}
    </Body>
  </>;
}