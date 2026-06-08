import Link from "next/link";
import CustomLink from "./CustomLink";
import Container from "./Container";
import type { NavbarFrontmatter } from "../../lib/content-types";

interface NavbarProps {
  data: NavbarFrontmatter;
}

export default function Navbar({ data }: NavbarProps) {
  return (
    <nav className="border-b border-border bg-bg">
      <Container width="wide">
        <div className="flex h-[var(--navbar-height)] items-center justify-between gap-6">
          <Link
            href="/about"
            className="font-display text-lg text-text no-underline hover:text-link-hover"
          >
            William Harris
          </Link>
          {data.menuItems.length > 0 && (
            <ul className="flex items-center gap-5 list-none p-0 m-0 text-sm">
              {data.menuItems.map((menuItem) => (
                <li key={menuItem.linkURL}>
                  <CustomLink
                    linkType={menuItem.linkType}
                    linkURL={menuItem.linkURL}
                    className="text-text-muted no-underline hover:text-link-hover"
                  >
                    {menuItem.label}
                  </CustomLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </nav>
  );
}
