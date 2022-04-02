import { styled } from "./styles";

const DataBitContainer = styled("div", {
  marginTop: 10
})

export function DataBit(props: Readonly<{ title: string; value: string; }>) {
  const { title, value } = props;
  return (
    <DataBitContainer>
      <h4>{title}</h4>
      <code>{value}</code>
    </DataBitContainer>
  );
}
