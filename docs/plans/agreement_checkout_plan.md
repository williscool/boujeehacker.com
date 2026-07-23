# Feature: Agreement Checkout Page (/work-together/start)

**Tracking:** N/A
**Size:** M

## Overview

Add a clickwrap checkout page to boujeehacker.com that turns the post-call follow-up into a one-click close: client reads the standard agreement, checks a box, and lands on the Mercury invoice to pay. Phase 1 is backend-free with manually created invoices (zero new spend, zero new accounts); Phase 2 adds acceptance-record emails, persistence, and invoice automation via the Mercury API once the flow is generating revenue.

## Background

Standard engagement is a flat weekly outcome-scoped sprint (standard rate ~$10K/wk, flexed down for friends-and-family and up for established businesses). The agreement intentionally does not hardcode the rate; the fee is whatever the Mercury invoice for that engagement states. Mercury Invoicing has no static reusable checkout URL: payment links die after one payment, and invoices are per-customer. Invoice creation via API requires Mercury Plus ($35/mo), which we're deferring. The workaround: Will creates the invoice manually before sending the follow-up email, and the follow-up link carries the invoice URL so the page can redirect to it after acceptance.

Clickwrap enforceability requires: full agreement visible on the page, affirmative checkbox, and a durable record of who accepted which version when. In Phase 1 the durable record is the paid invoice itself, whose memo references the versioned agreement URL; Mercury timestamps the payment and holds the customer's identity. Phase 2 upgrades this to an emailed acceptance record plus a database row.

## Plan

### Phase 1: Clickwrap page, no backend

Flow: Will creates the invoice in Mercury at the rate for that client, with a memo line: "Payment constitutes acceptance of the Consulting Agreement (2026-07-23) at [permanent URL]" → copies its payment URL → follow-up email links to `/work-together/start?inv=<base64url of invoice URL>` → client reads the agreement, checks the box, clicks Continue → redirected to the Mercury invoice → payment is the acceptance record.

No email sending, no database, no new accounts. The durable acceptance record in Phase 1 is the paid Mercury invoice whose memo references the versioned agreement URL (Mercury timestamps the payment and already holds the customer's name and email). The checkbox page is belt-and-suspenders on top of that.

- **Agreement content** lives as a versioned markdown file (`content/agreement-2026-07-23.md`) rendered on the page.
- **Page** (`app/work-together/start/page.tsx`): full agreement rendered, then a single checkbox ("I have read and agree to the Consulting Agreement above") and a Continue button, disabled until checked. No name/email/company fields in this phase; nothing stores them, and Mercury already has the customer's details on the invoice. Matches existing site design system. Client-side only: on continue, decode the `inv` param, verify its host is `mercury.com`/`app.mercury.com` (prevents open-redirect abuse), redirect. If the param is absent or invalid, show "Check your inbox for the invoice link" instead.
- **Permanent agreement URL** (`app/agreement/2026-07-23/page.tsx` or similar): each agreement version is dated (YYYY-MM-DD) and gets its own immutable route rendering its markdown file. New versions get new date routes; old routes never change or 404. `/work-together/start` always renders the current version.
- **Follow-up email template** update: the "standard agreement and invoice link" placeholder becomes the single `/work-together/start?inv=...` link.

Design choice: encode the invoice URL in the query param rather than storing a lookup code; with no backend, the param keeps the whole flow stateless. Base64url keeps the email link tidy.

### Phase 2: Acceptance records, emails, and invoice automation (when the flow is making money)

Trigger: recurring paid engagements justify Mercury Plus and email infrastructure.

- **Form + API route**: add name, email, company fields; new `app/api/accept/route.ts` validates input, records acceptance, sends emails, returns the redirect target.
- **Acceptance email** (sign up for Resend): subject "Consulting Agreement accepted — [Company]"; body contains acceptance details (name, email, company, timestamp UTC, agreement version + content hash, IP) and a link to the agreement's permanent versioned URL. No attachments (spam risk) and no inlined agreement text; the hash plus the immutable URL is the proof of what was accepted. Sent to client + Will; consider bcc to a dedicated archive address.
- **Invoice automation**: upgrade to Mercury Plus, add `MERCURY_API_KEY`; the API route creates the customer (if new) and an invoice via the Mercury invoice API on submit (rate passed per-engagement, defaulting to the standard weekly rate), then redirects to the returned payment URL. The `inv` query param and manual pre-creation step are removed; the follow-up email links to the bare `/work-together/start`.
- **Persistence** (Vercel Postgres or Neon): acceptance records: id, name, email, company, agreement version + hash, IP, timestamp, Mercury invoice id/status. Email record remains as backup.
- Optional: Mercury webhook or a polling check to mark invoices paid and notify Will, closing the loop from acceptance to payment without inbox-watching.

## Files Changed Summary

| File | Change |
|------|--------|
| `content/agreement-2026-07-23.md` | New: versioned agreement text |
| `app/work-together/start/page.tsx` | New: agreement + checkbox + redirect (P2: full form) |
| P2: `app/api/accept/route.ts` | Validate, persist record, email via Resend, create Mercury invoice, return redirect |
| `lib/agreement.ts` | New: load agreement (P2: compute version hash) |
| P2: Email template (react-email or inline) | Acceptance record email |
| `app/agreement/2026-07-23/page.tsx` | New: permanent immutable route for the dated agreement version |
| `/work-together` page | Add CTA/link pointing standard-engagement prospects to the flow |
| P2: `lib/mercury.ts`, DB schema/migration | Invoice API client, acceptance records table |

## Testing

- Continue blocked until the checkbox is checked.
- Redirect safety: `inv` param pointing at a non-Mercury host is rejected and falls back to the "check your inbox" message.
- Missing `inv` param: page still renders the agreement with the inbox message, no redirect error.
- Permanent agreement route renders and matches the current version on `/work-together/start`.
- P2: form validation server-side; acceptance email received by both parties with version + hash matching the rendered agreement, timestamp and IP present.
- Mobile rendering of the agreement page (historic weak point for the site).
- P2: invoice created with correct amount/customer; duplicate submit doesn't create duplicate invoices (idempotency key on customer + engagement week).

## Decisions Made

- Entity: Upscale Level LLC (Florida). Governing law: Florida.
- No attachments on the acceptance email (spam risk). Record = acceptance details + content hash + link to the immutable versioned agreement URL.
