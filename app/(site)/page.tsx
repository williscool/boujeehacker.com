import type { Metadata } from "next";
import Container from "../_components/Container";
import IdentityLine from "../_components/IdentityLine";
import WorkCard from "../_components/WorkCard";
import NowLine from "../_components/NowLine";
import CTAButton from "../_components/CTAButton";
import SocialLinkRow from "../_components/SocialLinkRow";
import { getHomePage } from "../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter: home } = await getHomePage();
  return {
    title: home.seo.browserTitle,
    description: home.seo.description,
    keywords: home.seo.keywords,
  };
}

export default async function HomePage() {
  const { frontmatter: home } = await getHomePage();

  return (
    <Container>
      <div className="py-16 sm:py-24 space-y-12">
        {home.avatar && (
          <img
            src={home.avatar.image}
            alt={home.avatar.imageAlt}
            className="h-24 w-24 rounded-full object-cover border border-border"
          />
        )}

        <IdentityLine markdown={home.identityLine} />

        <div className="flex flex-col gap-5 items-start">
          <CTAButton href={home.primaryCTA.url}>
            {home.primaryCTA.label}
          </CTAButton>
          <SocialLinkRow
            links={home.socialLinks.map((l) => ({
              label: l.label,
              href: l.url,
            }))}
          />
        </div>

        <NowLine markdown={home.nowLine} />

        <section aria-labelledby="selected-work-heading">
          <h2
            id="selected-work-heading"
            className="text-xs uppercase tracking-wide text-text-muted font-medium m-0 mb-2"
          >
            Selected work
          </h2>
          <ul className="list-none p-0 m-0">
            {home.selectedWork.map((item) => (
              <li key={item.url}>
                <WorkCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
