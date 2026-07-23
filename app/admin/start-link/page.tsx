import type { Metadata } from "next";
import StartLinkGenerator from "./StartLinkGenerator";

export const metadata: Metadata = {
  title: "Start-link generator",
  robots: { index: false, follow: false },
};

export default function StartLinkPage() {
  return (
    <main className="mx-auto max-w-[640px] px-6 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium">Start-link generator</h1>
        <p className="text-sm text-text-muted m-0">
          Paste a Mercury invoice payment URL to produce a{" "}
          <code>/work-together/start/</code> link for the follow-up email.
        </p>
      </div>
      <StartLinkGenerator />
    </main>
  );
}
