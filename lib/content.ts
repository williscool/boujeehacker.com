import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type {
  AboutFrontmatter,
  ContentDoc,
  FooterFrontmatter,
  HomeFrontmatter,
  NavbarFrontmatter,
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

