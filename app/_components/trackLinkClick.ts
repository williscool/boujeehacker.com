"use client";

declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function trackLinkClick(properties: {
  href: string;
  text: string;
  location: string;
  external?: boolean;
}) {
  try {
    window.analytics?.track("Link Clicked", properties);
  } catch {
    // analytics not loaded yet — drop the event rather than block navigation
  }
}
