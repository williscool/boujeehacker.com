import CustomLink from "./CustomLink";
import type { NavbarFrontmatter } from "../../lib/content-types";

interface NavbarProps {
  data: NavbarFrontmatter;
}

export default function Navbar({ data }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="container  navbar-container">
        {data.menuItems.length > 0 && (
          <ul className="navbar-menu">
            {data.menuItems.map((menuItem) => (
              <li key={menuItem.linkURL} className="navbar-menuItem">
                <CustomLink
                  linkType={menuItem.linkType}
                  linkURL={menuItem.linkURL}
                  className="navbar-menuLink"
                >
                  {menuItem.label}
                </CustomLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
