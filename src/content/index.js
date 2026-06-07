import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { isAfter } from "date-fns";
import ReactMarkdown from "react-commonmark";
import { FaLinkedin, FaGithub } from "react-icons/fa";


import Layout from "../components/Layout";
import CustomLink from "../components/CustomLink";
import "../styles/home.scss";

export const HomePageTemplate = ({ home, upcomingMeetup = null }) => {
  return (
    <>
      <section className="header">
        <div className="header-container  container">
          {home.headerImage && <img className="header-image" src={home.headerImage.image} alt={home.headerImage.imageAlt} />}
          <div className="header-tagline">
            <div>
              <ReactMarkdown className="header-title" source={home.title} />
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
                  <img width={32} height={32}
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
              {/* <span>
                <a
                  href="https://nomadlist.com/@williscool"
                  target="_blank"
                  rel="noopener"
                >
                  <img width={32} height={32}
                    src="/img/nomadlist-icon.svg"
                    alt="nomadlist"
                  />
                </a>
              </span> */}
              {/* <span>
                <a
                  href="https://angel.co/u/william-harris-1"
                  target="_blank"
                  rel="noopener"
                >
                  <img width={32} height={32}
                    src="/img/angelist.svg"
                    alt="angellist"
                  />
                </a>
              </span> */}
            </div>

          </div>

        </div>
      </section>
      <section className="upcomingMeetup  section">
        <div className="upcomingMeetup-container  container">
          <div id="home-main" className="pastMeetups">
            <ReactMarkdown className="main-content-header-title" source={home.homeMainContent} linkTarget="_blank" />
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
            <span className="ctaBlock-ctaHeading">{home.callToActions.firstCTA.heading}</span>
            <p className="ctaBlock-ctaDescription">{home.callToActions.firstCTA.subHeading}</p>
          </div>
        </CustomLink>
        <CustomLink
          linkType={home.callToActions.secondCTA.linkType}
          linkURL={home.callToActions.secondCTA.linkURL}
          className="ctaBlock-pattern  ctaBlock-pattern--second"
        >
          <div className="ctaBlock-cta">
            <span className="ctaBlock-ctaHeading">{home.callToActions.secondCTA.heading}</span>
            <p className="ctaBlock-ctaDescription">{home.callToActions.secondCTA.subHeading}</p>
          </div>
        </CustomLink>
      </section>
    </>
  );
};

class HomePage extends React.Component {
  render() {
    const { data } = this.props;
    const { frontmatter: home } = data.homePageData.edges[0].node;
    const {
      data: { footerData, navbarData },
    } = this.props;
    let upcomingMeetup = null;
    // Find the next meetup that is closest to today
    data.allMarkdownRemark.edges.every(item => {
      const { frontmatter: meetup } = item.node;
      if (isAfter(meetup.rawDate, new Date())) {
        upcomingMeetup = meetup;
        return true;
      } else {
        return false;
      }
    });
    return (
      <Layout footerData={footerData} navbarData={navbarData}>
        <HomePageTemplate home={home} upcomingMeetup={upcomingMeetup} />
      </Layout>
    );
  }
}

export function Head({ location, params, data, pageContext }) {
  const { frontmatter: home } = data.homePageData.edges[0].node;
  const {
    seo: { title: seoTitle, description: seoDescription, keywords: seoKeywords, browserTitle },
  } = home;

  return (<>
    <meta name="title" content={seoTitle} />
    <meta name="description" content={seoDescription} />
    <meta name="keywords" content={seoKeywords} />
    <title>{browserTitle}</title>
  </>
  )
}

HomePage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default HomePage;

export const pageQuery = graphql`
  query HomePageQuery {
    allMarkdownRemark(
      filter: { frontmatter: { presenters: { elemMatch: { text: { ne: null } } } } }
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      edges {
        node {
          frontmatter {
            title
            formattedDate: date(formatString: "MMMM Do YYYY @ h:mm A")
            rawDate: date
            presenters {
              name
              image
              text
              presentationTitle
            }
            location {
              mapsLatitude
              mapsLongitude
              mapsLink
              name
            }
          }
        }
      }
    }
    ...LayoutFragment
    homePageData: allMarkdownRemark(filter: { frontmatter: { templateKey: { eq: "home-page" } } }) {
      edges {
        node {
          frontmatter {
            title
            headerImage {
              image
              imageAlt
            }
            homeMainContent
            callToActions {
              firstCTA {
                heading
                subHeading
                linkType
                linkURL
              }
              secondCTA {
                heading
                subHeading
                linkType
                linkURL
              }
            }
            seo {
              browserTitle
              title
              description
              keywords
            }
          }
        }
      }
    }
  }
`;
