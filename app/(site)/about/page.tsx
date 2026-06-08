import type { Metadata } from "next";
import Container from "../../_components/Container";
import IdentityLine from "../../_components/IdentityLine";
import Prose from "../../_components/Prose";
import { getAboutPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getAboutPage();
  return {
    title: frontmatter.seo.browserTitle,
    description: frontmatter.seo.description,
  };
}

export default async function AboutPage() {
  const { frontmatter, html } = await getAboutPage();

  return (
    <Container>
      <div className="py-16 sm:py-24 space-y-10">
        <IdentityLine markdown={frontmatter.identityLine} />
        <Prose>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Prose>
      </div>
    </Container>
  );
}
