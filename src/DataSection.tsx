import { ReactNode } from "react";

export function DataSection(props: Readonly<{ title: string; children: ReactNode; }>) {
  const { title } = props;
  return (
    <div>
      <div style={{ border: "1px solid lightgrey", marginTop: 20, padding: 10, display: 'inline-block' }}>
        <h4>{title}</h4>
        <div style={{ marginTop: 10 }}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
