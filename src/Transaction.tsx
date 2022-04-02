import { ExternalLink } from "./ExternalLink";

export function Transaction(props: Readonly<{ txHash: string, title: string }>) {
  const { txHash, title } = props
  return (
    <div>
      <div><ExternalLink href={`https://etherscan.io/tx/${txHash}`} title={`${title} - Etherscan`}>Etherscan</ExternalLink></div>
      <div><ExternalLink href={`https://www.etherchain.org/tx/${txHash}`} title={`${title} - Etherchain`}>Etherchain</ExternalLink></div>
      <div><ExternalLink href={`https://ethplorer.io/tx/${txHash}`} title={`${title} - Ethplorer`}>Ethplorer</ExternalLink></div>
      <div><ExternalLink href={`https://blockchair.com/ethereum/transaction/${txHash}`} title={`${title} - Blockchair`}>Blockchair</ExternalLink></div>
      <div><ExternalLink href={`https://blockscout.com/eth/mainnet/tx/${txHash}`} title={`${title} - Blockscout`}>Blockscout</ExternalLink></div>
      <div><ExternalLink href={`https://www.oklink.com/eth/tx/${txHash}`} title={`${title} - OKLink`}>OKLink</ExternalLink></div>
    </div>
  )
}