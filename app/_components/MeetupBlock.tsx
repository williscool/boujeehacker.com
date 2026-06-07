import HeadshotPlaceholder from "../../src/img/headshot-placeholder.svg";
import type { MeetupDoc } from "../../lib/content-types";

interface MeetupBlockProps {
  meetup: MeetupDoc;
  className?: string;
}

export default function MeetupBlock({ meetup, className }: MeetupBlockProps) {
  const { frontmatter, formattedDate } = meetup;
  return (
    <section className={`meetup  ${className ?? ""}`}>
      <h2 className="meetup-title">{frontmatter.title}</h2>
      <div className="meetup-meta">
        <p className="meetup-metaField  meetup-metaField--date">
          <span className="meetup-label">Date:</span> {formattedDate}
        </p>
        <p className="meetup-metaField  meetup-metaField--location">
          <span className="meetup-label">Location:</span>{" "}
          {frontmatter.location.name}
        </p>
      </div>
      <div className="meetup-presenters">
        {frontmatter.presenters.map((presenter) => (
          <div className="meetup-presenter" key={presenter.name}>
            <div className="meetup-presenterImageContainer">
              <img
                className="meetup-presenterImage"
                src={presenter.image ? presenter.image : HeadshotPlaceholder.src}
                alt={
                  presenter.image
                    ? presenter.name
                    : "Default headshot placeholder"
                }
              />
              <span className="meetup-presenterName">{presenter.name}</span>
            </div>
            <div className="meetup-presenterInfo">
              {presenter.presentationTitle && (
                <h3 className="meetup-presenterTitle">
                  {presenter.presentationTitle}
                </h3>
              )}
              <p className="meetup-presenterText">{presenter.text}</p>
              <ul className="meetup-presenterLinks">
                {presenter.links &&
                  presenter.links.map((link, index) => (
                    <li key={index} className="meetup-presenterLinkItem">
                      <a className="meetup-presenterLink" href={link.linkURL}>
                        {link.linkText}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
