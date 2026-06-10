import type { Metadata } from "next";
import RedirectShell from "../../_components/RedirectShell";
import { getWorkTogetherPage } from "../../../lib/content";

export const metadata: Metadata = { title: "Redirecting to booking..." };

export default async function BookingPage() {
  const { frontmatter } = await getWorkTogetherPage();
  const url = frontmatter.bookingUrl ?? "https://calendly.com/wharris-cal";
  return (
    <>
      <meta httpEquiv="refresh" content={`2;url=${url}`} />
      <RedirectShell
        redirectTo={url}
        label="Taking you to booking"
        redirectName="booking"
      />
    </>
  );
}
