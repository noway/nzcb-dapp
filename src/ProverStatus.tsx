import { useCallback, useEffect, useState } from "react";
import { Status } from "./Status";

const fetchAvg = 191525.25
const proveAvg = 856499.71
const controlAvg = 6618.25

type Props = Readonly<{
  controlStart: number | null;
  controlEnd: number | null;
  fetchStart: number | null;
  fetchEnd: number | null;
  proveStart: number | null;
  proveEnd: number | null;
}>;

export function ProverStatus(props: Props) {
  const { controlStart, controlEnd, fetchStart, fetchEnd, proveStart, proveEnd } = props;
  const [, setNonce] = useState(0);
  const refresh = useCallback(function refresh() {
    setNonce(Date.now());
  }, []);
  useEffect(() => {
    const intervalId = setInterval(refresh, 1000);
    return () => clearInterval(intervalId);
  }, [refresh])

  if (!controlEnd || !controlStart) {
    return <>
      <Status status="Approximating time to prove..." />
    </>
  }
  const controlTime = controlEnd - controlStart;
  const control = controlTime / controlAvg;

  if (!fetchEnd && fetchStart) {
    return (
      <>
        <Status status="Fetching key, this may take a while..." />
        <Progress start={fetchStart} avg={fetchAvg * control} />
      </>
    )
  }
  else if (!proveEnd && proveStart) {
    return (
      <>
        <Status status="Proving, this may take a while..." />
        <Progress start={proveStart} avg={proveAvg * control} />
      </>
    )
  }
  else {
    return null;
  }
}

function Progress(props: Readonly<{ start: number, avg: number }>) {
  const { start, avg } = props;
  const done = Date.now() - start;
  const left = Math.max(avg - done, 0);
  const progress = done / avg * 100;
  return (
    <>
      {left > 0 ?
        <Status status={`${progress.toFixed(2)}% done (~${timeSpan(left)} left)`} /> :
        <Status status={`Just about done (running for ${timeSpan(done)})... `} />}
    </>
  );
}

function timeSpan(ms: number) {
  const minutes = Math.floor(ms / 1000 / 60);
  const seconds = Math.floor(ms / 1000) % 60;
  const milliseconds = ms % 1000;
  if (minutes > 0) {
    return `${minutes.toFixed(0)} minutes`;
  }
  else if (seconds > 0) {
    return `${seconds.toFixed(0)} seconds`;
  }
  else {
    return `${milliseconds.toFixed(0)} milliseconds`;
  }
}