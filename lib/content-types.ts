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

export interface CallToAction {
  heading: string;
  subHeading: string;
  linkType: LinkType;
  linkURL: string;
}

export interface HomeFrontmatter {
  templateKey: "home-page";
  title: string;
  headerImage?: ImageRef;
  homeMainContent: string;
  callToActions: {
    firstCTA: CallToAction;
    secondCTA: CallToAction;
  };
  seo: SeoFields;
}

export interface AboutOrganizerEntry extends ImageRef {
  name: string;
}

export interface AboutFrontmatter {
  templateKey: "about-page";
  title: string;
  mainImage: ImageRef;
  gallery: ImageRef[];
  developerGroups: string;
  organizers: {
    title: string;
    gallery: AboutOrganizerEntry[];
  };
  seo: SeoFields;
}

export interface PastMeetupsFrontmatter {
  templateKey: "past-meetups-page";
  title: string;
  path?: string;
  seo: SeoFields;
}

export interface PresenterLink {
  linkText: string;
  linkURL: string;
}

export interface MeetupPresenter {
  name: string;
  image?: string;
  presentationTitle?: string;
  text: string;
  links?: PresenterLink[];
}

export interface MeetupLocation {
  name: string;
  mapsLink?: string;
  mapsLatitude?: number;
  mapsLongitude?: number;
}

export interface MeetupFrontmatter {
  templateKey?: "meetup";
  title: string;
  date: string | Date;
  presenters: MeetupPresenter[];
  location: MeetupLocation;
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
  templateKey: "contact" | "work-together";
  redirectTo: string;
}

export interface ContentDoc<F> {
  frontmatter: F;
  html: string;
}

export interface MeetupDoc {
  slug: string;
  frontmatter: MeetupFrontmatter;
  html: string;
  rawDate: Date;
  formattedDate: string;
}
