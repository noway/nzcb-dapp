import { providers, Wallet } from "ethers";
import { useState } from "react";
import { Account } from "./Account";
import { RouteContext } from "./contexts";
import { Landing } from "./Landing";
import { NewBadge } from "./NewBadge";
import { Prepare } from "./Prepare";
import { Route } from "./types";

type Props = Readonly<{}>;

export function App(props: Props) {
  const [route, setRoute] = useState<Route>(["landing", null])
  const provider = new providers.JsonRpcProvider("http://127.0.0.1:7545");
  const signer = new Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {route[0] === "landing" ? <Landing /> : null}
      {route[0] === "account" ? <Account /> : null}
      {route[0] === "newbadge" ? <NewBadge /> : null}
      {route[0] === "prepare" ? <Prepare passURI={route[1].passURI} /> : null}
    </RouteContext.Provider>
  )
}