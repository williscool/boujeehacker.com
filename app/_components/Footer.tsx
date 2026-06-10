import Container from "./Container";
import SocialLinkRow from "./SocialLinkRow";
import type { FooterFrontmatter } from "../../lib/content-types";

interface FooterProps {
  data: FooterFrontmatter;
}

export default function Footer({ data }: FooterProps) {
  const year = new Date().getFullYear();
  const links = data.footerLinks.map((l) => ({
    label: l.label,
    href: l.linkURL,
  }));

  return (
    <footer className="border-t border-border py-10">
      <Container width="wide">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-sm text-text-muted">
            © {year} William Harris
          </p>
          {links.length > 0 && <SocialLinkRow links={links} location="footer" />}
        </div>
      </Container>
    </footer>
  );
}
