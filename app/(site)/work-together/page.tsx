import type { Metadata } from "next";
import Container from "../../_components/Container";
import IdentityLine from "../../_components/IdentityLine";
import Prose from "../../_components/Prose";
import CTAButton from "../../_components/CTAButton";
import { getWorkTogetherPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getWorkTogetherPage();
  return {
    title: frontmatter.seo.browserTitle,
    description: frontmatter.seo.description,
  };
}

export default async function WorkTogetherPage() {
  const { frontmatter, html } = await getWorkTogetherPage();

  return (
    <Container>
      <div className="py-12 space-y-10">
        <IdentityLine markdown={frontmatter.icpLine} />

        <Prose html={html} />

        {frontmatter.bookingUrl && (
          <div>
            <CTAButton href={frontmatter.bookingUrl} external>
              Book a time
            </CTAButton>
          </div>
        )}

        {frontmatter.deckUrl && (
          <p className="max-w-[var(--measure)] text-sm text-text-muted m-0 pt-6 border-t border-border">
            Want more details?{" "}
            <a
              href={frontmatter.deckUrl}
              target="_blank"
              rel="noopener"
              className="underline decoration-border underline-offset-[3px] hover:text-link-hover hover:decoration-link-hover"
            >
              Here's the pitch deck
            </a>
            .
          </p>
        )}
      </div>
    </Container>
  );
}
