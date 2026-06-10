"use client";

import Link from "next/link";
import CustomLink from "./CustomLink";
import Container from "./Container";
import type { NavbarFrontmatter } from "../../lib/content-types";
import { trackLinkClick } from "./trackLinkClick";

interface NavbarProps {
  data: NavbarFrontmatter;
}

export default function Navbar({ data }: NavbarProps) {
  return (
    <nav className="border-b border-border bg-bg">
      <Container width="wide">
        <div className="flex h-[var(--navbar-height)] items-center justify-between gap-3 sm:gap-6">
          <Link
            href="/"
            className="font-display text-base sm:text-lg text-text no-underline hover:text-link-hover"
            onClick={(e) =>
              trackLinkClick(
                {
                  href: "/",
                  text: "boujeehacker",
                  location: "navbar-home",
                },
                e,
              )
            }
          >
            boujeehacker
          </Link>
          {data.menuItems.length > 0 && (
            <ul className="flex items-center gap-2 sm:gap-5 list-none p-0 m-0 text-xs sm:text-sm">
              {data.menuItems.map((menuItem) => (
                <li key={menuItem.linkURL}>
                  <CustomLink
                    linkType={menuItem.linkType}
                    linkURL={menuItem.linkURL}
                    className="text-text-muted no-underline hover:text-link-hover whitespace-nowrap"
                    location="navbar"
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
