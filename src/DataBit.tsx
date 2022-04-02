
export function DataBit(props: Readonly<{ title: string; value: string; }>) {
  const { title, value } = props;
  return (
    <div>
      <code><b>{title}</b>: {value}</code>
    </div>
  );
}
