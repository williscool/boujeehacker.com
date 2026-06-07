import type { AnchorHTMLAttributes } from "react";

export default function MarkdownLinkInBlank(
  props: AnchorHTMLAttributes<HTMLAnchorElement>
) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}
