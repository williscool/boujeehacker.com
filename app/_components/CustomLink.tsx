import Link from "next/link";
import type { ReactNode } from "react";
import type { LinkType } from "../../lib/content-types";

interface CustomLinkProps {
  linkType: LinkType;
  linkURL: string;
  children: ReactNode;
  className?: string;
}

export default function CustomLink({
  linkType,
  linkURL,
  children,
  className = "",
}: CustomLinkProps) {
  if (linkType === "internal") {
    return (
      <Link className={className} href={linkURL}>
        {children}
      </Link>
    );
  }
  return (
    <a className={className} href={linkURL} target="_blank" rel="noopener">
      {children}
    </a>
  );
}
