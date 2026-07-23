"use client";

import { useEffect, useState } from "react";

const MERCURY_HOSTS = new Set(["mercury.com", "app.mercury.com"]);

function decodeBase64Url(input: string): string | null {
  try {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    return atob(padded + pad);
  } catch {
    return null;
  }
}

function parseInvoiceUrl(raw: string | null): string | null {
  if (!raw) return null;
  const decoded = decodeBase64Url(raw);
  if (!decoded) return null;
  try {
    const url = new URL(decoded);
    if (url.protocol !== "https:") return null;
    if (!MERCURY_HOSTS.has(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

type InvoiceState =
  | { status: "loading" }
  | { status: "ready"; url: string }
  | { status: "missing" };

export default function StartClickwrap({
  agreementVersion,
}: {
  agreementVersion: string;
}) {
  const [invoice, setInvoice] = useState<InvoiceState>({ status: "loading" });
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = parseInvoiceUrl(params.get("inv"));
    setInvoice(url ? { status: "ready", url } : { status: "missing" });
  }, []);

  const handleContinue = () => {
    if (invoice.status !== "ready" || !agreed) return;
    window.location.assign(invoice.url);
  };

  const ready = invoice.status === "ready";
  const buttonDisabled = !ready || !agreed;

  return (
    <div className="border-t border-border pt-8 space-y-5 max-w-[var(--measure)]">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <span className="text-text">
          I have read and agree to the Consulting Agreement above
          (version {agreementVersion}).
        </span>
      </label>

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={buttonDisabled}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-bg font-medium transition-colors duration-[var(--transition-duration)] hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue to invoice
          <span aria-hidden>→</span>
        </button>

        {invoice.status === "missing" && (
          <p className="text-sm text-text-muted m-0">
            Can't find your invoice link — check your inbox, or{" "}
            <a href="mailto:wharris@upscalews.com" className="underline">
              email Will
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
