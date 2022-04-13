import { EIP1193Provider } from "@web3-onboard/core";
import { useConnectWallet } from "@web3-onboard/react";
import { providers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { Asset } from "./Asset";
import { CONTRACT_ADDRESS } from "./config";
import { RouteContext } from "./contexts";
import { NZCOVIDBadge__factory } from "./contracts/types";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Status, StatusError } from "./Status";
import { Body, CtaContainer, styled } from "./styles";
import { getFirstAccount } from "./utils";

const AssetsContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  marginTop: 20
});

export function Account() {
  const routeContext = useContext(RouteContext);
  function newBadge() {
    routeContext.navigate(["newbadge", null]);
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [myBadgeIds, setMyBadgeIds] = useState<bigint[]>([]);
  const [{ wallet }] = useConnectWallet()
  const eip1193Provider = wallet?.provider

  useEffect(() => {
    async function scanBadges(eip1193Provider: EIP1193Provider) {
      const account = getFirstAccount(wallet)
      const address = account?.address
      setLoading(true);
      setError(null)
      try {
        const myBadgeIds: bigint[] = []
        const provider = new providers.Web3Provider(eip1193Provider);
        const nzCovidBadge = NZCOVIDBadge__factory.connect(CONTRACT_ADDRESS, provider.getSigner())
        const supply = await nzCovidBadge.totalSupply()
        for (let i = 0n; i < supply.toBigInt(); i++) {
          const owner = await nzCovidBadge.getOwner(i)
          if (owner.toLowerCase() === `${address}`.toLowerCase()) {
            myBadgeIds.push(i)
          }
        }
        setMyBadgeIds(myBadgeIds);
      }
      catch (e) {
        setError(e as Error)
      }
      setLoading(false);
    }

    if (eip1193Provider) {
      scanBadges(eip1193Provider)
    }
  }, [wallet, eip1193Provider])

  return (
    <>
      <Header isLanding={false} showBack={false} />
      <Body>
        {loading ? <Status status="Searching for your badges..." /> : null}
        {error ? <StatusError error={error} /> : null}
        {!loading && !error && myBadgeIds.length === 0 ? <Status status="You don't have any badges yet." /> : null}
        {!loading && !error && myBadgeIds.length > 0 ? <AssetsContainer>
          {myBadgeIds.map(id => (
            <Asset id={id} key={id.toString()} />
          ))}
        </AssetsContainer> : null}
        <CtaContainer>
          <button type="button" onClick={newBadge}>New Badge</button>
        </CtaContainer>
      </Body>
      <Footer />
    </>
  );
}


