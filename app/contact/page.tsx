import type { Metadata } from "next";
import "../../src/styles/redirect.scss";
import RedirectShell from "../_components/RedirectShell";
import { getRedirectPage } from "../../lib/content";

export const metadata: Metadata = { title: "Redirecting..." };

export default async function ContactPage() {
  const { frontmatter } = await getRedirectPage("contact");
  return (
    <>
      <meta httpEquiv="refresh" content={`2;url=${frontmatter.redirectTo}`} />
      <RedirectShell redirectTo={frontmatter.redirectTo} />
    </>
  );
}
