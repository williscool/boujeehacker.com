export type LinkType = "internal" | "external";

export interface ImageRef {
  image: string;
  imageAlt: string;
}

export interface SeoFields {
  browserTitle: string;
  title: string;
  description: string;
  keywords?: string;
}

export interface SelectedWorkItem {
  title: string;
  outcome: string;
  url: string;
}

export interface PrimaryCTA {
  label: string;
  url: string;
}

export interface HomeSocialLink {
  label: string;
  url: string;
}

export interface HomeFrontmatter {
  templateKey: "home-page";
  avatar?: ImageRef;
  identityLine: string;
  selectedWork: SelectedWorkItem[];
  nowLine: string;
  primaryCTA: PrimaryCTA;
  socialLinks: HomeSocialLink[];
  seo: SeoFields;
}

export interface AboutFrontmatter {
  templateKey: "about-page";
  title: string;
  seo: SeoFields;
}

export interface NavbarMenuItem {
  label: string;
  linkType: LinkType;
  linkURL: string;
}

export interface NavbarFrontmatter {
  templateKey: "navbar";
  logoImage?: ImageRef;
  menuItems: NavbarMenuItem[];
}

export interface FooterLink {
  image: string;
  imageAlt: string;
  label: string;
  linkURL: string;
}

export interface FooterFrontmatter {
  templateKey: "footer";
  title: string;
  description: string;
  linksTitle: string;
  logoImage: {
    image: string;
    imageAlt: string;
    tagline: string;
  };
  footerLinks: FooterLink[];
}

export interface RedirectFrontmatter {
  templateKey: "contact";
  redirectTo: string;
}

export interface WorkTogetherFrontmatter {
  templateKey: "work-together";
  title: string;
  icpLine: string;
  deckUrl?: string;
  seo: SeoFields;
}

export interface ContentDoc<F> {
  frontmatter: F;
  html: string;
}
