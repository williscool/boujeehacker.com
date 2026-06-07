import type { Metadata } from "next";
import HTMLContent from "../../_components/Content";
import MeetupBlock from "../../_components/MeetupBlock";
import { getPastMeetups, getPastMeetupsPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getPastMeetupsPage();
  return {
    title: frontmatter.seo.browserTitle,
    description: frontmatter.seo.description,
    other: { title: frontmatter.seo.title },
  };
}

export default async function PastMeetupsPage() {
  const [{ frontmatter, html }, past] = await Promise.all([
    getPastMeetupsPage(),
    getPastMeetups(),
  ]);

  return (
    <article className="pastMeetups">
      <div className="container  pastMeetups-container">
        <h1 className="pastMeetups-title">{frontmatter.title}</h1>
        <HTMLContent className="pastMeetups-description" content={html} />
        {past.map((meetup) => (
          <MeetupBlock
            key={meetup.slug}
            className="pastMeetups-meetup"
            meetup={meetup}
          />
        ))}
      </div>
    </article>
  );
}
