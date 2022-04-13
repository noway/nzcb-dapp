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

  return (<>
    <div><ExternalLink href={`https://opensea.io/assets/${address}/0`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
    <div><ExternalLink href={`https://looksrare.org/collections/${address}`} title={`${title} - LooksRare`}>LooksRare</ExternalLink></div>
    <div><ExternalLink href={`https://zora.co/collections/${address}`} title={`${title} - Zora`}>Zora</ExternalLink></div>
    <div><ExternalLink href={`https://rarible.com/token/${address}:0`} title={`${title} - Rarible`}>Rarible</ExternalLink></div>
  </>)

}