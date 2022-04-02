
export function DataBit(props: Readonly<{ title: string; value: string; }>) {
  const { title, value } = props;
  return (
    <div>
      <code><b>{title}</b>: {value}</code>
    </div>
  );
}

export function DataBitTS(props: Readonly<{ title: string; value: number; }>) {
  const { title, value } = props;
  const date = new Date(value * 1000)
  const dateStr = date.toLocaleString()
  return (
    <div>
      <code><b>{title}</b>: <time dateTime={date.toISOString()} title={dateStr} aria-label={dateStr}>{value}</time></code>
    </div>
  );
}
