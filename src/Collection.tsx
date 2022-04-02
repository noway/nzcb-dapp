export function Collection(props: Readonly<{ address: string, title: string }>) {
  const { address, title } = props;
  const rel = "nofollow noopener noreferrer"
  return (<>
    <div><a href={`https://opensea.io/assets/${address}/0`} rel={rel} title={`${title} - OpenSea`}>OpenSea -^</a></div>
    <div><a href={`https://looksrare.org/collections/${address}`} rel={rel} title={`${title} - LooksRare`}>LooksRare -^</a></div>
    <div><a href={`https://zora.co/collections/${address}`} rel={rel} title={`${title} - Zora`}>Zora -^</a></div>
    <div><a href={`https://rarible.com/token/${address}:0`} rel={rel} title={`${title} - Rarible`}>Rarible -^</a></div>
    <div>{/* <a href={`https://makersplace.com/authenticity/${address}/1/`} rel={rel} title={`${title} - MakersPlace`}>MakersPlace -^</a> */}</div>
    <div>{/* <a href={`https://niftygateway.com/marketplace/collectible/${address}`} rel={rel} title={`${title} - Nifty Gateway`}>Nifty Gateway -^</a> */}</div>
    <div>{/* <a href={`https://mintable.app/store/-/${address}`} rel={rel} title={`${title} - Mintable`}>Mintable -^</a> */}</div>
  </>)

}