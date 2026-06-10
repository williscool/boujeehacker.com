"use client";

import { trackLinkClick } from "./trackLinkClick";

export interface WorkItem {
  title: string;
  outcome: string;
  url: string;
}

export default function WorkCard({ item }: { item: WorkItem }) {
  const isInternal = item.url.startsWith("/") || item.url.startsWith("#");
  const linkProps = isInternal
    ? {}
    : { target: "_blank", rel: "noopener" as const };

  return (
    <a
      href={item.url}
      {...linkProps}
      onClick={(e) =>
        trackLinkClick(
          {
            href: item.url,
            text: item.title,
            location: "work-card",
            external: !isInternal,
          },
          e,
        )
      }
      className="group block border-t border-border py-5 no-underline transition-colors duration-[var(--transition-duration)] hover:bg-surface/50"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl text-text m-0">{item.title}</h3>
        <span
          aria-hidden
          className="text-text-muted transition-transform duration-[var(--transition-duration)] group-hover:translate-x-1 group-hover:text-link-hover"
        >
          →
        </span>
      </div>
      <p className="mt-1 text-text-muted text-base">{item.outcome}</p>
    </a>
  );
}
