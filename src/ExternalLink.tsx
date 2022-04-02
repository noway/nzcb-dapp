import { ReactNode } from "react";


export function ExternalLink(props: Readonly<{ href: string; title: string; children: ReactNode; }>) {
  const { href, title } = props;
  return (
    <a style={{ textDecoration: "none" }} href={href} rel="nofollow noopener noreferrer" title={title}>
      <span style={{ textDecoration: "underline" }}>{props.children}</span> ⧉
    </a>
  );
}
