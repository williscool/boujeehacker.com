"use client";

import type { ReactNode } from "react";
import { trackLinkClick } from "../../_components/trackLinkClick";

export default function DeckLink({
  url,
  location,
  children,
}: {
  url: string;
  location: string;
  children: ReactNode;
}) {
  const text = typeof children === "string" ? children : "pitch-deck";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      className="underline decoration-border underline-offset-[3px] hover:text-link-hover hover:decoration-link-hover"
      onClick={(e) =>
        trackLinkClick(
          { href: url, text, location, external: true },
          e,
        )
      }
    >
      {children}
    </a>
  );
}
