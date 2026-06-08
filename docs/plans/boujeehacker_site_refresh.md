# Refactor: boujeehacker.com — Tailwind-based Design System + Doorway Homepage + Credibility /about

**Tracking:** N/A (personal site, Next.js 16 App Router SSG, repo: github.com/williscool/boujeehacker.com)

## Background

The current site collapses doorway and résumé onto one bolded, monument-style homepage; the lede buries a strong positioning line that already exists in the ICP. Styling is hand-rolled SCSS partials (`src/styles/*.scss`) imported from `app/globals.scss`, with tokens in `src/styles/variables.scss`. That gives us a palette and spacing constants but no real component system — every page is a one-off layout against per-page SCSS (`home.scss`, `about-page.scss`, …) and the SCSS files have drifted from the markup.

Stack snapshot worth pinning before we plan:

| Concern | Current state |
|---------|---------------|
| Framework | Next.js 16 App Router, `output: "export"` (full SSG), Turbopack |
| Routing | `app/(site)/` route group with `page.tsx`, `about/`, `work-together/`, `contact/`, `pastMeetups/`, `not-found.tsx` |
| Shared components | `app/_components/` — `Navbar`, `Footer`, `CustomLink`, `MarkdownLinkInBlank`, `Content`, `MeetupBlock`, `RedirectShell` |
| Content | Sveltia CMS; markdown in `src/content/{home,about,work-together,navbar,footer,…}/index.md`, read via `lib/content.ts` |
| Styling | SCSS partials in `src/styles/`, imported from `app/globals.scss`. Tokens: `variables.scss` (palette, spacing, navbar/footer heights) |
| Analytics | Segment + PostHog + Rudderstack + Leadsy in `(site)/layout.tsx` — must stay working |

The key distinction from sites we compared against (Larson et al.): those are intentionally sparse because their authors deliver backend systems and org leadership — the site just needs to surface writing and get out of the way. Will is full-stack and cares about presentation, so the site has a second job those don't: **be visible proof of design + frontend craft.** That's the Brian Lovin model. So "clean, well-thought-out presentation" is a deliverable here, not decoration — *considered and restrained*, not busy.

On writing: the Substack blog (linked as "articles") hasn't been active recently, so a prominent dated feed would *hurt* the "is this alive" signal. It stays a quiet nav item. Freshness comes from a "Now" line plus the refresh itself signaling a recently-tended site. A spotlighted homepage feed is deferred to Future Enhancements.

## Goal

Rebuild boujeehacker.com around two ideas: (1) a deliberate, clean **design system** built on Tailwind v4 with `@theme` tokens — because the site is a work sample, not just a container — and (2) a Larson-style structural split into a lean **doorway homepage** and a fuller **`/about`**. The homepage's single primary CTA targets the consulting customer (Vibe Code Rescue & Scale). The Sveltia CMS content shape is restructured to match the new IA so editing through `/admin` stays first-class. Optimize for *credibility + craft*: "is this person real, is the site cared-for, can they obviously build."

## Non-Goals

- **Migrating off Next.js App Router / SSG** — `output: "export"` stays; no SSR, no server actions, no DB. Netlify deploy continues unchanged.
- **Replacing Sveltia CMS** — admin route, decap-style markdown collections, and the `lib/content.ts` reader all stay; only the collection schemas change.
- **Touching analytics** — the Segment/PostHog/Rudderstack/Leadsy snippets in `(site)/layout.tsx` stay verbatim. Refactoring them is its own project.
- **Re-theming `/admin`** — Sveltia's editor UI is not part of the design system.
- **Spotlighted writing feed on homepage** — explicitly deferred (see Future Enhancements). No RSS pull, no dated list.
- **Light/dark theme switcher** — out for v1. The `@theme` token setup leaves the door open cheaply (see Future Enhancements).
- **`/contact`** — rebuilt against the new design system in Phase 4 but not redesigned or restructured. Same content, same route, new tokens.
- **Preserving the existing palette** — the current `$sambucus` navy + `$golden-apricot` gold + `$greenway` came with the starter template; treat as throwaway. A new palette is picked in Phase 1.
- **Animated/scroll-driven motion** — minimal hover transitions only. No GSAP, no scroll libraries.
- **New copy for `/about` and `/work-together` beyond what the IA requires** — restructure and reframe per the plan; full content rewrites are a separate pass the user owns.

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Styling system | **Rip-and-replace SCSS with Tailwind v4** | Cleanest end state; aligns with the design-system reset the plan already requires; avoids carrying two systems |
| Token strategy | **Tailwind v4 `@theme` CSS-first tokens**; spacing/sizing port from `variables.scss`, **palette is new** (designed in Phase 1) | First-class design tokens via CSS vars; sets up future light/dark switcher cheaply; no JS config drift. Current palette came with the starter template — no equity to preserve. |
| Palette | **Pick during Phase 1**, no constraint locked now | The design decision is best made staring at type + layout, not in advance. Avoids over-specifying in the plan. |
| Past-meetups subsystem | **Delete entirely** in a dedicated cleanup phase | `/pastMeetups`, `MeetupBlock`, `src/content/{meetups,pastMeetups}/`, related SCSS, related CMS collections, and `meetup`-shaped types are all starter-template cruft never linked anywhere. Removing them shrinks the surface every later phase has to think about. |
| CMS schema | **Restructure to match new IA** (identityLine, nowLine, selectedWork[], primaryCTA) | New homepage has different shape than old; editing through `/admin` only stays useful if fields match the UI |
| Homepage CTA | **One primary "Work with me" → `/work-together`** | Today four equal-weight CTAs compete; customer-first hierarchy is the whole point of Phase 3 |
| `/about` content | **Migrate existing credibility material from old homepage** | Don't lose the LinkedIn/OpenSea/BCGX/cnf-testsuite arc; it just belongs on `/about`, not the doorway |
| Articles link | **Nav item only, no homepage spotlight** | Substack cadence is currently quiet; a feed would signal staleness |
| Component primitives | **Real components in `app/_components/`**: `WorkCard`, `CTAButton`, `IdentityLine`, `NowLine`, plus refactored `Navbar`/`Footer` | New IA needs them; existing shared-component pattern already in place |
| Rollout | **Phased on a single branch** (`feat/site_refresh`), not behind a flag | Personal site, SSG, no users mid-flow to protect |

## Current Architecture

Worth surfacing so the plan's phases land on real seams.

**Route layout** (`app/`):

```
app/
  layout.tsx                  # bare html/body shell
  globals.scss                # @imports every SCSS partial — DIES in Phase 0
  admin/                      # Sveltia CMS, untouched
  _components/                # Navbar, Footer, CustomLink, etc.
  (site)/
    layout.tsx                # analytics scripts + Navbar + main + Footer
    page.tsx                  # homepage (current monument)
    about/page.tsx
    work-together/page.tsx
    contact/page.tsx
    pastMeetups/page.tsx       # cruft from starter template — deleted in Phase 0
    not-found.tsx
```

**Content pipeline:** `lib/content.ts` reads `src/content/{collection}/index.md` (frontmatter + body) and returns typed objects (`lib/content-types.ts`). Pages call `getHomePage()`, `getLayoutData()`, etc., at build time. **The Sveltia admin config that defines the collection fields is a separate file** — confirm its location and shape before Phase 2 (likely `public/admin/config.yml` or similar Sveltia convention).

**Key insight that unlocks the approach:** the design-system reset and the IA restructure both want to throw away the same code (`src/styles/*.scss`, the current `page.tsx`, the current `src/content/home/index.md` schema). So rip-and-replace styling + schema restructure + page rewrite can happen as one coherent pass per page, rather than three serial migrations.

## Design Decisions

### Tailwind v4 with `@theme`, not v3 + `tailwind.config.js`

v4 is current as of 2025+. Config moves into CSS via `@theme { --color-…: …; }`, which means design tokens are real CSS custom properties — themeable at runtime, no JS-to-CSS bridge. The existing `variables.scss` palette (`$golden-apricot`, `$greenway`, etc.) ports directly. Drawback: smaller ecosystem of v3-era plugins still assumes JS config; we're not using plugins, so it doesn't bite us.

### Considered vs. sparse

Lean considered, not sparse, because the site is craft evidence. The bar is "restraint that reads as taste," not maximalism — clean beats clever. Concretely:
- **Type:** a deliberate pairing — a characterful display face for name/headings + a highly readable text face. A confident headline does a lot of the "this person has taste" work.
- **Color:** restrained palette with one accent. Brand equity in "boujeehacker" — pick an accent that carries it without going loud. Existing `$golden-apricot` is a strong starting point.
- **Spacing & rhythm:** spacing scale and a constrained reading measure (~60–75ch) so prose doesn't sprawl.
- **Motion:** subtle hover transitions only. Anything gimmicky is a regression.

### Mobile-first

The current site renders poorly narrow; mobile is where most first impressions land. Every component built in Phase 1 must look right at 375px *before* being checked at desktop. This is a tooling constraint, not a polish step.

### One CTA, demoted social row

The current homepage has four equal-weight CTAs (LinkedIn, GitHub, Twitter, sometimes "brainstorm"). The doorway gets exactly one primary button → `/work-together`. Social links demote to a small secondary row (icon + label, muted color). This is the single biggest hierarchy change and it has to survive every later phase.

### CMS schema restructure

New homepage frontmatter:

```yaml
identityLine: "I'm William Harris — I build software real users depend on, from 100M-user systems at [LinkedIn](...) to early [OpenSea](...)"
nowLine: "Building RecoverMoney on Whop; advising founders scaling vibe-coded apps."
selectedWork:
  - title: "cnf-testsuite"
    outcome: "CNCF project, 175+ stars, conference talk"
    url: "..."
  - title: "BCGX Snowflake pipeline"
    outcome: "10M datapoints/day, $10–20M/yr customer savings"
    url: "..."
  # 3–5 total
primaryCTA:
  heading: "Work with me"
  subHeading: "Fix and scale your vibe-coded app"
  url: "/work-together"
socialLinks:
  - { label: "LinkedIn", url: "...", icon: "linkedin" }
  - { label: "GitHub", url: "...", icon: "github" }
  - { label: "Email", url: "mailto:..." }
seo: { browserTitle: …, description: …, keywords: …, title: … }   # unchanged
```

Sveltia admin config (`config.yml` for the `home` collection) updates to match. Old fields (`title`, `homeMainContent`, `callToActions.{first,second}CTA`, `headerImage`) are removed. `lib/content-types.ts` updates with the new types.

## Implementation Plan

### Milestone A — Foundation

#### Phase 0: Delete past-meetups cruft

Carve out the dead subsystem before doing anything else so later phases stop tripping over it. Confirmed dead by grep — nothing in the new IA references any of it.

- Delete `app/(site)/pastMeetups/` (route + page).
- Delete `app/_components/MeetupBlock.tsx`.
- Delete `src/content/meetups/` (5 files) and `src/content/pastMeetups/index.md`.
- Delete `src/styles/meetup.scss` and `src/styles/past-meetups-page.scss` (these die again in Phase 1 with everything else, but removing them now keeps `globals.scss` honest while we still have it).
- Remove the `meetups` and `pastMeetups` collections from `public/admin/config.yml` (the Sveltia admin config, location now confirmed).
- Remove meetup-related types from `lib/content-types.ts` and reader functions from `lib/content.ts`.
- Remove any meetup imports/references from `app/(site)/page.tsx` and `app/globals.scss`.
- Grep verifies clean: `grep -rli "meetup" app/ src/ lib/ public/` returns nothing.

**Verification:** `pnpm typecheck` and `pnpm build` stay green. No new visual changes — the site looks identical, it just has less code.

#### Phase 1: Install Tailwind v4, set up tokens, delete SCSS

**1a.** Install `tailwindcss@^4` and its Next.js/PostCSS plumbing (`@tailwindcss/postcss`). Add `postcss.config.mjs`. Remove `sass` from `package.json`.

**1b.** Replace `app/globals.scss` with `app/globals.css` containing `@import "tailwindcss";` and an `@theme` block. **Port** the structural tokens from `variables.scss` (spacing scale, container width, transition duration). **Do not port** the palette — leave `--color-*` slots stubbed with neutral placeholders (e.g. plain black/white/gray) so the build works; the real palette is designed in Phase 2 alongside the type pairing. Pick fonts here (display + text via `next/font` in `app/layout.tsx`); register as `--font-display`, `--font-sans`.

**1c.** Delete all of `src/styles/*.scss` and the imports in `app/globals.scss`. Confirm the build fails *only* on missing classes from the now-deleted styles (this proves nothing else depends on the SCSS files).

**1d.** Add Tailwind class to `app/layout.tsx` body for base text/bg color from the placeholder tokens, so unstyled pages aren't blinding while we rebuild.

**Verification:** `pnpm build` succeeds with `output: "export"` after we stub broken pages with `<div>placeholder</div>`. Tokens visible as CSS vars in DevTools.

#### Phase 2: Design system — palette, type, and primitives

This is where the design actually happens. Treat in three substeps so the visual decisions are explicit, not buried inside component work.

**2a — Palette.** Design a new restrained palette with one accent. The current navy/gold/green was inherited from the starter template and carries no brand equity worth preserving. Goal: considered minimalism — clean beats clever. Define as CSS custom properties in the `@theme` block in `globals.css` (overwriting the Phase 1 placeholders): background, surface, body text, muted text, link, accent, focus. Keep the palette small enough to fit in your head; resist adding "just one more" shade.

**2b — Type.** Confirm/adjust the font pairing started in Phase 1 (display + text). Define the full type scale as `--text-*` tokens. The headline treatment does a lot of the "this person has taste" work — invest here.

**2c — Primitives.** Build the reusable pieces under `app/_components/`. Each is mobile-first, uses tokens (no hex literals in JSX), and gets visually checked at 375px first, then desktop.

- **`Container`** — max-width wrapper with consistent horizontal padding.
- **`Prose`** — typography container with ~65ch measure for markdown content (`/about`, `/work-together`).
- **`Navbar`** (refactor existing) — name as logo link to `/about`; links: `articles` (→ Substack), `about`, `work-together`. Mobile menu pattern.
- **`Footer`** (refactor existing) — minimal: name, year, small social row, articles link.
- **`CTAButton`** — single visual treatment, used exactly once per page as the primary action.
- **`SocialLinkRow`** — small, muted; not a CTA.
- **`WorkCard`** — title + one-line outcome + link arrow; scannable.
- **`IdentityLine`** — renders markdown with inline links, no bold.
- **`NowLine`** — small label + one-line current status.

Each primitive lives in its own file. Type props strictly; no `any`.

**Verification:** a throwaway `/app/(site)/_preview/page.tsx` (gitignored or deleted before merge) renders one of each primitive on a single page, mobile-first, looks composed not slapped together.

#### Milestone A Checkpoint

Design system exists. Tokens are real CSS vars. SCSS is gone. Build is green with stubbed pages. **Stop and review the visual primitives with the user before continuing** — every later phase compounds on these.

### Milestone B — Content restructure

#### Phase 3: CMS schema + content migration

**3a.** Update Sveltia admin config (`public/admin/config.yml`, confirmed in Phase 0) for the `home` collection to match the new schema in Design Decisions above. Keep `about`, `work-together`, `navbar`, `footer` collections intact for now (they'll be touched in 3c–3e).

**3b.** Update `lib/content-types.ts` and `lib/content.ts` (`getHomePage`) to read the new fields. Migrate `src/content/home/index.md` frontmatter — port the strongest content from the old homepage prose into `selectedWork[]` entries (cnf-testsuite, BCGX pipeline, OpenSea social integrations are the leading candidates), write the new `identityLine` and `nowLine`.

**3c.** Migrate the rest of the old homepage credibility material into `src/content/about/index.md` — full career arc (LinkedIn / OpenSea / BCGX), BCGX "hire a top FAANG team" framing, cnf-testsuite/CNCF + Crystal talk, self-taught/Georgia Tech story, mentoring, multi-hat narrative. Repeats a one-line identity at the top, Larson-style.

**3d.** Update `src/content/work-together/index.md` to lead benefit-first with the ICP line ("I rescue profitable AI-built apps from the last-20% death spiral") rather than process-first. This is the one page where founder-voice (benefit-first) is correct.

**3e.** Update `src/content/navbar/index.md` to include the `articles` link → Substack.

**Verification:** `/admin` loads, the home collection editor shows the new fields, content saves and re-reads through `lib/content.ts` correctly.

### Milestone C — New IA pages

#### Phase 4: Doorway homepage

Rewrite `app/(site)/page.tsx` to render the new schema using Phase 2 primitives:

1. `<IdentityLine>` — single line, proof nouns linked inline, no bold.
2. Selected Work — grid/list of `<WorkCard>` (3–5), outcome-first.
3. `<NowLine>` — "currently…" one-liner.
4. `<CTAButton>` — the single primary action → `/work-together`.
5. `<SocialLinkRow>` — small, below the CTA.

No `headerImage`. No `homeMainContent` blob. No `firstCTA`/`secondCTA`. The page is short by design.

**Verification:** the 5-second test — an unfamiliar viewer can state (a) who you are and (b) what to do next, and the primary CTA they notice is the consulting one.

#### Phase 5: `/about`, `/work-together`, and the long tail

**5a.** Rewrite `app/(site)/about/page.tsx` to render the migrated `/about` content through `<Prose>`, with `<IdentityLine>` at top.

**5b.** Rewrite `app/(site)/work-together/page.tsx` benefit-first per Phase 3d.

**5c.** Rebuild `app/(site)/contact/page.tsx`, `not-found.tsx`, and `RedirectShell`/`Content` components against Tailwind tokens. Same content and IA — just new styling. (`pastMeetups` and `MeetupBlock` were already deleted in Phase 0.)

**5d.** De-bold pass across every page: remove ~90% of bold; inline links and type scale carry emphasis.

#### Milestone C Checkpoint

All routes render against Tailwind. Old SCSS is gone for good. Homepage is a doorway. **Run the testing plan in full before merging.**

### Phase 6: Polish + ship

- Mobile QA at 375px and 414px for every route. Mobile is the weak point we're explicitly fixing.
- Link integrity: LinkedIn, GitHub, OpenSea, CNCF, articles→Substack, email, `/about`, `/work-together`.
- Lighthouse pass on the homepage (perf and a11y, not SEO — SSG handles SEO fine).
- Confirm analytics still fire (Segment/PostHog/Rudderstack/Leadsy snippets unchanged; verify in browser console with debug=true already set).
- `pnpm typecheck` and `pnpm build` clean.

## Files to Modify/Create

### New Files

| File | Purpose |
|------|---------|
| `app/globals.css` | Replaces `globals.scss`; `@import "tailwindcss"` + `@theme` tokens |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin |
| `app/_components/Container.tsx` | Layout wrapper primitive |
| `app/_components/Prose.tsx` | Typography container for markdown |
| `app/_components/CTAButton.tsx` | Single primary-CTA treatment |
| `app/_components/SocialLinkRow.tsx` | Demoted social links |
| `app/_components/WorkCard.tsx` | Selected Work card |
| `app/_components/IdentityLine.tsx` | Homepage/about identity line with inline links |
| `app/_components/NowLine.tsx` | "Now / currently" status line |

### Modified Files

| File | Changes |
|------|---------|
| `package.json` | Remove `sass`; add `tailwindcss@^4`, `@tailwindcss/postcss` |
| `app/layout.tsx` | Register fonts via `next/font`; set body base classes |
| `app/globals.scss` | **Deleted** (replaced by `globals.css`) |
| `src/styles/*.scss` | **All deleted** |
| `app/(site)/page.tsx` | Rewritten as doorway against Phase 1 primitives + new schema |
| `app/(site)/about/page.tsx` | Renders migrated credibility content via `<Prose>` |
| `app/(site)/work-together/page.tsx` | Benefit-first reframe |
| `app/(site)/contact/page.tsx` | Re-styled, same content |
| `app/(site)/not-found.tsx` | Re-styled, same content |
| `app/(site)/layout.tsx` | Minor — only if Navbar/Footer prop shapes change. Analytics scripts unchanged. |
| `app/_components/Navbar.tsx` | Refactor to new design; add `articles` link |
| `app/_components/Footer.tsx` | Refactor to minimal footer |
| `lib/content.ts` | `getHomePage` reads new schema |
| `lib/content-types.ts` | Types for new home schema |
| `src/content/home/index.md` | New frontmatter (identityLine, nowLine, selectedWork[], primaryCTA, socialLinks) |
| `src/content/about/index.md` | Adds migrated career arc content |
| `src/content/work-together/index.md` | Benefit-first rewrite per Phase 2d |
| `src/content/navbar/index.md` | Add `articles` link |
| `public/admin/config.yml` | Schema update for `home` collection; remove `meetups` and `pastMeetups` collections |

### Deleted Files (Phase 0 cruft removal)

| File / Directory | Why |
|------------------|-----|
| `app/(site)/pastMeetups/page.tsx` | Starter-template route, never linked |
| `app/_components/MeetupBlock.tsx` | Only used by deleted meetup pages |
| `src/content/meetups/*.md` (5 files) | Stale 2018 meetup content from template |
| `src/content/pastMeetups/index.md` | Stale page content from template |
| `src/styles/meetup.scss` | Style for deleted component |
| `src/styles/past-meetups-page.scss` | Style for deleted page |
| Meetup-related types in `lib/content-types.ts` | No remaining consumers |
| Meetup-related readers in `lib/content.ts` | No remaining consumers |

## Testing Plan

No automated test suite exists; testing here is build, typecheck, and structured manual QA. That's appropriate for a SSG personal site — over-testing would be ceremony.

### Build + type safety

- `pnpm typecheck` clean after every phase that touches `lib/` or component props.
- `pnpm build` produces `out/` successfully with `output: "export"`. No `globals.scss` references survive (`grep -r "globals.scss\|src/styles" app/ src/` returns nothing in Milestone A).
- No SCSS imports anywhere (`grep -r '\.scss' app/ src/` returns nothing).

### Visual / IA scenarios

Each scenario is a named manual check, not a script. Run them on desktop *and* mobile (375px minimum).

- **Doorway 5-second test** — fresh viewer states who you are + the next action in 5s; the CTA they identify is "Work with me."
- **Mobile layout** — every route renders cleanly at 375px and 414px. No horizontal scroll. CTA is tappable (≥44px target).
- **Design-system consistency** — type scale, spacing, single accent applied uniformly; no orphan inline styles, no hex literals in JSX outside `globals.css`.
- **De-bold sanity** — no section has more than one emphasized phrase. `grep -r 'font-bold\|<strong>\|\*\*' src/content/ app/` to audit.
- **Freshness check** — `nowLine` reads as genuinely current; nothing implies a stale blog (no dated feed surfaced).
- **Hierarchy check** — homepage has exactly one button-styled CTA; social links are visibly demoted.

### Edge cases / error handling

- **CMS missing fields** — if `src/content/home/index.md` lacks a new field, the page should fail the build (typed `getHomePage()` enforces this). Confirm by temporarily removing a field and seeing the build error.
- **Empty `selectedWork[]`** — render the section as absent, not as an empty grid with borders.
- **Long `nowLine`** — wraps gracefully without breaking the doorway layout.
- **Long markdown link text in `identityLine`** — doesn't break the single-line aesthetic on mobile (allowed to wrap, but should look composed).

### Link integrity (all must resolve)

LinkedIn, GitHub, OpenSea, CNCF / cnf-testsuite, articles → Substack, email, `/about`, `/work-together`, name → `/about`.

### Analytics sanity

Open homepage with DevTools console. Confirm Segment, PostHog (debug=true is on), Rudderstack, and Leadsy initialize without errors. We changed zero analytics code; this just guards against a regression from layout reshuffling.

## Future Enhancements

1. **Spotlighted writing feed on homepage** — dated, reverse-chronological list (Larson-style), sourced via build-time Substack RSS in Next.js. Switch on only when there's consistent cadence; until then, a feed signals staleness.
2. **Light/dark theme switcher** — `@theme` tokens make this cheap: define a `[data-theme="dark"]` block in `globals.css` overriding the same CSS vars, add a toggle. Genuine full-stack flex, on-brand for a craft site, but scope for v2.
3. **Per-project case-study pages** — `WorkCard` links to deep pages (e.g. `/work/cnf-testsuite`) with the full story, screenshots, links. Currently links go to external sources directly.
4. **`/now` page** — the `nowLine` graduates to a full Sivers-style `/now` page when there's enough to say.

## Notes

- **Personal site, single user, single branch:** no feature flag, no migration window, no compat shim. Just rewrite.
- **Sveltia CMS is a strict constraint:** every content change must round-trip through `/admin` cleanly. Don't introduce content that only lives in JSX — that breaks the user's editing workflow.
- **Analytics snippets are load-bearing:** PostHog's debug mode is on (`debug: true` in `(site)/layout.tsx`). Don't refactor those in this project; it's a separate cleanup.
- **`frontend-design` skill** should be consulted at Phase 1 implementation time for token/styling guidance.

## Related Work

- Original plan version (this file at commit `32fddeb`) — captured the IA and design intent; this revision adds the Tailwind migration and binds the plan to the actual Next.js 16 / Sveltia / SCSS architecture.
- `lethain.com` (Larson) — structural reference for doorway homepage.
- `brianlovin.com` — reference for "site as portfolio piece" treatment.
