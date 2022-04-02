import { Address } from "./Address";
import { Collection } from "./Collection";
import { CONTRACT_ADDRESS } from "./config";

export function Footer() {
  return (
    <div style={{
      border: '1px solid lightgrey',
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
      width: '100%',
      margin: '20px',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <h2>Links</h2>
      <b>Collection</b>
      <Collection address="0x5af0d9827e0c53e4799bb226655a1de152a425a5" title="NZ COVID Badge collection"/>
      <b>Contract Address</b>
      <Address address={CONTRACT_ADDRESS} title="NZ COVID Badge contract address"/>
      <b>Source code</b>
      <div>Contract GitHub rpeo</div>
      <div>Dapp GitHub repo</div>
      <div>ZK-SNARK GitHub repo</div>
      <b>Badge assets</b>
      <div>.svg file</div>
      <div>Figma file</div>
    </div>
  )
}