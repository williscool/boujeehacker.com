import {
  getAboutPage,
  getAllMeetups,
  getFooter,
  getHomePage,
  getLayoutData,
  getNavbar,
  getPastMeetups,
  getPastMeetupsPage,
  getRedirectPage,
  getUpcomingMeetup,
} from "../lib/content.ts";

function summary(label: string, value: unknown): void {
  const preview =
    typeof value === "string"
      ? value.length > 80
        ? value.slice(0, 80) + `… (${value.length} chars)`
        : value
      : value;
  console.log(`${label}:`, preview);
}

async function main(): Promise<void> {
  console.log("== home ==");
  const home = await getHomePage();
  summary("templateKey", home.frontmatter.templateKey);
  summary("title", home.frontmatter.title);
  summary("seo.browserTitle", home.frontmatter.seo.browserTitle);
  summary("ctas", [
    home.frontmatter.callToActions.firstCTA.heading,
    home.frontmatter.callToActions.secondCTA.heading,
  ]);
  summary("html.length", home.html.length);

  console.log("\n== about ==");
  const about = await getAboutPage();
  summary("title", about.frontmatter.title);
  summary("gallery.length", about.frontmatter.gallery.length);
  summary("organizers", about.frontmatter.organizers.title);
  summary("html.length", about.html.length);

  console.log("\n== pastMeetups page ==");
  const pmp = await getPastMeetupsPage();
  summary("title", pmp.frontmatter.title);
  summary("path", pmp.frontmatter.path);

  console.log("\n== redirects ==");
  const contact = await getRedirectPage("contact");
  const workTogether = await getRedirectPage("work-together");
  summary("contact.redirectTo", contact.frontmatter.redirectTo);
  summary("workTogether.redirectTo", workTogether.frontmatter.redirectTo);

  console.log("\n== layout ==");
  const layout = await getLayoutData();
  summary("navbar.menuItems", layout.navbar.menuItems.map((m) => m.label));
  summary("footer.title", layout.footer.title);
  summary("footer.links", layout.footer.footerLinks.map((l) => l.label));

  console.log("\n== meetups ==");
  const all = await getAllMeetups();
  summary("count", all.length);
  for (const m of all) {
    console.log(
      ` - ${m.slug} | ${m.formattedDate} | presenters=${m.frontmatter.presenters.length} | location=${m.frontmatter.location.name}`
    );
  }

  console.log("\n== upcoming meetup (vs now) ==");
  const upcoming = await getUpcomingMeetup();
  console.log(upcoming ? `${upcoming.slug} on ${upcoming.formattedDate}` : "none");

  console.log("\n== past meetups (vs now) ==");
  const past = await getPastMeetups();
  summary("count", past.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
