"use client";

import { trackLinkClick } from "./trackLinkClick";

interface ContactLinkCardProps {
  href: string;
  label: string;
  sublabel?: string;
  external?: boolean;
}

export default function ContactLinkCard({
  href,
  label,
  sublabel,
  external,
}: ContactLinkCardProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) =>
        trackLinkClick(
          { href, text: label, location: "contact-card", external },
          e,
        )
      }
      className="block w-full rounded-md border border-border bg-surface px-5 py-4 no-underline hover:border-accent transition-colors"
    >
      <span className="block text-base font-medium text-text">{label}</span>
      {sublabel && (
        <span className="block text-sm text-text-muted mt-0.5">{sublabel}</span>
      )}
    </a>
  );
}
