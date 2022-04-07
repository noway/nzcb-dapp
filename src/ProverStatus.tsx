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
    return <>
      <Status status="Fetching key, this may take a while..." />
      <Progress start={fetchStart} avg={fetchAvg} />
    </>
  }
  else if (!proveEnd && proveStart) {
    return (
      <>
        <Status status="Proving, this may take a while..." />
        <Progress start={proveStart} avg={proveAvg} />
      </>
    )
  }
  else {
    return null;
  }
}

function Progress(props: { start: number, avg: number }) {
  const { start, avg } = props;
  const done = Date.now() - start;
  const doneMinutes = done / 100 / 60;
  const left = Math.max(avg - done, 0);
  const progress = done / avg * 100;
  const leftMinutes = left / 1000 / 60;
  return (
    <>
      {left > 0 ?
        <Status status={`${progress.toFixed(2)}% done (${leftMinutes.toFixed(0)} minutes left)`} /> :
        <Status status={`Just about done (running for ${doneMinutes.toFixed(0)} minutes)... `} />}
    </>
  );
}
