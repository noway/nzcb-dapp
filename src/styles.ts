import { createStitches } from "@stitches/react";

export const {styled, css, globalCss} = createStitches({
  theme: {
    colors: {
      gray400: 'gainsboro',
      gray500: 'lightgray',
    },
  },
})

export const globalStyles = globalCss({
  body: {
    margin: 0,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  h1: {
    margin:0,
  },
  h2: {
    margin:0,
  },
  h3: {
    margin:0,
  },
});


export const Body = styled("div", {
  maxWidth: 900,
  width: '100%',
  margin: "20px",
  flex: 1,
  border: "1px solid lightgray",
  padding: 20,
  boxSizing: 'border-box'
});

export const CtaContainer = styled("div", {
  marginTop: 20,
});
