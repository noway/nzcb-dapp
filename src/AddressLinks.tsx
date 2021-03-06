import { NETWORK } from "./config";
import { ExternalLink } from "./ExternalLink";

export function AddressLinks(props: Readonly<{ address: string, title: string }>) {
  const { address, title } = props;
  const addr = address.slice(2)
  if (NETWORK === "rinkeby") {
    return (
      <>
        <div><ExternalLink href={`https://rinkeby.etherscan.io/address/0x${addr}`} title={`${title} - Etherscan`}>Etherscan</ExternalLink></div>
      </>
    )
  }
  if (NETWORK === "polygonMumbai") {
    return (
      <>
        <div><ExternalLink href={`https://mumbai.polygonscan.com/address/0x${addr}`} title={`${title} - PolygonScan`}>PolygonScan</ExternalLink></div>
      </>
    )
  }
  if (NETWORK === "polygon") {
    return (
      <>
        <div><ExternalLink href={`https://polygonscan.com/address/0x${addr}`} title={`${title} - PolygonScan`}>PolygonScan</ExternalLink></div>
        <div><ExternalLink href={`https://explorer.bitquery.io/matic/address/0x${addr}`} title={`${title} - Bitquery`}>Bitquery</ExternalLink></div>
      </>
    )
  }
  return (
    <>
      <div><ExternalLink href={`https://etherscan.io/address/0x${addr}`} title={`${title} - Etherscan`}>Etherscan</ExternalLink></div>
      <div><ExternalLink href={`https://www.etherchain.org/account/${addr}`} title={`${title} - Etherchain`}>Etherchain</ExternalLink></div>
      <div><ExternalLink href={`https://ethplorer.io/address/0x${addr}`} title={`${title} - Ethplorer`}>Ethplorer</ExternalLink></div>
      <div><ExternalLink href={`https://blockchair.com/ethereum/address/0x${addr}`} title={`${title} - Blockchair`}>Blockchair</ExternalLink></div>
      <div><ExternalLink href={`https://blockscout.com/eth/mainnet/address/0x${addr}/transactions`} title={`${title} - Blockscout`}>Blockscout</ExternalLink></div>
      <div><ExternalLink href={`https://www.oklink.com/en/eth/address/0x${addr}`} title={`${title} - OKLink`}>OKLink</ExternalLink></div>
    </>
  )
}