"use client";

import { useEffect } from "react";
import Container from "./Container";

interface RedirectShellProps {
  redirectTo: string;
  label?: string;
}

export default function RedirectShell({
  redirectTo,
  label = "Taking you there",
}: RedirectShellProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [redirectTo]);

  return (
    <Container>
      <div className="py-16 sm:py-24 space-y-6">
        <p className="text-xs uppercase tracking-wide text-text-muted m-0">
          Redirecting
        </p>
        <h1 className="font-display text-4xl m-0">{label}…</h1>
        <img
          src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3d4eWZ2dThuaWdnM3ZqdHdseWx1cGpxaGRjbndsMmFmcW0yMjl1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1kkxWqT5nvLXupUTwK/giphy.webp"
          alt="Computer Doggo, taking you there"
          className="max-w-xs rounded-md border border-border"
        />
        <pre
          aria-hidden
          className="m-0 font-mono text-xs sm:text-sm text-text-muted leading-tight whitespace-pre overflow-x-auto"
        >{`(___________________________()6 \`-,
(   ______________________   /''"\`
 //\\                      //\\
 "" ""                     "" ""`}</pre>
        <p className="m-0 text-text-muted">
          If the page doesn’t load,{" "}
          <a
            href={redirectTo}
            className="underline decoration-border underline-offset-[3px] hover:text-link-hover hover:decoration-link-hover"
          >
            click here
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
