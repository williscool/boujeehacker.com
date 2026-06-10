"use client";

import { trackLinkClick } from "./trackLinkClick";

export interface SocialLink {
  label: string;
  href: string;
}

export default function SocialLinkRow({
  links,
  location = "social-row",
}: {
  links: SocialLink[];
  location?: string;
}) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none p-0 m-0 text-sm text-text-muted">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener"
            className="text-text-muted no-underline hover:text-link-hover hover:underline"
            onClick={(e) =>
              trackLinkClick(
                {
                  href: link.href,
                  text: link.label,
                  location,
                  external: true,
                },
                e,
              )
            }
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
