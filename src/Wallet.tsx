import { Account } from "@web3-onboard/core/dist/types";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useContext, useEffect, useState } from "react";
import { RouteContext } from "./contexts";
import { getFirstAccount, truncateAddress } from "./utils";

type AccountProps = Readonly<{
  account: Account
}>

function AccountContent(props: AccountProps) {
  const { account } = props
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
  const account = getFirstAccount(wallet)

  useEffect(() => {
    if (!wallet && !connecting) {
      routeContext.navigate(["landing", null]);
    }
  }, [wallet, connecting, routeContext])

  function toggleDropdown() {
    setOpen(!open)
  }

  return (
    <div style={{ border: '1px solid lightgrey', padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {!(wallet && account) ? (
        connecting ?
          <button disabled={true}>Connecting</button> :
          <button onClick={() => connect({})}>Connect</button>
      ) : null}

      {(wallet && account) ? (
        <div onClick={toggleDropdown} style={{ userSelect: "none", cursor: "pointer" }} role="button">
          <AccountContent account={account} />
        </div>
      ) : null}

      {(wallet && account && open) ? (
        <div style={{ position: 'absolute', top: 70, right: 30, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: 'white', border: '1px solid lightgrey', padding: 10 }}>
          <div style={{}}>
            {account.address}
          </div>
          <div style={{ marginTop: 10 }}>
            {settingChain ? (
              <span>Switching chain...</span>
            ) : (
              <span>{chains.find(({ id }) => id === connectedChain?.id)?.label}</span>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
          </div>
        </div>
      ) : null}
    </div>

  )
}