import type { AnchorHTMLAttributes } from "react";

const defaultClassName =
  "underline decoration-1 underline-offset-[3px] decoration-border hover:text-link-hover hover:decoration-link-hover";

export default function MarkdownLinkInBlank({
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={className ?? defaultClassName}
      target="_blank"
      rel="noopener noreferrer"
    />
  );
}
