"use client";

import type { MouseEvent } from "react";

declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

interface TrackLinkClickInput {
  href: string;
  text: string;
  location: string;
  external?: boolean;
}

const BUTTON_NAMES = ["left", "middle", "right"] as const;

function getTargetDomain(href: string, currentHost: string): string | null {
  try {
    const url = new URL(href, window.location.href);
    if (!url.host) return null;
    return url.host === currentHost ? null : url.host;
  } catch {
    return null;
  }
}

export function trackLinkClick(
  input: TrackLinkClickInput,
  event?: MouseEvent<HTMLAnchorElement>,
) {
  try {
    const { href, text, location, external = false } = input;
    const currentHost = window.location.host;
    const targetDomain = getTargetDomain(href, currentHost);

    const button = event ? BUTTON_NAMES[event.button] ?? "other" : undefined;
    const modifierKeys = event
      ? {
          ctrl: event.ctrlKey,
          meta: event.metaKey,
          shift: event.shiftKey,
          alt: event.altKey,
        }
      : undefined;
    const opensNewTab = event
      ? event.metaKey || event.ctrlKey || event.button === 1
      : undefined;

    window.analytics?.track("Link Clicked", {
      href,
      text,
      location,
      is_internal: !external,
      target_domain: targetDomain,
      current_url: window.location.href,
      current_path: window.location.pathname,
      referrer: document.referrer || null,
      button,
      modifier_keys: modifierKeys,
      opens_new_tab: opensNewTab,
    });
  } catch {
    // analytics not loaded yet — drop the event rather than block navigation
  }
}
