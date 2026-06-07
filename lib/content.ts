import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { format, parseISO } from "date-fns";
import type {
  AboutFrontmatter,
  ContentDoc,
  FooterFrontmatter,
  HomeFrontmatter,
  MeetupDoc,
  MeetupFrontmatter,
  NavbarFrontmatter,
  PastMeetupsFrontmatter,
  RedirectFrontmatter,
} from "./content-types";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

const markdownProcessor = remark().use(remarkHtml, { sanitize: false });

async function readMarkdown<F>(relPath: string): Promise<ContentDoc<F>> {
  const full = path.join(CONTENT_ROOT, relPath);
  const raw = await fs.readFile(full, "utf8");
  const parsed = matter(raw);
  const html = String(await markdownProcessor.process(parsed.content));
  return { frontmatter: parsed.data as F, html };
}

export async function getHomePage(): Promise<ContentDoc<HomeFrontmatter>> {
  return readMarkdown<HomeFrontmatter>("home/index.md");
}

export async function getAboutPage(): Promise<ContentDoc<AboutFrontmatter>> {
  return readMarkdown<AboutFrontmatter>("about/index.md");
}

export async function getPastMeetupsPage(): Promise<
  ContentDoc<PastMeetupsFrontmatter>
> {
  return readMarkdown<PastMeetupsFrontmatter>("pastMeetups/index.md");
}

export async function getRedirectPage(
  slug: "contact" | "work-together"
): Promise<ContentDoc<RedirectFrontmatter>> {
  return readMarkdown<RedirectFrontmatter>(`${slug}/index.md`);
}

export async function getNavbar(): Promise<ContentDoc<NavbarFrontmatter>> {
  return readMarkdown<NavbarFrontmatter>("navbar/index.md");
}

export async function getFooter(): Promise<ContentDoc<FooterFrontmatter>> {
  return readMarkdown<FooterFrontmatter>("footer/index.md");
}

export async function getLayoutData(): Promise<{
  navbar: NavbarFrontmatter;
  footer: FooterFrontmatter;
}> {
  const [navbar, footer] = await Promise.all([getNavbar(), getFooter()]);
  return { navbar: navbar.frontmatter, footer: footer.frontmatter };
}

export async function getAllMeetups(): Promise<MeetupDoc[]> {
  const dir = path.join(CONTENT_ROOT, "meetups");
  const entries = await fs.readdir(dir);
  const docs = await Promise.all(
    entries
      .filter((f) => f.endsWith(".md"))
      .map(async (file): Promise<MeetupDoc> => {
        const slug = file.replace(/\.md$/, "");
        const doc = await readMarkdown<MeetupFrontmatter>(`meetups/${file}`);
        const rawDate =
          doc.frontmatter.date instanceof Date
            ? doc.frontmatter.date
            : parseISO(doc.frontmatter.date);
        return {
          slug,
          frontmatter: doc.frontmatter,
          html: doc.html,
          rawDate,
          formattedDate: format(rawDate, "MMMM do yyyy '@' h:mm a"),
        };
      })
  );
  return docs.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
}

export async function getUpcomingMeetup(
  now: Date = new Date()
): Promise<MeetupDoc | null> {
  const meetups = await getAllMeetups();
  const future = meetups
    .filter((m) => m.rawDate.getTime() > now.getTime())
    .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  return future[0] ?? null;
}

export async function getPastMeetups(
  now: Date = new Date()
): Promise<MeetupDoc[]> {
  const meetups = await getAllMeetups();
  return meetups.filter((m) => m.rawDate.getTime() < now.getTime());
}
