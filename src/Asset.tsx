import { Sample } from "./Sample";

export function Asset(props: { id: bigint; }) {
  const { id } = props;
  return (
    // TODO: asset links
    <div style={{ border: "1px solid lightgrey", padding: "10px 10px 10px 10px" }}>
      <Sample />
      <h3 style={{ margin: "20px 0 10px 0" }}>NZ COVID Badge #{id.toString()}</h3>
    </div>
  );
}
