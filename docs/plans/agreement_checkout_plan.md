# Feature: Agreement Checkout Page (/work-together/start)

**Tracking:** N/A
**Size:** M

## Overview

A clickwrap checkout page that turns the post-call follow-up into a one-click close: client reads the standard agreement, checks a box, and lands on the Mercury invoice to pay. Phase 1 is fully static — matches the current Netlify `output: "export"` deploy — with Will manually creating each invoice. Phase 2 adds emails, persistence, and invoice automation and requires moving off static export.

## Background

Standard engagement: flat weekly rate (~$10K/wk, flexed per client) stated on the Mercury invoice; the agreement never hardcodes the rate. Mercury Invoicing has no reusable checkout URL and invoice API access requires Mercury Plus ($35/mo), both of which push us to a stateless Phase 1: Will creates the invoice, copies the payment URL into a `?inv=<base64url>` param on the follow-up link, and the paid invoice (with a memo pointing at the versioned agreement URL) becomes the acceptance record.

Codebase constraints:
- Next.js 16 App Router, static export to Netlify (`output: "export"`, `trailingSlash: true`). **No API routes, server actions, or middleware available.**
- Content in `src/content/` loaded at build time by `lib/content.ts` (gray-matter + remark). Frontmatter types in `lib/content-types.ts`.
- Existing UI primitives: `Container`, `Prose` (html), `CTAButton`. Site pages live under `app/(site)/`.
- Initial agreement text sits at `src/content/consulting_agreement_2026-07-23.md` and needs relocating.

## Plan

### Phase 1: Static clickwrap page

Flow: Will creates the Mercury invoice with memo "Payment constitutes acceptance of the Consulting Agreement (2026-07-23) at [permanent URL]" → follow-up email links to `/work-together/start/?inv=<base64url of invoice URL>` → client reads, checks box, clicks Continue → redirected to Mercury → payment is the acceptance record.

- **Move agreement source**: `src/content/consulting_agreement_2026-07-23.md` → `src/content/agreement/2026-07-23.md`. Add minimal frontmatter (`templateKey: agreement`, `version`, `effectiveDate`, `entity`, `governingLaw`); body unchanged. Rationale: gives every version its own file in a dedicated collection folder — clean home for future versions and a Sveltia CMS collection.
- **Content loader**: extend `lib/content.ts` with `getAgreement(version)`, `getCurrentAgreement()`, `listAgreementVersions()`, and a `CURRENT_AGREEMENT_VERSION` constant. Add `AgreementFrontmatter` to `lib/content-types.ts`.
- **Permanent version route** `app/(site)/agreement/[version]/page.tsx` with `generateStaticParams` from files in `src/content/agreement/*.md`. Each version renders via `Prose html={...}` in `Container`. Old routes never change.
- **Checkout page** `app/(site)/work-together/start/page.tsx`: server component fetches current agreement (SSG), renders it, then mounts a `"use client"` `StartClickwrap` component below.
- **`StartClickwrap.tsx`**: reads `inv` from `window.location.search` in `useEffect` (avoids hydration mismatch under static export). Continue disabled until checkbox checked. On click: base64url-decode, `new URL()`, allowlist `hostname === "mercury.com" || "app.mercury.com"` (prevents open-redirect), then `window.location.assign`. If `inv` is missing/invalid: replace Continue with an inline "check your inbox" fallback.
- **`/work-together` CTA**: small copy addition in `src/content/work-together/index.md` linking scoped clients to `/work-together/start/`. No page-component change.
- **Sveltia CMS config**: if a config file is present in this repo, add an `agreement` folder collection pointing at `src/content/agreement/*.md`. If not present, skip and note it.

Design choice: encoding the invoice URL in the query param (vs. a server-side lookup code) keeps the flow stateless, which is required under static export and keeps Phase 1 free of new infra.

### Phase 2: Records, emails, invoice automation

Triggered when recurring paid engagements justify paid infra. **Requires moving off `output: "export"`** — recommended target is Vercel (drop the export flag, add `app/api/accept/route.ts` as a Vercel Function). Netlify Functions is a viable fallback.

- Form fields (name/email/company) added to `StartClickwrap`.
- `app/api/accept/route.ts`: validate → persist record → send acceptance email (Resend) → create Mercury invoice via Mercury Plus API → return payment URL. Removes the `?inv=` param and the manual pre-creation step.
- Acceptance email: version + SHA-256 hash of raw markdown + link to `/agreement/[version]/`; no attachments.
- Persistence: Neon Postgres (Vercel Marketplace) — id, name, email, company, version + hash, IP, timestamp, invoice id/status.
- Optional: Mercury webhook or cron to close the loop on payment.

## Files Changed Summary

| File | Change |
|------|--------|
| `src/content/consulting_agreement_2026-07-23.md` | Delete (moved) |
| `src/content/agreement/2026-07-23.md` | New: moved file + minimal frontmatter |
| `lib/content.ts` | Add agreement loaders + `CURRENT_AGREEMENT_VERSION` |
| `lib/content-types.ts` | Add `AgreementFrontmatter` |
| `app/(site)/agreement/[version]/page.tsx` | New: SSG per version |
| `app/(site)/work-together/start/page.tsx` | New: server component, renders agreement + client |
| `app/(site)/work-together/start/StartClickwrap.tsx` | New: `"use client"` checkbox + safe redirect |
| `src/content/work-together/index.md` | Add CTA line to `/work-together/start/` |
| Sveltia CMS config (if present) | Add `agreement` folder collection |
| P2 | `next.config.mjs` (remove export), `app/api/accept/route.ts`, `lib/mercury.ts`, DB migration, email template |

## Testing

- `pnpm typecheck` and `pnpm build` pass after the file move.
- `/agreement/2026-07-23/` renders correctly and byte-matches what's shown on `/work-together/start/`.
- Continue disabled until checkbox checked.
- `?inv=<base64url of non-Mercury URL>` is rejected → fallback message shown.
- Missing `?inv` → agreement still renders, no console error, no accidental redirect.
- Valid Mercury `?inv` → redirects to the decoded URL after check + click.
- No hydration warnings (query-param read in `useEffect`, not during render).
- Mobile viewport spot-check of agreement page.

## Open Questions

- Is a Sveltia CMS config already checked into this repo? If yes, wire the `agreement` collection here; if no, defer.
- Where does the follow-up email template live (repo, Notion, personal drafts)? Determines where the `/work-together/start/?inv=...` link recipe is documented.

## Decisions Made

- Entity: Upscale Level LLC (Florida). Governing law: Florida.
- Agreement source of truth: `src/content/agreement/<YYYY-MM-DD>.md`, with `CURRENT_AGREEMENT_VERSION` naming the version served at `/work-together/start/`.
- Phase 1 stays inside the current static-export deploy; Phase 2's server needs are the trigger to migrate off it.
