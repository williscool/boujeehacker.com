import type { ReactNode } from "react";
import { Fraunces, Geist } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
