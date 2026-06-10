"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackLinkClick } from "./trackLinkClick";

const defaultClassName =
  "underline decoration-1 underline-offset-[3px] decoration-border hover:text-link-hover hover:decoration-link-hover";

export default function MarkdownLinkInBlank({
  className,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackLinkClick({
      href: props.href ?? "",
      text: typeof props.children === "string" ? props.children : "",
      location: "markdown-link",
      external: true,
    });
    onClick?.(e);
  };

  return (
    <a
      {...props}
      className={className ?? defaultClassName}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    />
  );
}
