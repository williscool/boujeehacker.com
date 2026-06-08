import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Container from "./_components/Container";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container>
      <div className="py-24 space-y-6">
        <p className="text-xs uppercase tracking-wide text-text-muted m-0">
          404
        </p>
        <h1 className="font-display text-4xl m-0">Page not found</h1>
        <p className="m-0 text-text-muted">
          That URL doesn’t exist on the site.
        </p>
        <p className="m-0">
          <Link
            href="/"
            className="underline decoration-border underline-offset-[3px] hover:text-link-hover hover:decoration-link-hover"
          >
            Back home →
          </Link>
        </p>
      </div>
    </Container>
  );
}
