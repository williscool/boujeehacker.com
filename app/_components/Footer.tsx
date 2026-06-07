import "../../src/components/Footer/styles.scss";
import type { FooterFrontmatter } from "../../lib/content-types";

interface FooterProps {
  data: FooterFrontmatter;
}

export default function Footer({ data }: FooterProps) {
  const { linksTitle, footerLinks, description, title } = data;
  return (
    <nav className="footer">
      <div className="footer-container  container">
        <div className="footer-top">
          <div className="footer-about">
            <h2 className="footer-aboutTitle">{title}</h2>
            <p className="footer-aboutDescription">{description}</p>
          </div>
          {footerLinks.length > 0 && (
            <div className="footer-linksContainer">
              <h2 className="footer-aboutTitle">{linksTitle}</h2>
              <ul className="footer-socialMenu">
                {footerLinks.map((footerLink) => (
                  <li
                    key={footerLink.linkURL}
                    className="footer-socialMenuItem"
                  >
                    <a
                      className="footer-footerLink"
                      href={footerLink.linkURL}
                      target="_blank"
                      rel="noopener"
                    >
                      <img
                        className="footer-footerLinkIcon"
                        src={footerLink.image}
                        alt={footerLink.imageAlt}
                      />
                      {footerLink.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
