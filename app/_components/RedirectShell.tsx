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
      <div className="py-24 space-y-6">
        <p className="text-xs uppercase tracking-wide text-text-muted m-0">
          Redirecting
        </p>
        <h1 className="font-display text-4xl m-0">{label}…</h1>
        <p className="m-0 text-text-muted">
          If the page doesn’t load,{" "}
          <a href={redirectTo} className="underline decoration-border underline-offset-[3px] hover:text-link-hover hover:decoration-link-hover">
            click here
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
