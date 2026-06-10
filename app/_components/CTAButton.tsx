"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackLinkClick } from "./trackLinkClick";

export default function CTAButton({
  href,
  children,
  external = false,
  location = "cta-button",
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  location?: string;
}) {
  const className =
    "inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-bg no-underline font-medium transition-colors duration-[var(--transition-duration)] hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2";

  const text = typeof children === "string" ? children : "";
  const onClick = () =>
    trackLinkClick({ href, text, location, external });

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener"
        onClick={onClick}
      >
        {children}
        <span aria-hidden>→</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}
