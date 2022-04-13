import { styled } from "./styles";

const StatusBlock = styled("div", {
  marginTop: 20
})

export function Status(props: Readonly<{ status: string; }>) {
  const { status } = props;
  return <StatusBlock>{status}</StatusBlock>;
}

export function StatusError(props: Readonly<{ error: Error; }>) {
  const { error } = props;
  return <StatusBlock><b>Error</b>: {error.message}</StatusBlock>;
}
