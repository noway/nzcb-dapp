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
          <label>Switch Chain</label>
          {settingChain ? (
            <span>Switching chain...</span>
          ) : (
            <select
              onChange={({ target: { value } }) =>
                {
                  console.log('onChange called')
                  setChain({ chainId: value })
                }
              }
              value={connectedChain ? connectedChain.id : undefined}
            >
              {chains.map(({ id, label }) => {
                return <option key={id} value={id}>{label}</option>
              })}
            </select>
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