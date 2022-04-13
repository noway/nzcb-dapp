import { NETWORK } from "./config";
import { ExternalLink } from "./ExternalLink";

export function AssetLinks(props: Readonly<{ address: string, title: string, id: string }>) {
  const { address, id, title } = props;
  if (NETWORK === "rinkeby") {
    // TODO: more links
    return (
      <>
        <div><ExternalLink href={`https://testnets.opensea.io/assets/${address}/${id}`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
      </>
    )
  }
  if (NETWORK === "polygonMumbai") {
    return (
      <>
        <div><ExternalLink href={`https://testnets.opensea.io/assets/mumbai/${address}/${id}`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
      </>
    )
  }
  if (NETWORK === "polygon") {
    return (
      <>
        <div><ExternalLink href={`https://opensea.io/assets/matic/${address}/${id}`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
        <div><ExternalLink href={`https://rarible.com/token/polygon/${address}:${id}`} title={`${title} - Rarible`}>Rarible</ExternalLink></div>
      </>
    )
  }

  return (<div>
    <div><ExternalLink href={`https://opensea.io/assets/${address}/${id}`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
    <div><ExternalLink href={`https://looksrare.org/collections/${address}/${id}`} title={`${title} - LooksRare`}>LooksRare</ExternalLink></div>
    <div><ExternalLink href={`https://zora.co/collections/${address}/${id}`} title={`${title} - Zora`}>Zora</ExternalLink></div>
    <div><ExternalLink href={`https://rarible.com/token/${address}:${id}`} title={`${title} - Rarible`}>Rarible</ExternalLink></div>
  </div>)

}