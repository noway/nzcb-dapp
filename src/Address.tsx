export function Address(props: Readonly<{ address: string, title:string }>) {
  const { address, title } = props;
  const addr = address.slice(2)
  const rel = "nofollow noopener noreferrer"
  return (<>
    <a href={`https://etherscan.io/address/0x${addr}`} rel={rel} title={`${title} - Etherscan`}>Etherscan -^</a>
    <a href={`https://www.etherchain.org/account/${addr}`} rel={rel} title={`${title} - Etherchain`}>Etherchain -^</a>
    <a href={`https://ethplorer.io/address/0x${addr}`} rel={rel} title={`${title} - Ethplorer`}>Ethplorer -^</a>
    <a href={`https://blockchair.com/ethereum/address/0x${addr}`} rel={rel} title={`${title} - Blockchair`}>Blockchair -^</a>
    <a href={`https://blockscout.com/eth/mainnet/address/0x${addr}/transactions`} rel={rel} title={`${title} - Blockscout`}>Blockscout -^</a>
    <a href={`https://www.oklink.com/en/eth/address/0x${addr}`} rel={rel} title={`${title} - OKLink`}>OKLink -^</a>
  </>)
}