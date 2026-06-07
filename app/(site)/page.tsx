import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import "../../src/styles/home.scss";
import CustomLink from "../_components/CustomLink";
import MarkdownLinkInBlank from "../_components/MarkdownLinkInBlank";
import { getHomePage } from "../../lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter: home } = await getHomePage();
  return {
    title: home.seo.browserTitle,
    description: home.seo.description,
    keywords: home.seo.keywords,
    other: {
      title: home.seo.title,
    },
  };
}

export default async function HomePage() {
  const { frontmatter: home } = await getHomePage();

  return (
    <>
      <section className="header">
        <div className="header-container  container">
          {home.headerImage && (
            <img
              className="header-image"
              src={home.headerImage.image}
              alt={home.headerImage.imageAlt}
            />
          )}
          <div className="header-tagline">
            <div>
              <div className="header-title">
                <ReactMarkdown>{home.title}</ReactMarkdown>
              </div>
            </div>

            <div className="socialLinks">
              <span>
                <a
                  href="https://www.linkedin.com/in/31iqml/"
                  target="_blank"
                  rel="noopener"
                >
                  <FaLinkedin size={32} />
                </a>
              </span>
              <span>
                <a
                  href="https://twitter.com/boujeehacker"
                  target="_blank"
                  rel="noopener"
                >
                  <img
                    width={32}
                    height={32}
                    src="/img/twitter.svg"
                    alt="twitter"
                  />
                </a>
              </span>
              <span>
                <a
                  href="https://github.com/williscool"
                  target="_blank"
                  rel="noopener"
                >
                  <FaGithub size={32} />
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="upcomingMeetup  section">
        <div className="upcomingMeetup-container  container">
          <div id="home-main" className="pastMeetups">
            <div className="main-content-header-title">
              <ReactMarkdown components={{ a: MarkdownLinkInBlank }}>
                {home.homeMainContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </section>
      <section className="ctaBlock">
        <CustomLink
          linkType={home.callToActions.firstCTA.linkType}
          linkURL={home.callToActions.firstCTA.linkURL}
          className="ctaBlock-pattern  ctaBlock-pattern--first"
        >
          <div className="ctaBlock-cta">
            <span className="ctaBlock-ctaHeading">
              {home.callToActions.firstCTA.heading}
            </span>
            <p className="ctaBlock-ctaDescription">
              {home.callToActions.firstCTA.subHeading}
            </p>
          </div>
        </CustomLink>
        <CustomLink
          linkType={home.callToActions.secondCTA.linkType}
          linkURL={home.callToActions.secondCTA.linkURL}
          className="ctaBlock-pattern  ctaBlock-pattern--second"
        >
          <div className="ctaBlock-cta">
            <span className="ctaBlock-ctaHeading">
              {home.callToActions.secondCTA.heading}
            </span>
            <p className="ctaBlock-ctaDescription">
              {home.callToActions.secondCTA.subHeading}
            </p>
          </div>
        </CustomLink>
      </section>
    </>
  );
}
