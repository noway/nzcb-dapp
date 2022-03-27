import { useContext, useEffect, useState } from "react";
import { EXAMPLE_PUBLIC_KEY_JWK } from "./config";
import { RouteContext } from "./contexts";
import { Header } from "./Header";
import { decodeBytes, decodeCOSE, encodeToBeSigned } from "./nzcpTools";

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"


export function NewBadge() {
  const [passURI, setPassURI] = useState(EXAMPLE_PASS_URI);
  const routeContext = useContext(RouteContext);
  const [validStatus, setValidStatus] = useState<string>("N/A");
  function prepare() {
    routeContext.navigate(["prepare", { passURI }]);
  }

  useEffect(() => {
    checkValid(passURI)
  }, [passURI]);

  async function checkValid(passURI: string) {
    try {
      const bytes = decodeBytes(passURI);
      const data = decodeCOSE(bytes);
      const toBeSigned = encodeToBeSigned(data.bodyProtected, data.payload)
      const key = await crypto.subtle.importKey('jwk', EXAMPLE_PUBLIC_KEY_JWK, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['verify']);
      const ret = await crypto.subtle.verify({name: 'ECDSA', hash: 'SHA-256'}, key, data.signature, toBeSigned);
      setValidStatus(ret ? "Yes" : "No");
    }
    catch (e) {
      setValidStatus((e as Error).message);
    }
  }

  return (
    <div>
      <Header showWallet={true} showBack={true} />
      <div>
        <textarea
          onChange={(e) => setPassURI(e.target.value)}
          value={passURI}
          cols={50}
          rows={12}
        />
      </div>
      <div>Valid: {validStatus}</div>
      <button type="button" disabled={validStatus !== "Yes"} onClick={prepare}>Prepare</button>
    </div>
  );
}