import { ReactNode } from "react";
import { styled } from "./styles";

const DataSectionContainer = styled("div", {
  border: "1px solid lightgrey",
  marginTop: 20,
  padding: 10,
  display: 'inline-grid',
  gap: 10
})

export function DataSection(props: Readonly<{ title?: string; children: ReactNode; }>) {
  const { title } = props;
  return (
    <div>
      <DataSectionContainer>
        {title ? <h4>{title}</h4> : null}
        <div>
          {props.children}
        </div>
      </DataSectionContainer>
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
