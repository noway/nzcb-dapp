import { Account } from "@web3-onboard/core/dist/types";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useContext, useEffect, useState } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { getFirstAccount, truncateAddress } from "./utils";

const WalletContainer = styled("div", {
  border: '1px solid lightgrey',
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end'
})

const AccountButton = styled("div", {
  userSelect: "none",
  cursor: "pointer"
})

const Dropdown = styled("div", {
  position: 'absolute',
  top: 70,
  right: 30,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  background: 'white',
  border: '1px solid lightgrey',
  padding: 10,
  gap: 10
})

function AccountContent(props: Readonly<{ account: Account }>) {
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
    <WalletContainer>
      {!(wallet && account) ? (
        connecting ?
          <button disabled={true}>Connecting</button> :
          <button onClick={() => connect({})}>Connect</button>
      ) : null}

      {(wallet && account) ? (
        <AccountButton onClick={toggleDropdown} role="button">
          <AccountContent account={account} />
        </AccountButton>
      ) : null}

      {(wallet && account && open) ? (
        <Dropdown>
          <div>
            {account.address}
          </div>
          <div>
            {settingChain ? (
              <span>Switching chain...</span>
            ) : (
              <span>{chains.find(({ id }) => id === connectedChain?.id)?.label}</span>
            )}
          </div>
          <div>
            <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
          </div>
        </Dropdown>
      ) : null}
    </WalletContainer>
  )
}