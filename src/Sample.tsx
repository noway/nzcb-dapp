import { ASSET_URL } from "./config";
import { styled } from "./styles";

const Container = styled("div", {
  display: 'flex',
});

const Frame = styled("div", {
  padding: 20,
  border: '1px solid lightgray',
});

export function Sample() {
  return (
    <Container>
      <Frame>
        <img src={ASSET_URL} alt="NZ COVID Badge" width={256} height={256} />
      </Frame>
    </Container>
  )
}