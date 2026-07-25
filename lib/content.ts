import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type {
  AboutFrontmatter,
  AgreementFrontmatter,
  ContentDoc,
  FooterFrontmatter,
  HomeFrontmatter,
  NavbarFrontmatter,
  RedirectFrontmatter,
  WorkTogetherFrontmatter,
} from "./content-types";

export const CURRENT_AGREEMENT_VERSION = "2026-07-23";

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
  slug: "contact"
): Promise<ContentDoc<RedirectFrontmatter>> {
  return readMarkdown<RedirectFrontmatter>(`${slug}/index.md`);
}

export async function getWorkTogetherPage(): Promise<
  ContentDoc<WorkTogetherFrontmatter>
> {
  return readMarkdown<WorkTogetherFrontmatter>("work-together/index.md");
}

export async function getNavbar(): Promise<ContentDoc<NavbarFrontmatter>> {
  return readMarkdown<NavbarFrontmatter>("navbar/index.md");
}

export async function getFooter(): Promise<ContentDoc<FooterFrontmatter>> {
  return readMarkdown<FooterFrontmatter>("footer/index.md");
}

export async function getAgreement(
  version: string
): Promise<ContentDoc<AgreementFrontmatter>> {
  return readMarkdown<AgreementFrontmatter>(`agreement/${version}.md`);
}

export async function getCurrentAgreement(): Promise<
  ContentDoc<AgreementFrontmatter>
> {
  return getAgreement(CURRENT_AGREEMENT_VERSION);
}

export async function listAgreementVersions(): Promise<string[]> {
  const dir = path.join(CONTENT_ROOT, "agreement");
  const entries = await fs.readdir(dir);
  return entries
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""))
    .sort();
}

export async function getLayoutData(): Promise<{
  navbar: NavbarFrontmatter;
  footer: FooterFrontmatter;
}> {
  const [navbar, footer] = await Promise.all([getNavbar(), getFooter()]);
  return { navbar: navbar.frontmatter, footer: footer.frontmatter };
}

