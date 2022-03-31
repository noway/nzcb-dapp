import { ConnectWallet } from "./ConnectWallet"
import { Header } from "./Header";
import { Sample } from "./Sample"
import { styled } from "./styles";

const Lead = styled("p", {
  fontSize: "1.5rem",
  textAlign: "center",
});

const Body = styled("div", {
  maxWidth: 600,
  margin: "0 auto",
});

const Section = styled("div", {
  justifyContent: "center",
  display: "flex",
  marginTop: 20
});

export function Landing() {
  return (
    <Body>
      <Header showWallet={false} showBack={false} />
      <Lead>An ERC721 project which lets you mint your NZ&nbsp;COVID&nbsp;vaccination&nbsp;status on the Ethereum network.</Lead>
      <Section>
        <Sample />
      </Section>
      <Section>
        <ConnectWallet />
      </Section>
      <h3>How does it work?</h3>
      <p>We take your NZ COVID Pass, deconstruct it, pass it through a custom ZK-SNARK and send it off to the smart contract for minting.</p>
      <h3>Does my NZ COVID Pass get saved in the calldata?</h3>
      <p><b>No.</b> We only take a few key parts of your NZ COVID Pass, pass them through a custom ZK-SNARK, then verify the zero knowledge proof of you holding the said pass in the smart contract. An attacker can’t reconstruct your NZ COVID Pass based on the blockchain logs.</p>
      <h3>Does my name get saved in the calldata?</h3>
      <p><b>No.</b> We send an anonymized identity of your NZ COVID Pass to the smart contract. To be precise, we send 2<sup>256</sup> hashes of random identities, one of which is yours. An attacker can’t figure out your name without reversing the hash function.</p>
      <h3>Do you save my NZ COVID Pass on the backend?</h3>
      <p><b>No.</b> NZ COVID Badge is a stateless decentralized application (Dapp) and doesn’t have a backend.</p>
      <h3>Does this website have analytics or telemetry?</h3>
      <p><b>No.</b> This website collects no analytics, telemetry or any other data derived from user actions. The website only communicates with an Ethereum node RPC endpoint to send and receive information from the blockchain.</p>
      <h3>How many badges I can mint?</h3>
      <p>You can only mint <b>1 badge per person</b>. Even if you request a new NZ COVID Pass from <a href="https://mycovidrecord.nz" rel="nofollow noopener noreferrer">mycovidrecord.nz</a>, your anonymized identity will match against the list of spent anonymized identities and prevent you from minting again.</p>
      <h3>Can I sell my NZ COVID Badge?</h3>
      <p>Yes. Although the chance that anyone will buy is infinite small. Don’t expect to recoup the ether you spent. </p>
      <h3>What’s the mint price?</h3>
      <p>Mint is <b>free</b>, it only costs gas to mint. Although the gas price itself is on the higher side, due to the Elliptic Curve signature and ZK-SNARK verification that happens in the smart contract.</p>
      <h3>What’s the roadmap?</h3>
      <p>There’s <b>no roadmap</b>, the project is finished once the contract has been deployed to the Ethereum mainnet.</p>
      <h3>How this project will be promoted?</h3>
      <p>This project will not be promoted.</p>
      <h3>How many badges can ever be minted?</h3>
      <p>The contract’s total supply does not have a hard limit but since there’s only 1 badge per person, the total supply is effectively limited by the New Zealand total population of about 5 million.</p>
      <h3>What do I get after mint?</h3>
      <p>You get an ERC721 NZ COVID Badge, nothing more.</p>
      <h3>How is this project licensed?</h3>
      <p>The badge asset is released as CC0 (public domain) while the code is licensed under MIT unless specified otherwise.</p>
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
      <p>Dapp GitHub repo</p>
      <p>ZK-SNARK GitHub repo</p>
      <h3>Badge assets</h3>
      <p>svg file</p>
      <p>figma file</p>
    </Body>
  )
}