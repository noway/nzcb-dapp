import { EIP1193Provider } from "@web3-onboard/core";
import { useConnectWallet } from "@web3-onboard/react";
import { providers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "./config";
import { RouteContext } from "./contexts";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { Header } from "./Header";
import { Sample } from "./Sample";

export function Account() {
  const routeContext = useContext(RouteContext);
  function newBadge() {
    routeContext.navigate(["newbadge", null]);
  }

  const [myBadgeIds, setMyBadgeIds] = useState<bigint[]>([]);
  const [{ wallet }] = useConnectWallet()
  const address = wallet?.accounts[0]?.address // TODO: only ever show 1 account
  const eip1193Provider = wallet?.provider

  useEffect(() => {
    async function scanBadges(eip1193Provider: EIP1193Provider) {
      const myBadgeIds: bigint[] = []
      const provider = new providers.Web3Provider(eip1193Provider);
      const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, provider.getSigner())
      const supply = await nzCovidBadge.totalSupply()
      for (let i = 0n; i < supply.toBigInt(); i++) {
        const owner = await nzCovidBadge.getOwner(i)
        console.log('owner',owner)
        console.log('address',address)
        if (owner.toLowerCase() === `${address}`.toLowerCase()) {
          console.log('here')
          myBadgeIds.push(i)
        }
      }
      setMyBadgeIds(myBadgeIds)
    }

    if (eip1193Provider) {
      scanBadges(eip1193Provider)
    }
  }, [address, eip1193Provider])

  return (
    <div>
      <Header showWallet={true} showBack={false} />
      <h1>Account</h1>
      {myBadgeIds.map(id => (
        <div key={id.toString()}>
          <h3>NZ COVID Badge #{id.toString()}</h3>
          <Sample/>
        </div>
      ))}
      <button type="button" onClick={newBadge}>New Badge</button>
    </div>
  );
}