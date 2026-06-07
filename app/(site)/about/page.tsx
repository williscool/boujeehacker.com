import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import "../../../src/styles/about-page.scss";
import HTMLContent from "../../_components/Content";
import { getAboutPage } from "../../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getAboutPage();
  return {
    title: frontmatter.seo.browserTitle,
    description: frontmatter.seo.description,
    other: { title: frontmatter.seo.title },
  };
}

export default async function AboutPage() {
  const { frontmatter, html } = await getAboutPage();

  return (
    <article className="about">
      <div className="about-container  container">
        <section className="about-header">
          <div className="about-titleWrapper">
            <h1 className="about-title">{frontmatter.title}</h1>
          </div>
          <div className="about-imageWrapper">
            <img
              src={frontmatter.mainImage.image}
              alt={frontmatter.mainImage.imageAlt}
            />
          </div>
        </section>
        <section className="section">
          <HTMLContent className="about-description" content={html} />
          <ul className="about-gallery  galleryList">
            {frontmatter.gallery.map((galleryImage, index) => (
              <li key={index} className="galleryList-item">
                <img src={galleryImage.image} alt={galleryImage.imageAlt} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="section  developerGroups  about-developerGroups">
        <div className="container">
          <ReactMarkdown>{frontmatter.developerGroups}</ReactMarkdown>
        </div>
      </section>
      <section className="section  organizers  about-organizers">
        <div className="container  organizers-container">
          <h2 className="organizers-title">{frontmatter.organizers.title}</h2>
          <ul className="organizers-list">
            {frontmatter.organizers.gallery.map((galleryImage, index) => (
              <li key={index} className="organizers-listItem">
                <img
                  className="organizers-listItemImage"
                  src={galleryImage.image}
                  alt={galleryImage.imageAlt}
                />
                <span className="organizers-listItemName">
                  {galleryImage.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
