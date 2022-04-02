import { ReactNode } from "react";

export function ExternalLink(props: Readonly<{ href: string, title: string, children: ReactNode }>) {
  const { href, title } = props
  return (
    <a style={{ textDecoration: "none" }} href={href} rel="nofollow noopener noreferrer" title={title}>
      <span style={{ textDecoration: "underline" }}>{props.children}</span> ⧉
    </a>
  );
}

export function Collection(props: Readonly<{ address: string, title: string }>) {
  const { address, title } = props;
  return (<>
    <div><ExternalLink href={`https://opensea.io/assets/${address}/0`} title={`${title} - OpenSea`}>OpenSea</ExternalLink></div>
    <div><ExternalLink href={`https://looksrare.org/collections/${address}`} title={`${title} - LooksRare`}>LooksRare</ExternalLink></div>
    <div><ExternalLink href={`https://zora.co/collections/${address}`} title={`${title} - Zora`}>Zora</ExternalLink></div>
    <div><ExternalLink href={`https://rarible.com/token/${address}:0`} title={`${title} - Rarible`}>Rarible</ExternalLink></div>
    <div>{/* <ExternalLink href={`https://makersplace.com/authenticity/${address}/1/`} title={`${title} - MakersPlace`}>MakersPlace</ExternalLink> */}</div>
    <div>{/* <ExternalLink href={`https://niftygateway.com/marketplace/collectible/${address}`} title={`${title} - Nifty Gateway`}>Nifty Gateway</ExternalLink> */}</div>
    <div>{/* <ExternalLink href={`https://mintable.app/store/-/${address}`} title={`${title} - Mintable`}>Mintable</ExternalLink> */}</div>
  </>)

}