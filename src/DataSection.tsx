import { ReactNode } from "react";

export function DataSection(props: Readonly<{ title?: string; children: ReactNode; }>) {
  const { title } = props;
  return (
    <div>
      <div style={{ border: "1px solid lightgrey", marginTop: 20, padding: 10 , display: 'inline-grid', gap: 10 }}>
        {title ? <h4>{title}</h4> : null}
        <div style={{ display: 'inline-grid', gap: 10 }}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

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
