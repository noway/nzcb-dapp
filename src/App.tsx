import React, { useState } from "react";
import "./App.css";

function App() {
  const [passURI, setPassURI] = useState("");
  const verify = () => {
    if (passURI.length > 0) {
      window.open(passURI, "_blank");
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
