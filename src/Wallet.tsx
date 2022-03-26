import { Account } from "@web3-onboard/core/dist/types";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import { useContext, useEffect } from "react";
import { RouteContext } from "./contexts";

type Props = Readonly<{}>;


export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

type AccountProps = Readonly<{
  account: Account
}>

function AccountComponent(props: AccountProps) {
  const {account} = props
  return (
    <div>
      {account.ens ? 
        <div>{account.ens.name}</div> : 
        <div>{truncateAddress(account.address)}</div>}
    </div>
  )
}

export function Wallet(props: Props) {
  const routeContext = useContext(RouteContext);
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const connectedWallets = useWallets()

  useEffect(() => {
    console.log('wallet changed', wallet, connecting)
    if (!wallet && !connecting) {
      routeContext.navigate(["landing", null]);
    }
  }, [wallet, connecting])


  return (
    <div>
      {!wallet ? <button onClick={() => connect({})}>{connecting ? 'connecting' : 'connect'}</button> : null}

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
            <div>
              Accounts: 
              <div>
                {accounts.map(account => {
                  return (
                    <AccountComponent account={account} key={account.address} />
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