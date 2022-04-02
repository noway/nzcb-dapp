import { AddressLinks } from "./AddressLinks";
import { CollectionLinks } from "./CollectionLinks";
import { CONTRACT_ADDRESS } from "./config";
import { ExternalLink } from "./ExternalLink";
import { styled } from "./styles";

const FooterSection = styled("div", {
  display: 'flex',
  gap: 10,
  flexDirection: 'column'
});

const FooterList = styled("div", {})

const FooterTitle = styled("h4", {
  color: 'grey'
})

export function Footer() {
  return (
    <div style={{
      border: '1px solid lightgrey',
      display: 'grid',
      flex: '1',
      width: '100%',
      margin: '20px',
      padding: '20px',
      boxSizing: 'border-box',
      maxWidth: 900,
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20
    }}>
      <FooterSection>
        <FooterTitle>Collection</FooterTitle>
        <FooterList>
          <CollectionLinks address={CONTRACT_ADDRESS} title="NZ COVID Badge collection" />
        </FooterList>
      </FooterSection>
      <FooterSection>
        <FooterTitle>Contract address</FooterTitle>
        <FooterList>
          <AddressLinks address={CONTRACT_ADDRESS} title="NZ COVID Badge contract address" />
        </FooterList>
      </FooterSection>
      <FooterSection>
        <FooterTitle>Source code</FooterTitle>
        <FooterList>
          <div>Contract GitHub repo</div>
          <div>Dapp GitHub repo</div>
          <div>ZK-SNARK GitHub repo</div>
        </FooterList>
      </FooterSection>
      <FooterSection>
        <FooterTitle>Badge assets</FooterTitle>
        <FooterList>
          <div><ExternalLink href="live_badge.svg" title="Live .svg file">Live .svg file</ExternalLink></div>
          <div><ExternalLink href="example_badge.svg" title="Example .svg file">Example .svg file</ExternalLink></div>
        </FooterList>
      </FooterSection>
    </div>
  )
}