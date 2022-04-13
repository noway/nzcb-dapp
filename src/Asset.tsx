import { AssetLinks } from "./AssetLinks";
import { CONTRACT_ADDRESS } from "./config";
import { Sample } from "./Sample";
import { styled } from "./styles";

const AssetContainer = styled("div", {
  border: "1px solid lightgrey",
  display: 'inline-grid',
  gap: 20,
  padding: 10
});


const AssetInfo = styled("div", {
  display: 'grid',
  gap: 10
})

export function Asset(props: Readonly<{ id: bigint; }>) {
  const { id } = props;
  const title = `NZ COVID Badge #${id.toString()}`
  return (
    <AssetContainer>
      <Sample />
      <AssetInfo>
        <h3>{title}</h3>
        <AssetLinks title={title} address={CONTRACT_ADDRESS} id={id.toString()} />
      </AssetInfo>
    </AssetContainer>
  );
}
