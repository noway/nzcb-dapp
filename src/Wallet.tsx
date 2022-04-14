import { Account } from "@web3-onboard/core/dist/types";
import { init, useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useContext, useEffect, useState } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { getFirstAccount, truncateAddress } from "./utils";
import { getInitOptions } from "./web3";

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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  background: 'white',
  border: '1px solid lightgrey',
  marginRight: -10,
  transform: 'translate(1px, 0)',
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

  const savedRpcUrl = localStorage.getItem('rpcUrl') ?? ''
  const [nonce, setNonce] = useState(0)
  const [rpcUrl, setRpcUrl] = useState<string>(savedRpcUrl)
  async function saveRpcUrl() {
    localStorage.setItem('rpcUrl', rpcUrl)
    setRpcUrl('')
    setNonce(nonce + 1)
  }
  async function clearRpcUrl() {
    localStorage.removeItem('rpcUrl')
    setRpcUrl('')
    setNonce(nonce + 1)
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
            Current RPC URL: {savedRpcUrl}
          </div>
          <div>
            New RPC URL: <input
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={clearRpcUrl}>Clear RPC URL</button>
            <button onClick={saveRpcUrl}>Set RPC URL</button>
            <button onClick={() => window.location.reload()}>Reload to apply</button>
          </div>
          <div>
            <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
          </div>
        </Dropdown>
      ) : null}
    </WalletContainer>
  )
}