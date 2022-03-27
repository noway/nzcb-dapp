import { Account } from "@web3-onboard/core/dist/types";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import { useContext, useEffect } from "react";
import { RouteContext } from "./contexts";
import { truncateAddress } from "./utils";

type AccountProps = Readonly<{
  account: Account
}>

function AccountContent(props: AccountProps) {
  const {account} = props
  return (
    <div>
      {account.ens ? 
        <div>{account.ens.name}</div> : 
        <div>{truncateAddress(account.address)}</div>}
    </div>
  )
}

export function Wallet() {
  const routeContext = useContext(RouteContext);
  const [{ chains, connectedChain, settingChain }] = useSetChain()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()

  useEffect(() => {
    if (!wallet && !connecting) {
      routeContext.navigate(["landing", null]);
    }
  }, [wallet, connecting, routeContext])


  return (
    <div>
      {!wallet ? (
        connecting ?
          <button disabled={true}>Connecting</button> :
          <button onClick={() => connect({})}>Connect</button>
      ) : null}

      {wallet ? (
        <div>
          {settingChain ? (
            <span>Switching chain...</span>
          ) : (
            <span>{chains.find(({ id }) => id === connectedChain?.id)?.label}</span>
          )}
          <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
        </div>
      ) : null}

      {connectedWallets.map(({ label, accounts }) => {
        return (
          <div key={label}>
            <div>{label}</div>
            <div>
              Accounts: 
              <div>
                {accounts.map(account => {
                  return (
                    <AccountContent account={account} key={account.address} />
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>

  )
}