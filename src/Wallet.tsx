import { Account } from "@web3-onboard/core/dist/types";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useContext, useEffect, useState } from "react";
import { RouteContext } from "./contexts";
import { styled } from "./styles";
import { getFirstAccount, truncateAddress } from "./utils";
import { getDefaultRpcUrl } from "./web3";

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
const DropdownSection = styled("div", {
  border: '1px solid lightgrey',
  padding: 10,
  display: 'flex',
  gap: 10,
  flexDirection: 'column'
})

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
          <DropdownSection>
            <h4>Wallet</h4>
            <div>
              <code>
                <b>address</b>:&nbsp;{account.address}
              </code>
              <div>
                {settingChain ? (
                  <code><b>switching chain..</b>.</code>
                ) : (
                  <code><b>chain</b>: {chains.find(({ id }) => id === connectedChain?.id)?.label}</code>
                )}
              </div>
            </div>
            <div>
              <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
            </div>
          </DropdownSection>
          <DropdownSection>
            <RpcSetter />
          </DropdownSection>
        </Dropdown>
      ) : null}
    </WalletContainer>
  )
}

const RpcContent = styled("div", {
  display: 'grid',
  gap: 5
})

const RpcField = styled("div", {
  display: 'flex',
  alignItems: "center",
  gap: 5
})

const RpcActions = styled("div", {
  display: 'flex',
  gap: 10
})

const RpcInput = styled("input", {
  flex: 1,
  border: '1px solid lightgrey'
})

function RpcSetter() {
  const [{ chains, connectedChain }] = useSetChain()
  const chain = chains.find(({ id }) => id === connectedChain?.id)
  const activeRpcUrl = chain?.rpcUrl ?? null
  const storageRpcUrl = localStorage.getItem('rpcUrl')
  const savedRpcUrl = storageRpcUrl ?? getDefaultRpcUrl()
  const reloadNeeded = activeRpcUrl !== savedRpcUrl
  const [newRpcUrl, setNewRpcUrl] = useState<string>('')
  const [nonce, setNonce] = useState(0)

  async function saveRpcUrl() {
    localStorage.setItem('rpcUrl', newRpcUrl)
    setNewRpcUrl('')
    setNonce(nonce + 1)
  }
  async function clearRpcUrl() {
    localStorage.removeItem('rpcUrl')
    setNewRpcUrl('')
    setNonce(nonce + 1)
  }

  return <>
    <h4>RPC endpoint</h4>
    <RpcContent>
      <RpcField>
        <code><b>saved RPC URL</b>: </code>
        <RpcInput
          value={savedRpcUrl}
          readOnly={true}
        />
      </RpcField>
      {(reloadNeeded || storageRpcUrl) ? <RpcActions>
        {storageRpcUrl ?
          <button onClick={clearRpcUrl}>Clear RPC URL</button> : null}
        {reloadNeeded ?
          <button onClick={() => window.location.reload()}>Reload to apply</button> : null}
      </RpcActions> : null}
      <RpcField>
        <code><b>new RPC URL</b>: </code>
        <RpcInput
          value={newRpcUrl}
          onChange={(e) => setNewRpcUrl(e.target.value)}
        />
      </RpcField>
      <RpcActions>
        <button onClick={saveRpcUrl} disabled={!newRpcUrl}>Set new RPC URL</button>
      </RpcActions>
    </RpcContent>
  </>;
}
