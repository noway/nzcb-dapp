import { NETWORK } from "./config";
import { ExternalLink } from "./ExternalLink";

export function CollectionLinks(props: Readonly<{ address: string, title: string }>) {
  const { address, title } = props;
  if (NETWORK === "rinkeby") {
    return (
      <>
        <div><ExternalLink href={`https://testnets.opensea.io/assets/${address}/0`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
      </>
    )
  }
  if (NETWORK === "polygonMumbai") {
    return (
      <>
        <div><ExternalLink href={`https://testnets.opensea.io/assets/mumbai/${address}/0`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
      </>
    )
  }
  if (NETWORK === "polygon") {
    return (
      <>
        <div><ExternalLink href={`https://opensea.io/assets/matic/${address}/0`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
        <div><ExternalLink href={`https://rarible.com/collection/polygon/${address}/items`} title={`${title} - Rarible`}>Rarible</ExternalLink></div>
      </>
    )
  }
  return (
    <>
      <div><ExternalLink href={`https://opensea.io/assets/${address}/0`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
      <div><ExternalLink href={`https://looksrare.org/collections/${address}`} title={`${title} - LooksRare`}>LooksRare</ExternalLink></div>
      <div><ExternalLink href={`https://zora.co/collections/${address}`} title={`${title} - Zora`}>Zora</ExternalLink></div>
      <div><ExternalLink href={`https://rarible.com/collection/${address}/items`} title={`${title} - Rarible`}>Rarible</ExternalLink></div>
      <div><ExternalLink href={`https://x.xyz/collection/ethereum/${address}`} title={`${title} - X`}>X</ExternalLink></div>
      <div><ExternalLink href={`https://x2y2.io/collection/${address}/items`} title={`${title} - x2y2.io`}>x2y2.io</ExternalLink></div>
    </>
  )

}