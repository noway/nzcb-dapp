import { useCallback, useEffect, useState } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setNonce] = useState(0);
  const refresh = useCallback(function refresh() {
    setNonce(Date.now());
  }, []);
  useEffect(() => {
    const intervalId = setInterval(refresh, 1000);
    return () => clearInterval(intervalId);
  }, [refresh])
  if (!fetchEnd && fetchStart) {
    const done = Date.now() - fetchStart;
    const progress = done / fetchAvg * 100;
    return (
      <>
        <Status status="Fetching key, this may take a while..." />
        <Status status={`${progress.toFixed(2)}% done`} />
      </>
    )
  }
  else if (!proveEnd && proveStart) {
    const done = Date.now() - proveStart;
    const progress = done / proveAvg * 100;
    return (
      <>
        <Status status="Proving, this may take a while..." />
        <Status status={`${progress.toFixed(2)}% done`} />
      </>
    )
  }
  else {
    return null;
  }
}