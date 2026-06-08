import type { Metadata } from "next";
import Container from "../../_components/Container";
import IdentityLine from "../../_components/IdentityLine";
import Prose from "../../_components/Prose";
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
        <Prose>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Prose>
      </div>
    </Container>
  );
}
