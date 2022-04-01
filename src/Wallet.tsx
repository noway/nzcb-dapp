import { Account } from "@web3-onboard/core/dist/types";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useContext, useEffect, useState } from "react";
import { RouteContext } from "./contexts";
import { getFirstAccount, truncateAddress } from "./utils";

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!wallet && !connecting) {
      routeContext.navigate(["landing", null]);
    }
  }, [wallet, connecting, routeContext])

  function toggleDropdown() {
    setOpen(!open)
  }


  return (
    <div>
      {!wallet ? (
        connecting ?
          <button disabled={true}>Connecting</button> :
          <button onClick={() => connect({})}>Connect</button>
      ) : null}

      {wallet ? (
        <div onClick={toggleDropdown}>
          <AccountContent account={getFirstAccount(wallet)!}  />
        </div>
      ) : null}
      
      {open ? (
        <>
          {wallet ? (
            <div>
              {settingChain ? (
                <span>Switching chain...</span>
              ) : (
                <span>{chains.find(({ id }) => id === connectedChain?.id)?.label}</span>
              )}
            </div>
          ) : null}
          {wallet ? (
            <div>
              <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>

  )
}