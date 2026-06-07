import type { Metadata } from "next";
import RedirectShell from "../../_components/RedirectShell";
import { getRedirectPage } from "../../../lib/content";

export const metadata: Metadata = { title: "Redirecting..." };

export default async function WorkTogetherPage() {
  const { frontmatter } = await getRedirectPage("work-together");
  return (
    <>
      <meta httpEquiv="refresh" content={`2;url=${frontmatter.redirectTo}`} />
      <RedirectShell redirectTo={frontmatter.redirectTo} />
    </>
  );
}
