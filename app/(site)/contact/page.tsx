import type { Metadata } from "next";
import Container from "../../_components/Container";
import CTAButton from "../../_components/CTAButton";
import ContactLinkCard from "../../_components/ContactLinkCard";
import { getHomePage, getWorkTogetherPage } from "../../../lib/content";

export const metadata: Metadata = {
  title: "Contact | William Harris",
};

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
          <ContactLinkCard
            href="/booking/"
            label="Book time with me"
            sublabel="Schedule a call via Calendly"
          />
          <ContactLinkCard
            href="mailto:wharris@upscalews.com"
            label="Email"
            sublabel="wharris@upscalews.com"
            external
          />
          {linkedIn && (
            <ContactLinkCard
              href={linkedIn.url}
              label="LinkedIn"
              sublabel={linkedIn.url.replace("https://", "")}
              external
            />
          )}
          {twitter && (
            <ContactLinkCard
              href={twitter.url}
              label="Twitter / X"
              sublabel={twitter.url.replace("https://", "")}
              external
            />
          )}
        </div>

        <CTAButton href="/work-together/" location="contact-cta">
          Work with me
        </CTAButton>
      </div>
    </Container>
  );
}
