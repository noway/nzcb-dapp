import { AddressLinks } from "./AddressLinks";
import { CollectionLinks } from "./CollectionLinks";
import { CONTRACT_ADDRESS } from "./config";
import { styled } from "./styles";

const FooterSection = styled("div", {
  display: 'flex',
  gap: 10,
  flexDirection: 'column'
});

const FooterList = styled("div", {})

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
        <b>Collection</b>
        <FooterList>
          <CollectionLinks address={CONTRACT_ADDRESS} title="NZ COVID Badge collection" />
        </FooterList>
      </FooterSection>
      <FooterSection>
        <b>Contract Address</b>
        <FooterList>
          <AddressLinks address={CONTRACT_ADDRESS} title="NZ COVID Badge contract address" />
        </FooterList>
      </FooterSection>
      <FooterSection>
        <b>Source code</b>
        <FooterList>
          <div>Contract GitHub repo</div>
          <div>Dapp GitHub repo</div>
          <div>ZK-SNARK GitHub repo</div>
        </FooterList>
      </FooterSection>
      <FooterSection>
        <b>Badge assets</b>
        <FooterList>
          <div>.svg file</div>
          <div>Figma file</div>
        </FooterList>
      </FooterSection>
    </div>
  )
}