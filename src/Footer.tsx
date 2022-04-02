import { Address } from "./Address";
import { Collection } from "./Collection";
import { CONTRACT_ADDRESS } from "./config";
import { styled } from "./styles";

const FooterSection = styled("div", {})

const FooterList = styled("div", {
  marginTop: 10
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
      {/* <h2>Links</h2> */}
      <FooterSection>
        <b>Collection</b>
        <FooterList>
          <Collection address={CONTRACT_ADDRESS} title="NZ COVID Badge collection" />
        </FooterList>
      </FooterSection>
      <FooterSection>
        <b>Contract Address</b>
        <FooterList>
          <Address address={CONTRACT_ADDRESS} title="NZ COVID Badge contract address" />
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