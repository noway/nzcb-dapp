import { AssetLinks } from "./AssetLinks";
import { CONTRACT_ADDRESS } from "./config";
import { Sample } from "./Sample";

export function Asset(props: Readonly<{ id: bigint; }>) {
  const { id } = props;
  const title = `NZ COVID Badge #${id.toString()}`
  return (
    <div style={{ border: "1px solid lightgrey", display: 'inline-grid', gap: 20, padding: 10 }}>
      <Sample />
      <div style={{ display: 'grid', gap: 10 }}>
        <h3>{title}</h3>
        <AssetLinks title={title} address={CONTRACT_ADDRESS} id={id.toString()} />
      </div>
    </div>
  );
}
