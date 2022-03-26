import { ConnectWallet } from "./ConnectWallet"
import { Sample } from "./Sample"
import { styled } from "./styles";

type Props = Readonly<{}>


export const Lead = styled("p", {
  fontSize: "1.5rem",
});


export function Landing(props: Props) {
  return (
    <div>
      <h1>NZ COVID Badge</h1>
      <Lead>An ERC721 project which lets you mint your NZ COVID vaccination status on the Ethereum blockchain.</Lead>
      <Sample />
      <ConnectWallet />
      <h3>How does it work?</h3>
      <p>We take your NZ COVID Pass, deconstruct it, pass it through a custom ZK-SNARK and send it off to the blockchain for minting.</p>
      <h3>Does my NZ COVID Pass gets written onto the blockchain?</h3>
      <p><b>No.</b> We only take a few key parts of your NZ COVID Pass, pass them through a custom ZK-SNARK, then verify the zero knowledge proof of you holding the said pass on the blockchain. An attacker can’t reconstruct your NZ COVID Pass based on the blockchain logs.</p>
      <h3>Does my name gets written onto the blockchain?</h3>
      <p><b>No.</b> We send an anonimized identity of your NZ COVID Pass to the blockchain. To be precise, we send 2<sup>256</sup> hashes of random identities, one of which is yours. An attacker can’t figure out your name without reversing the hash function.</p>
      <h3>Do you save my NZ COVID Pass on the backend?</h3>
      <p><b>No.</b> NZ COVID Badge is a stateless decentralized application (dApp) and doesn’t have a backend.</p>
      <h3>Does this website have analytics or telemetry?</h3>
      <p><b>No.</b> This website collects no analytics, telemetry or any other data derived from user actions. The website only communicates with an Ethereum node RPC endpoint to send and recieve information from the blockchain.</p>
      <h3>How many badges can I mint?</h3>
      <p>You can only mint <b>1 badge per person</b>. Even if you request a new NZ COVID Pass from <a href="https://mycovidrecord.nz" rel="nofollow noopener noreferrer">mycovidrecord.nz</a>, your anonimized identity will match against the list of spent anonimized identities and prevent you from minting again.</p>
      <h3>Can I sell my NZ COVID Badge?</h3>
      <p>Yes. Although the chance that anyone will buy is infinite small. Don’t expect to recoup the ether you spent. </p>
      <h3>What’s the mint price?</h3>
      <p>Mint is <b>free</b>, it only costs gas to mint. Although the gas price itself is on the higher side, due to the Elliptic Curve signature and ZK-SNARK verification that happens on the blockchain.</p>
      <h3>What’s the roadmap?</h3>
      <p>There’s <b>no roadmap</b>, the project is finished once the contract has been deployed to the Ethereum mainnet.</p>
      <h3>How this project will be promoted?</h3>
      <p>This project will not be promoted.</p>
      <h3>How many badges can ever be minted?</h3>
      <p>The contract’s total supply doesn’t have a hard limit but since there’s only 1 badge per person, the total supply is effectively limited by the New Zealand total population of about 5 million.</p>
      <h3>What do I get after mint?</h3>
      <p>You get an ERC721 NZ COVID Badge. Nothing less, nothing more.</p>
      <h2>Links</h2>
      <h3>Collection</h3>
      <p>OpenSea</p>
      <p>LooksRare</p>
      <p>Zorb</p>
      <h3>Contract Address</h3>
      <p>Etherscan</p>
      <p>etherchain.org</p>
      <h3>Source code</h3>
      <p>Contract GitHub rpeo</p>
      <p>dApp GitHub repo</p>
      <p>ZK-SNARK GitHub repo</p>
    </div>
  )
}