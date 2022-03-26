import { providers, Wallet } from "ethers";
import { useContext, useState } from "react";
import { Account } from "./Account";
import { RouteContext } from "./contexts";
import { Landing } from "./Landing";
import { Prepare } from "./Prepare";
import { Route } from "./types";

type Props = Readonly<{}>;

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"


const provider = new providers.JsonRpcProvider("http://127.0.0.1:7545");
const signer = new Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);


export function App(props: Props) {
  const [route, setRoute] = useState<Route>("landing")

  return (
    <RouteContext.Provider value={{ route, setRoute }}>
      {route === "landing" ? <Landing /> : null}
      {route === "account" ? <Account signer={signer} /> : null}
      {route === "prepare" ? <Prepare signer={signer} passURI={EXAMPLE_PASS_URI} /> : null}
    </RouteContext.Provider>
  )
}