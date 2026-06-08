export interface SocialLink {
  label: string;
  href: string;
}

export default function SocialLinkRow({ links }: { links: SocialLink[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none p-0 m-0 text-sm text-text-muted">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener"
            className="text-text-muted no-underline hover:text-link-hover hover:underline"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
