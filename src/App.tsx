import { DID_DOCUMENTS, verifyPassURIOffline } from "@vaxxnz/nzcp";
import React, { useState } from "react";
import "./App.css";

const EXAMPLE_PASS_URI = "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"


function App() {
  const [passURI, setPassURI] = useState(EXAMPLE_PASS_URI);
  const verify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passURI.length > 0) {
      const result = verifyPassURIOffline(passURI, { didDocument: DID_DOCUMENTS.MOH_EXAMPLE });
      alert(JSON.stringify(result, null, 2));
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={verify}>
          <input
            type="text"
            onChange={(e) => setPassURI(e.target.value)}
            value={passURI}
          />

          <button type="submit">Verify</button>
        </form>
      </header>
    </div>
  );
}

export default App;
