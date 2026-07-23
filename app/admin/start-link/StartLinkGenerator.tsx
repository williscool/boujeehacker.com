"use client";

import { useMemo, useState } from "react";

const MERCURY_HOSTS = new Set(["mercury.com", "app.mercury.com"]);
const SITE_ORIGIN = "https://boujeehacker.com";

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

type Result =
  | { kind: "empty" }
  | { kind: "invalid"; reason: string }
  | { kind: "ok"; link: string };

function build(invoiceUrl: string): Result {
  const trimmed = invoiceUrl.trim();
  if (!trimmed) return { kind: "empty" };

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { kind: "invalid", reason: "Not a valid URL." };
  }

  if (url.protocol !== "https:") {
    return { kind: "invalid", reason: "URL must use https." };
  }
  if (!MERCURY_HOSTS.has(url.hostname)) {
    return {
      kind: "invalid",
      reason: `Host ${url.hostname} isn't a Mercury domain. Expected mercury.com or app.mercury.com.`,
    };
  }

  const encoded = base64UrlEncode(url.toString());
  return {
    kind: "ok",
    link: `${SITE_ORIGIN}/work-together/start/?inv=${encoded}`,
  };
}

export default function StartLinkGenerator() {
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => build(invoiceUrl), [invoiceUrl]);

  const handleCopy = async () => {
    if (result.kind !== "ok") return;
    await navigator.clipboard.writeText(result.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm text-text-muted">Mercury invoice URL</span>
        <input
          type="url"
          value={invoiceUrl}
          onChange={(e) => {
            setInvoiceUrl(e.target.value);
            setCopied(false);
          }}
          placeholder="https://app.mercury.com/..."
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
        />
      </label>

      {result.kind === "invalid" && (
        <p className="text-sm text-red-600 m-0">{result.reason}</p>
      )}

      {result.kind === "ok" && (
        <div className="space-y-2">
          <span className="text-sm text-text-muted">Generated link</span>
          <div className="flex gap-2">
            <input
              readOnly
              value={result.link}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-text"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md bg-accent px-4 py-2 text-bg font-medium hover:bg-accent-hover"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
