export function Status(props: Readonly<{ status: string; }>) {
  const { status } = props;
  return <div style={{ marginTop: 20 }}>{status}</div>;
}

export function StatusError(props: Readonly<{ error: Error; }>) {
  const { error } = props;
  return <div style={{ marginTop: 20 }}><b>Error</b>: {error.message}</div>;
}
