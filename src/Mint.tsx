import { EIP1193Provider } from "@web3-onboard/core";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { BigNumber, ContractReceipt, providers } from "ethers";
import { useContext, useState } from "react";
import { CONTRACT_ADDRESS } from "./config";
import { RouteContext } from "./contexts";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { DataBit, DataSection } from "./DataSection";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { comparePubIdentities, getVerifyArgs, getRS, Proof, PubIdentity, PublicSignals, signalsToPubIdentity } from "./nzcpCircom";
import { bytesToHex } from "./nzcpTools";
import { Status, StatusError } from "./Status";
import { Body, CtaContainer } from "./styles";
import { Transaction } from "./Transaction";

function PublicIdentity(props: Readonly<{ pubIdentity: PubIdentity }>) {
  const { pubIdentity } = props
  const { nullifierHashPart, toBeSignedHash, data, exp } = pubIdentity
  return (
    <DataSection title="Anonymized identity">
      <DataBit title="nullifierHashPart" value={`0x${bytesToHex(nullifierHashPart)}`} />
      <DataBit title="toBeSignedHash" value={`0x${bytesToHex(toBeSignedHash)}`} />
      <DataBit title="address" value={`0x${bytesToHex(data)}`} />
      <DataBit title="exp" value={`${Number(exp)}`} />
    </DataSection>
  )
}

function PublicSignalsComponent(props: Readonly<{ publicSignals: PublicSignals }>) {
  const { publicSignals: signals } = props
  return (
    <DataSection title="Public signals">
      <DataBit title="input" value={JSON.stringify(signals, null, 2)} />
    </DataSection>
  )
}

function Signature(props: Readonly<{ rs: [r: Uint8Array, s: Uint8Array] }>) {
  const { rs } = props
  return (
    <DataSection title="Pass signature">
      <DataBit title="r" value={`0x${bytesToHex(rs[0])}`} />
      <DataBit title="s" value={`0x${bytesToHex(rs[1])}`} />
    </DataSection>
  )
}

function ProofComponent(props: Readonly<{ proof: Proof }>) {
  const { proof } = props
  return (
    <DataSection title="Proof calldata">
      {Object.entries(proof).map(([key, value]) => (
        <DataBit title={key} value={JSON.stringify(value, null, 2)} />
      ))}
    </DataSection>
  )
}
function PreFlightCheck(props: Readonly<{ pubIdentityMatches: boolean }>) {
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
      <div style={{ marginTop: 10 }}>
        <div>Congratulations! You have successfully minted <b>NZ COVID Badge #{id.toString()}</b></div>
        <DataSection title="Transaction">
          <div style={{ display: 'inline-grid', gap: 10 }}>
            <DataBit title="hash" value={receipt.transactionHash} />
            <Transaction txHash={receipt.transactionHash} title="Mint Transaction" />
          </div>
        </DataSection>
      </div>
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
  const { eip1193Provider, passURI, publicSignals: publicSignalsJS, proof: proofJS, pubIdentity } = props
  const provider = new providers.Web3Provider(eip1193Provider);
  const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, provider.getSigner())
  const [minting, setMinting] = useState(false)
  const [mintingError, setMintingError] = useState<Error | null>(null)
  const [receipt, setReceipt] = useState<ContractReceipt | null>(null)
  const routeContext = useContext(RouteContext);
  const [open, setOpen] = useState(false);
  const [{ chains, connectedChain }] = useSetChain()

  function toggle() {
    setOpen(!open)
  }

  async function mint() {
    setMinting(true)
    setMintingError(null)
    try {
      const rs = getRS(passURI);
      const data = await getVerifyArgs(proofJS, publicSignalsJS);
      console.log(data)
      const { proof, publicSignals } = data
      const tx = await nzCovidBadge.mint(proof, publicSignals as [string, string, string], rs)
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
  const pubIdentityMatches = comparePubIdentities(pubIdentity, signalsToPubIdentity(publicSignalsJS));

  function done() {
    routeContext.navigate(["account", null]);
  }
  return (
    <>
      <h3 style={{ marginTop: 20 }}>Proof</h3>
      <PreFlightCheck pubIdentityMatches={pubIdentityMatches} />
      <h3 style={{
        marginTop: 20,
        verticalAlign: 'middle',
        display: 'flex'
      }}>Advanced <button style={{ marginLeft: 10 }} onClick={toggle}>{open ? '-' : '+'}</button></h3>
      {open ? <>
        <PublicIdentity pubIdentity={pubIdentity} />
        <Signature rs={getRS(passURI)} />
        <ProofComponent proof={proofJS} />
        <PublicSignalsComponent publicSignals={publicSignalsJS} />
      </> : null}
      <div style={{ marginTop: 20 }}>
        <h3>Disclaimer</h3>
        <p>By minting you confirm that you understand the following:</p>
        <ul>
          <li>Minting may result in loss of Ether</li>
          <li>The smart contract was not audited</li>
          <li>The smart contract may contain bugs</li>
          <li>NZ COVID Badge is not an investment</li>
          <li>There's no liquidity for your NZ COVID Badge</li>
          <li>You're minting on {chains.find(({ id }) => id === connectedChain?.id)?.label}</li>
        </ul>
      </div>
      {minting ? <Status status="Minting..." /> : null}
      {mintingError ? <StatusError error={mintingError} /> : null}
      {receipt ? <Success receipt={receipt} /> : null}
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
    <Header isLanding={false} showBack={true} />
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
    <Footer />
  </>;
}