import { Wallet } from "ethers";
import { useContext, useState } from "react";
import { RouteContext } from "./contexts";
import { Header } from "./Header";

type Props = Readonly<{
  signer: Wallet
}>;

export function NewBadge(props: Props) {
  const [passURI, setPassURI] = useState("NZCP://...");
  const routeContext = useContext(RouteContext);
  function prepare() {
    routeContext.setRoute("prepare");
  }

  return (
    <div>
      <Header />
      <div>
        <textarea
          onChange={(e) => setPassURI(e.target.value)}
          value={passURI}
          cols={50}
          rows={12}
        />
      </div>
      <button type="button" onClick={prepare}>Prepare</button>
    </div>
  );
}