import type { Metadata } from "next";
import Container from "../../_components/Container";
import { getAboutPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getAboutPage();
  return {
    title: frontmatter.seo.browserTitle,
    description: frontmatter.seo.description,
  };
}

export default async function AboutPage() {
  const { frontmatter } = await getAboutPage();

  return (
    <Container>
      <div className="py-12 space-y-6">
        <p className="text-xs uppercase tracking-wide text-text-muted">
          Phase 3 stub — full /about lands in Phase 5
        </p>
        <p>title: {frontmatter.title}</p>
        <p>identityLine: {frontmatter.identityLine}</p>
      </div>
    </Container>
  );
}
