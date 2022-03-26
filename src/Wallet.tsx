import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";

type Props = Readonly<{}>;

export function Wallet(props: Props) {
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()

  return (
    <div>
      <button onClick={() => connect({})}>
        {connecting ? 'connecting' : 'connect'}
      </button>
      {wallet && (
        <div>
          {settingChain ? (
            <span>Switching chain...</span>
          ) : (
            <span>{chains.find(({ id }) => id === connectedChain?.id)?.label}</span>
          )}
          <button onClick={() => disconnect(wallet)}>
            Disconnect Wallet
          </button>
        </div>
      )}

      {connectedWallets.map(({ label, accounts }) => {
        return (
          <div key={label}>
            <div>{label}</div>
            <div>Accounts: {JSON.stringify(accounts, null, 2)}</div>
          </div>
        )
      })}
    </div>

  )
}