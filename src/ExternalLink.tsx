import { ReactNode } from "react";
import { styled } from "./styles";

const AHref = styled("a", {
  textDecoration: "none"
})

const Underlined = styled("span", {
  textDecoration: "underline"
})
export function ExternalLink(props: Readonly<{ href: string; title: string; children: ReactNode; }>) {
  const { href, title } = props;
  return (
    <AHref href={href} rel="nofollow noopener noreferrer" title={title} target="_blank">
      <Underlined>{props.children}</Underlined> ⧉
    </AHref>
  );
}
