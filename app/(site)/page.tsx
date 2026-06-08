import type { Metadata } from "next";
import Container from "../_components/Container";
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
      <div className="py-12 space-y-6">
        <p className="text-xs uppercase tracking-wide text-text-muted">
          Phase 3 stub — full doorway lands in Phase 4
        </p>
        <p>identityLine: {home.identityLine}</p>
        <p>nowLine: {home.nowLine}</p>
        <p>selectedWork: {home.selectedWork.length} items</p>
        <p>
          primaryCTA: {home.primaryCTA.label} → {home.primaryCTA.url}
        </p>
      </div>
    </Container>
  );
}
