"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { LinkType } from "../../lib/content-types";
import { trackLinkClick } from "./trackLinkClick";

interface CustomLinkProps {
  linkType: LinkType;
  linkURL: string;
  children: ReactNode;
  className?: string;
  location?: string;
}

export default function CustomLink({
  linkType,
  linkURL,
  children,
  className = "",
  location = "unknown",
}: CustomLinkProps) {
  const text = typeof children === "string" ? children : "";
  const onClick = () =>
    trackLinkClick({
      href: linkURL,
      text,
      location,
      external: linkType !== "internal",
    });

  if (linkType === "internal") {
    return (
      <Link className={className} href={linkURL} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a
      className={className}
      href={linkURL}
      target="_blank"
      rel="noopener"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
