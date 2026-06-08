# Refactor: boujeehacker.com — Considered Design System + Doorway Homepage + Credibility /about

**Tracking:** N/A (personal site, Next.js SSG, repo: github.com/williscool/boujeehacker.com)

## Overview

Rebuild boujeehacker.com around two ideas: (1) a deliberate, clean **design system** — because as a full-stack engineer the site itself is a work sample, not just a container — and (2) a Larson-style structural split into a lean **doorway homepage** and a fuller **`/about`**. The homepage's primary call-to-action targets the consulting customer (Vibe Code Rescue & Scale); `/about` serves as the bio for anyone who wants the full arc. Writing stays on Substack and remains accessible via the "articles" nav link, but is **not** spotlighted on the homepage for now (the blog isn't currently active — see Background). Optimize for *credibility + craft*: "is this person real, is the site cared-for, and can they obviously build."

## Background

The current site collapses doorway and résumé onto one bolded, monument-style page; the lede buries a strong positioning line that already exists in the ICP.

The key distinction from the sites we compared against (Larson et al.): those are intentionally sparse because their authors deliver backend systems and organizational leadership — the site just needs to surface writing and get out of the way. Will is full-stack and cares about presentation, so the site has a second job those don't: **be visible proof of design + frontend craft.** That's the Brian Lovin model, where the site is itself a portfolio piece. So "clean, well-thought-out presentation" is a deliverable here, not decoration — and it should read as *considered and restrained*, not busy.

On writing: the blog (Substack, linked as "articles" — the name covers both evergreen and timely pieces) hasn't been active recently, so a prominent dated feed would *hurt* the "is this alive" signal rather than help it. It stays a quiet nav item. Freshness is instead carried by a "Now" line and by the design refresh itself signaling a recently-tended site. A spotlighted homepage feed is deferred to Future Enhancements, to switch on once cadence returns.

Stack is Next.js SSG, so the design system lives in real components/tokens. The `frontend-design` skill should be consulted at build time for the design tokens and styling constraints.

## Plan

### Phase 1: Design system foundation

Establish the visual system first — everything else renders into it. Goal is *considered minimalism*: distinctive enough to signal craft, restrained enough to stay clean. Consult the `frontend-design` skill when implementing.

- **Type system**: a deliberate pairing (e.g. a characterful display face for name/headings + a highly readable text face), with a defined type scale. A confident headline treatment does a lot of the "this person has taste" work.
- **Color**: a restrained palette with one accent. There's existing brand equity in "boujeehacker" — pick an accent that carries it without going loud.
- **Spacing & rhythm**: a spacing scale and a constrained reading measure (~60–75 chars) so prose and lists feel composed rather than full-width sprawl.
- **Component primitives**: nav (including the "articles" link), footer, link style, the Selected Work card, and the primary CTA button. These are the reusable pieces Phases 2–3 assemble.
- **Responsive / mobile-first**: build mobile-first; the current site renders poorly narrow, and mobile is where most first impressions land.
- **Motion**: minimal and tasteful (subtle hover/scroll transitions at most). Explicitly avoid anything gimmicky.

Design choice — *considered vs. sparse*: lean considered, not sparse, because the site is craft evidence. But the bar is "restraint that reads as taste," not maximalism — clean beats clever.

### Phase 2: Split into doorway homepage + /about

Bucket existing content into the new structure, rendered with the Phase 1 system.

- **New `/about` page** holds the credibility material currently on the homepage: full career arc (LinkedIn / OpenSea / BCGX), the BCGX "hire a top FAANG team" framing, cnf-testsuite/CNCF + Crystal talk, the self-taught/Georgia Tech "about the biz" story, mentoring, and the multi-hat (sold/marketed/wrote) narrative. Repeats a one-line identity at the top, Larson-style.
- **Homepage becomes a doorway**: (1) a single identity line owning the niche with proof nouns linked inline — e.g. "I'm William Harris — I build software real users depend on, from 100M-user systems at LinkedIn to early OpenSea" — no bold; (2) Selected Work; (3) a "Now / currently" line (below); (4) primary CTA (Phase 3). No spotlighted writing feed for now.
- **Name links to `/about`**; **"articles" stays in the nav** pointing to Substack.
- **"Now / currently" one-liner**: the primary freshness signal in the absence of a feed — e.g. "Building RecoverMoney on Whop; advising founders scaling vibe-coded apps." Keep it genuinely current; this line is now doing the work the feed would have. Aimed at the customer, not the FDE track.
- **Selected Work block**: 3–5 projects pulled out of prose into scannable cards, outcome-first, one line + link. Strongest candidates: CalendarNotification (80k+ downloads, press in 7+ countries), cnf-testsuite (CNCF, 175+ stars, conference talk), the BCGX Snowflake pipeline (10M datapoints/day, $10–20M/yr customer savings), OpenSea social integrations. These cards also show layout craft.
- **De-bold pass** across both pages: remove ~90% of bold; inline links and the type system carry emphasis.

### Phase 3: CTA hierarchy (customer-first) + /work-together + polish

Make the consulting customer the primary action; demote everything else.

- **Primary CTA = the consulting customer**: a single prominent "Work with me" / "Fix my app" button → `/work-together`, styled as the one clear button in the design system. LinkedIn / GitHub / email / "brainstorm" demote to a small secondary link row. (Today these four compete equally.)
- **Reframe `/work-together`** as a benefit-led page leading with the ICP line ("I rescue profitable AI-built apps from the last-20% death spiral") rather than process-first. This is the one page where founder-voice (benefit-first) is correct.
- **Final polish**: consistent application of the design system, mobile QA, footer/link integrity (including the "articles" nav link).

## Files Changed Summary

| File | Change |
|------|--------|
| `styles/` + theme/token config (e.g. tailwind config or CSS vars) | New design system: type scale, palette, spacing, component primitives |
| Shared components (`components/Nav`, `Footer`, `WorkCard`, `CTAButton`) | New reusable primitives; Nav retains "articles" → Substack |
| Homepage (`pages/index` / `app/page`) | Reduce to doorway: identity line, Selected Work, Now line, primary CTA |
| New `/about` (`pages/about` / `app/about/page`) | Full credibility arc migrated from old homepage |
| `/work-together` | Reframe benefit-first with the ICP positioning line |

## Testing

- **Visual QA on desktop + mobile**: every page renders cleanly; verify mobile specifically (current weak point).
- **Design-system consistency**: type scale, spacing, and the single accent are applied uniformly; no orphan styles.
- **5-second test**: an unfamiliar viewer can state (a) who you are and (b) what to do next within 5 seconds, and the primary CTA they notice is the consulting one.
- **Freshness check**: the "Now" line reads as genuinely current; no element implies a stale blog (no dated feed surfaced).
- **Link integrity**: all links resolve (LinkedIn, GitHub, OpenSea, CNCF, articles→Substack, email, /about, /work-together).
- **De-bold sanity**: no section has more than one emphasized phrase.

## Open Questions

1. **Light/dark theme switcher?** A tasteful toggle is a nice full-stack flex and on-brand for a craft-forward site, but it's scope. Defaulting to out-of-scope for v1 unless it's cheap with the chosen styling approach.

## Future Enhancements (deferred, not v1)

- **Spotlighted writing feed on the homepage** once the blog is active again — a dated, reverse-chronological list (Larson-style), sourced via build-time Substack RSS in Next.js. Switch on only when there's a consistent cadence to show; until then a feed would signal staleness.
