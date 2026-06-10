import type { Metadata } from "next";
import Container from "../../_components/Container";
import IdentityLine from "../../_components/IdentityLine";
import Prose from "../../_components/Prose";
import CTAButton from "../../_components/CTAButton";
import DeckLink from "./DeckLink";
import { getWorkTogetherPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getWorkTogetherPage();
  return {
    title: frontmatter.seo.browserTitle,
    description: frontmatter.seo.description,
  };
}

function DeckFootnote({ url, location }: { url: string; location: string }) {
  return (
    <p className="text-sm text-text-muted m-0">
      Want more details?{" "}
      <DeckLink url={url} location={location}>
        Here's the pitch deck
      </DeckLink>
      .
    </p>
  );
}

export default async function WorkTogetherPage() {
  const { frontmatter, html } = await getWorkTogetherPage();
  const { bookingUrl, deckUrl, icpLine } = frontmatter;

  return (
    <Container width="wide">
      <div className="py-12 space-y-10">
        <IdentityLine markdown={icpLine} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-16">
          {/* Left column: mobile CTA + body + mobile footer */}
          <div className="space-y-8 min-w-0">
            {bookingUrl && (
              <div className="lg:hidden">
                <CTAButton
                  href={bookingUrl}
                  external
                  location="work-together-cta-mobile-top"
                >
                  Book a time
                </CTAButton>
              </div>
            )}

            <Prose html={html} />

            <div className="lg:hidden space-y-6">
              {bookingUrl && (
                <CTAButton
                  href={bookingUrl}
                  external
                  location="work-together-cta-mobile-bottom"
                >
                  Book a time
                </CTAButton>
              )}
              {deckUrl && (
                <div className="pt-6 border-t border-border max-w-[var(--measure)]">
                  <DeckFootnote
                    url={deckUrl}
                    location="work-together-deck-mobile"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right column: sticky CTA + deck (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-5">
              {bookingUrl && (
                <CTAButton
                  href={bookingUrl}
                  external
                  location="work-together-cta-desktop-sticky"
                >
                  Book a time
                </CTAButton>
              )}
              {deckUrl && (
                <DeckFootnote
                  url={deckUrl}
                  location="work-together-deck-desktop"
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
}
