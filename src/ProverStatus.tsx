import { useState } from "react";
import { Status } from "./Status";

const fetchAvg = 12806.33
const fetchMed = 12599.50
const proveAvg = 2634874.33
const proveMed = 2421669.00

type Props = Readonly<{
  fetchStart: number | null;
  fetchEnd: number | null;
  proveStart: number | null;
  proveEnd: number | null;
}>;

export function ProverStatus(props: Props) {
  const { fetchStart, fetchEnd, proveStart, proveEnd } = props;
  const [nonce, setNonce] = useState(0);
  function refresh() {
    setNonce(nonce + 1);
  }
  if (!fetchEnd && fetchStart) {
    const done = Date.now() - fetchStart;
    const progress = done / fetchAvg * 100;
    return (
      <>
        <Status status="Fetching key, this may take a while..." />
        <Status status={`${progress}% done`} />
        <button onClick={refresh} type="button">Update</button>
      </>
    )
  }
  else if (!proveEnd && proveStart) {
    const done = Date.now() - proveStart;
    const progress = done / proveAvg * 100;
    return (
      <>
        <Status status="Proving, this may take a while..." />
        <Status status={`${progress}% done`} />
        <button onClick={refresh} type="button">Update</button>
      </>
    )
  }
  else {
    return null;
  }
}