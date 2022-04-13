import { useContext, useEffect, useState } from "react";
import { LIVE, PUBLIC_KEY_JWK } from "./config";
import { RouteContext } from "./contexts";
import { DataBit, DataSection } from "./DataSection";
import { EXAMPLE_PASS_URI } from "./exampleStubs";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { decodeBytes, decodeCOSE, encodeToBeSigned } from "./nzcpTools";
import { PassInfo } from "./PassInfo";
import { Body, CtaContainer, styled } from "./styles";

const PassInput = styled("textarea", {
  marginTop: 20,
  border: '1px solid lightgrey'
})

export function NewBadge() {
  const [passURI, setPassURI] = useState(LIVE ? "" : EXAMPLE_PASS_URI);
  const routeContext = useContext(RouteContext);
  const [validStatus, setValidStatus] = useState<string>("N/A");
  function prepare() {
    routeContext.navigate(["prepare", { passURI }]);
  }

  useEffect(() => {
    if (passURI) {
      checkValid(passURI)
    }
  }, [passURI]);

  async function checkValid(passURI: string) {
    try {
      const bytes = decodeBytes(passURI);
      const data = decodeCOSE(bytes);
      const toBeSigned = encodeToBeSigned(data.bodyProtected, data.payload)
      const key = await crypto.subtle.importKey('jwk', PUBLIC_KEY_JWK, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      const ret = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, data.signature, toBeSigned);
      setValidStatus(ret ? "yes" : "no");
    }
    catch (e) {
      setValidStatus((e as Error).message);
    }
  }

  return <>
    <Header isLanding={false} showBack={true} />
    <Body>
      <div>
        <PassInput
          placeholder="NZCP:/1/..."
          onChange={(e) => setPassURI(e.target.value)}
          value={passURI}
          cols={60}
          rows={12}
        />
      </div>
      <PassInfo passURI={passURI} />
      <DataSection title="Pass signature">
        <DataBit title="valid" value={validStatus} />
      </DataSection>
      <CtaContainer>
        <button type="button" disabled={validStatus !== "yes"} onClick={prepare}>Prepare</button>
      </CtaContainer>
    </Body>
    <Footer />
  </>;
}