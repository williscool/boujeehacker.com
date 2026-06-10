import type { Metadata } from "next";
import Container from "../../_components/Container";
import CTAButton from "../../_components/CTAButton";
import { getHomePage, getWorkTogetherPage } from "../../../lib/content";

export const metadata: Metadata = {
  title: "Contact | William Harris",
};

interface LinkCardProps {
  href: string;
  label: string;
  sublabel?: string;
  external?: boolean;
}

function LinkCard({ href, label, sublabel, external }: LinkCardProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block w-full rounded-md border border-border bg-surface px-5 py-4 no-underline hover:border-accent transition-colors"
    >
      <span className="block text-base font-medium text-text">{label}</span>
      {sublabel && (
        <span className="block text-sm text-text-muted mt-0.5">{sublabel}</span>
      )}
    </a>
  );
}

export default async function ContactPage() {
  const [home, workTogether] = await Promise.all([
    getHomePage(),
    getWorkTogetherPage(),
  ]);

  const bookingUrl =
    workTogether.frontmatter.bookingUrl ?? "https://calendly.com/wharris-cal";

  const socialLinks = home.frontmatter.socialLinks ?? [];
  const linkedIn = socialLinks.find((l) =>
    l.label.toLowerCase().includes("linkedin")
  );
  const twitter = socialLinks.find(
    (l) =>
      l.label.toLowerCase().includes("twitter") ||
      l.label.toLowerCase().includes("x")
  );

  return (
    <Container>
      <div className="pt-10 pb-16 sm:pt-14 sm:pb-24 max-w-sm mx-auto space-y-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-text-muted m-0">
            Contact
          </p>
          <h1 className="font-display text-4xl m-0">Get in touch</h1>
        </div>

        <div className="space-y-3">
          <LinkCard
            href="/booking/"
            label="Book time with me"
            sublabel="Schedule a call via Calendly"
          />
          <LinkCard
            href="mailto:wharris@upscalews.com"
            label="Email"
            sublabel="wharris@upscalews.com"
            external
          />
          {linkedIn && (
            <LinkCard
              href={linkedIn.url}
              label="LinkedIn"
              sublabel={linkedIn.url.replace("https://", "")}
              external
            />
          )}
          {twitter && (
            <LinkCard
              href={twitter.url}
              label="Twitter / X"
              sublabel={twitter.url.replace("https://", "")}
              external
            />
          )}
        </div>

        <CTAButton href="/work-together/">Work with me</CTAButton>
      </div>
    </Container>
  );
}
