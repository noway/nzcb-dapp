import { AddressLinks } from "./AddressLinks";
import { CollectionLinks } from "./CollectionLinks";
import { CONTRACT_ADDRESS, EXAMPLE_ASSET_URL, EXAMPLE_ZKEY_FILE, LIVE_ASSET_URL, LIVE_ZKEY_FILE } from "./config";
import { ExternalLink } from "./ExternalLink";
import { styled } from "./styles";

const FooterContainer = styled("div", {
  border: '1px solid lightgrey',
  display: 'grid',
  flex: '1',
  width: '100%',
  margin: '20px',
  padding: '20px',
  boxSizing: 'border-box',
  maxWidth: 900,
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 10
})

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
    <FooterContainer>
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
          <div><ExternalLink href="https://github.com/noway/nzcb-dapp" title="Dapp repo">Dapp repo</ExternalLink></div>
          <div><ExternalLink href="https://github.com/noway/nzcb" title="Contract repo">Contract repo</ExternalLink></div>
          <div><ExternalLink href="https://github.com/noway/nzcb-circom" title="ZK-SNARK repo">ZK-SNARK repo</ExternalLink></div>
        </FooterList>
      </FooterSection>
      <FooterSection>
        <FooterTitle>Badge assets</FooterTitle>
        <FooterList>
          <div><ExternalLink href={LIVE_ASSET_URL} title="Live .svg file">Live .svg file</ExternalLink></div>
          <div><ExternalLink href={EXAMPLE_ASSET_URL} title="Example .svg file">Example .svg file</ExternalLink></div>
        </FooterList>
      </FooterSection>
      <FooterSection>
        <FooterTitle>Proving key</FooterTitle>
        <FooterList>
          <div><ExternalLink href={LIVE_ZKEY_FILE} title="Live .zkey file">Live .zkey file</ExternalLink></div>
          <div><ExternalLink href={EXAMPLE_ZKEY_FILE} title="Example .zkey file">Example .zkey file</ExternalLink></div>
        </FooterList>
      </FooterSection>
    </FooterContainer>
  )
}