import { ExternalLink } from "./ExternalLink";
import { ConnectWallet } from "./ConnectWallet"
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sample } from "./Sample"
import { Body, styled } from "./styles";
import { ReactNode } from "react";

const Lead = styled("p", {
  fontSize: "1.5rem",
  textAlign: "center",
});

const Section = styled("div", {
  justifyContent: "center",
  display: "flex",
  marginTop: 20
});


const Link = styled("a", {
  textDecoration: "none",
});

function Question(props: { children?: ReactNode, title: string }) {
  const { title } = props;
  const id = title.replace(/\s/g, "-").replace(/[?'’]+/g, '').toLocaleLowerCase()
  return (
    <div>
      <h3 id={id}>{props.title} <Link href={`#${id}`}>🔗</Link></h3>
      {props.children}
    </div>
  )
}

export function Landing() {
  return <>
    <Header isLanding={true} showBack={false} />
    <Body>
      <Lead>An ERC721 project that lets you mint your NZ&nbsp;COVID&nbsp;vaccination&nbsp;status.</Lead>
      <Section>
        <Sample />
      </Section>
      <Section>
        <ConnectWallet />
      </Section>
      <Question title="How does it work?">
        <p>NZ COVID Badge takes your NZ COVID Pass, deconstructs it, passes it through a custom ZK-SNARK and sends it off to the smart contract for minting.</p>
      </Question>
      <Question title="Does my NZ COVID Pass get saved in the calldata?">
        <p><b>No.</b> NZ COVID Badge only takes a few key parts of your NZ COVID Pass, passes them through a custom ZK-SNARK, then verifies the zero knowledge proof of you holding the said pass in the smart contract. An attacker can’t reconstruct your NZ COVID Pass based on blockchain logs.</p>
      </Question>
      <Question title="Does my name get saved in the calldata?">
        <p><b>No.</b> NZ COVID Badge sends an anonymized identity of your NZ COVID Pass to the smart contract. To be precise, NZ COVID Badge sends 2<sup>256</sup> hashes of random identities, one of which is yours. An attacker can’t figure out your name without reversing the hash function.</p>
      </Question>
      <Question title="Do you save my NZ COVID Pass on the backend?">
        <p><b>No.</b> NZ COVID Badge is a stateless decentralized application (Dapp) and doesn’t have a backend.</p>
      </Question>
      <Question title="Does this website send analytics or telemetry?">
        <p><b>No.</b> This website collects no analytics, telemetry or any other data derived from user actions. The website only communicates with an EVM node via an RPC endpoint to send and receive information from the blockchain.</p>
      </Question>
      <Question title="How many badges can I mint?">
        <p>You can only mint <b>1 badge per person</b>. Even if you request a new NZ COVID Pass from <ExternalLink href="https://mycovidrecord.nz" title="mycovidrecord.nz">mycovidrecord.nz</ExternalLink>, your anonymized identity will match against the list of spent anonymized identities and prevent you from minting again.</p>
      </Question>
      <Question title="Can I sell my NZ COVID Badge?">
        <p>Yes. Although the chance that anyone will buy is infinite small. Don’t expect to recoup the funds you spent. </p>
      </Question>
      <Question title="What’s the mint price?">
        <p>Mint is <b>free</b>, it only costs gas to mint. Although the gas price itself is on the higher side, due to the Elliptic Curve signature and ZK-SNARK verification that happens in the smart contract.</p>
      </Question>
      <Question title="What’s the roadmap?">
        <p>There’s <b>no roadmap</b>, the project is finished once the contract has been deployed on mainnet.</p>
      </Question>
      <Question title="How this project will be promoted?">
        <p>This project will not be promoted.</p>
      </Question>
      <Question title="How many badges can ever be minted?">
        <p>The contract’s total supply does not have a hard limit but since there’s only 1 badge per person, the total supply is effectively limited by the New Zealand total population of about 5 million.</p>
      </Question>
      <Question title="What do I get after mint?">
        <p>You get an ERC721 NZ COVID Badge, nothing more.</p>
      </Question>
      <Question title="How is this project licensed?">
        <p>The badge asset is released as CC0 (public domain) while the code is licensed under MIT unless specified otherwise.</p>
      </Question>
      <Question title="Has there been an audit done on the contract?">
        <p>No. </p>
      </Question>
      <Question title="What browser should I use?">
        <p>NZ COVID Badge only works in Mozilla Firefox. </p>
      </Question>
      <Question title="Is NZ COVID Badge vulnerable to The Frozen Heart?">
        <p>No, NZ COVID Badge is not vulnerable to <ExternalLink href="https://blog.trailofbits.com/2022/04/13/part-1-coordinated-disclosure-of-vulnerabilities-affecting-girault-bulletproofs-and-plonk/" title="The Frozen Heart vulnerability">The Frozen Heart</ExternalLink>. </p>
      </Question>
      <Question title="How long it takes to compute a proof?">
        <p>It takes somewhere in between 14 and 43 minutes to compute a proof of holding a pass on a modern CPU.</p>
      </Question>
      <Question title="Can I read more about the technical implementation?">
        <p>See <ExternalLink href="https://github.com/noway/nzcb/blob/main/TECH_SPEC.md" title="NZ COVID Badge - Tech Spec">NZ COVID Badge - Tech Spec</ExternalLink></p>
      </Question>
    </Body>
    <Footer />
  </>
}