# Feature: Migrate boujeehacker.com from Gatsby to Next.js SSG (TypeScript)

**Tracking:** N/A

## Background

The site is currently a Gatsby v5 SPA-style static site:

- **Build:** `gatsby build` → `public/`, deployed via Netlify (`netlify.toml`).
- **Content:** Markdown files under `src/pages/**/*.md` sourced by `gatsby-source-filesystem` and transformed by `gatsby-transformer-remark`. Page generation is driven by `gatsby-node.js` reading `frontmatter.templateKey` and routing each markdown node to a React template.
- **Templates:** `src/templates/{about-page,past-meetups-page,meetup,redirect}.js` plus `src/pages/{index,404}.js`. All written in JS with `prop-types`, `graphql` page queries, and `Layout` providing `LayoutFragment` shared data (footer + navbar markdown).
- **Styling:** SCSS via `gatsby-plugin-sass`, partials under `src/styles/`, imported directly from components.
- **CMS:** Decap CMS (`decap-cms-app`) is bundled into the app via `gatsby-plugin-decap-cms` with `manualInit: true` and registers six preview templates from `src/cms/preview-templates/`. CMS config lives at `static/admin/config.yml` (root: `/admin/`).
- **Analytics / third-party scripts:** Segment, PostHog, RudderStack, and Leadsy injected via Gatsby `<Script>` in `Layout.js` using `GATSBY_*` env vars. Also `gatsby-plugin-google-analytics` (UA-450199-43).
- **Markdown rendering:** mixed — `react-commonmark` for inline/string-frontmatter fields, and HTML produced by `gatsby-transformer-remark` for the long body (`page.html`), rendered through `components/Content.js` (`dangerouslyInnerHTML`).

Node pinned at v20 (`.node-version`), package manager is `yarn` (per `netlify.toml`).

### Existing routes (post-build)

| Route | Source markdown | Template |
|-------|-----------------|----------|
| `/` | `src/pages/home/index.md` (`templateKey: home-page`) + meetups list (next upcoming) | `src/pages/index.js` |
| `/about/` | `src/pages/about/index.md` | `src/templates/about-page.js` |
| `/pastMeetups/` (slug from filesystem) | `src/pages/pastMeetups/index.md` | `src/templates/past-meetups-page.js` |
| `/contact/`, `/work-together/` | `src/pages/{contact,work-together}/index.md` | `src/templates/redirect.js` |
| `/404` | n/a | `src/pages/404.js` |
| Meetup nodes (filtered, NOT individual pages) | `src/pages/meetups/*.md` | rendered inline by `past-meetups-page` and `index` |
| `/admin/` | `static/admin/` | Decap CMS SPA |

`navbar` and `footer` markdown nodes are filtered out of page creation (`gatsby-node.js`) and consumed only via the shared `LayoutFragment` GraphQL fragment.

## Goal

Replace Gatsby with **Next.js (App Router) in TypeScript**, building the site as a fully **static export** (`output: 'export'`) so the same `public/`-style artifact deploys to Netlify (or any static host) with no runtime server. Preserve every existing URL, the Decap CMS workflow, analytics, and styling. Convert JS source to TypeScript with strict mode and typed content models for the markdown frontmatter, eliminating the runtime GraphQL layer in favor of typed Node-side filesystem reads at build.

## Non-Goals

- **Visual redesign** — pixel-equivalent output; no new components, no design polish, no responsive rework.
- **CMS replacement** — Decap stays. Not migrating to Sanity, Contentlayer, Notion, or any headless CMS rewrite. Only the bundler integration changes.
- **Per-meetup detail pages** — meetups remain embedded in `pastMeetups` and `index`; we do not promote them to standalone routes (matches today's behavior, where `gatsby-node.js` explicitly skips `/meetups/*`).
- **App Router server features** — no server actions, no route handlers running at request time, no ISR, no on-demand revalidation. SSG-only output. Pages render with `dynamic = 'force-static'` semantics.
- **Image optimization via `next/image`** — `next/image`'s loader is incompatible with `output: 'export'` without a custom loader, and existing markdown image paths are raw `/img/...` strings already optimized at the source. Stay with plain `<img>` for parity (revisit later).
- **Analytics overhaul** — Segment/PostHog/RudderStack/Leadsy snippets ported verbatim into a `<Script>` strategy, not refactored. `gatsby-plugin-google-analytics` is dropped (UA properties are end-of-life); replacement is out of scope.
- **Test framework introduction** — repo has no tests today (`"test": "echo \"Error: no test specified\""`). We will not bootstrap Jest/Vitest as part of this migration; verification is build + visual diff. (Listed as a Future Enhancement.)
- **Yarn → pnpm/npm switch** — keep `yarn` since `netlify.toml` pins `YARN_VERSION`. Lockfile churn is a separate concern.
- **GraphQL preservation** — the GraphQL data layer is removed entirely; pages read content directly from disk in `getStaticProps`-equivalent functions (App Router server components).
- **Renaming routes** — `/pastMeetups/` stays camelCase (matches current slug); we do not normalize to `/past-meetups/` even though it would be nicer.

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 15 App Router | Current stable, first-class TypeScript, mature static export. |
| Output mode | `output: 'export'` (SSG) | Produces a static directory deployable to Netlify with no functions; matches current deploy model. |
| Routing style | App Router (`app/`) | New code; no benefit to Pages Router legacy. |
| Language | TypeScript, `strict: true` | Stated goal of migration. |
| Content layer | Hand-rolled `lib/content.ts` using `gray-matter` + `remark`/`remark-html` | No GraphQL. Build-time filesystem reads, fully typed frontmatter. Avoids heavyweight Contentlayer dep. |
| Markdown rendering | `remark` + `remark-html` for body HTML; `react-markdown` for inline string fields | `react-commonmark` is unmaintained; `react-markdown` is the direct successor with the same surface needs. Body still uses `dangerouslySetInnerHTML` to keep build cost low. |
| Styling | Keep Sass; use Next.js built-in Sass support (`sass` dep already present) | Avoids rewriting every `.scss` import. Module CSS not adopted to minimize diff. |
| CMS bundle | Self-host Decap via static `<script>` in `app/admin/page.tsx` referencing CDN bundle, OR custom register page that imports `decap-cms-app` client-side. Choose CDN bundle path. | `gatsby-plugin-decap-cms` is Gatsby-specific. The CDN bundle is the supported path for non-Gatsby sites; preview templates are registered via a tiny client-side script (`app/admin/cms.tsx`). |
| Admin route | `app/admin/page.tsx` (static-exported, client component) | Same URL as today (`/admin/`), no server runtime needed. |
| Analytics | Verbatim port into `<Script strategy="afterInteractive">` in root layout, env vars renamed `GATSBY_*` → `NEXT_PUBLIC_*` | Behavior parity. |
| Image handling | Plain `<img>` with `unoptimized` semantics | `next/image` requires a custom loader under export. |
| 404 page | `app/not-found.tsx` | App Router convention. |
| Redirect pages (`/contact/`, `/work-together/`) | Static page that performs `<meta http-equiv="refresh">` + JS fallback | No server-side redirects under export; preserves the existing 2.5s delayed redirect UX. |
| Deploy | Keep Netlify, change `publish` from `public` to `out` | `next export` default output dir. |

## Current Architecture

### Page-template wiring (Gatsby today)

| Source MD `templateKey` | Filesystem source | Routing rule (`gatsby-node.js`) | Renders via |
|-------------------------|-------------------|---------------------------------|-------------|
| `home-page` | `src/pages/home/index.md` | Forced to `/` | `src/pages/index.js` |
| `about-page` | `src/pages/about/index.md` | Slug or `frontmatter.path` | `src/templates/about-page.js` |
| `past-meetups-page` | `src/pages/pastMeetups/index.md` | Slug | `src/templates/past-meetups-page.js` |
| `contact`, `work-together` | `src/pages/{contact,work-together}/index.md` | Slug or `frontmatter.path` | `src/templates/redirect.js` |
| `meetup` | `src/pages/meetups/*.md` | **Skipped** (no page) | Embedded by `index.js` (next upcoming) and `past-meetups-page.js` (list of past). |
| `navbar`, `footer` | `src/pages/{navbar,footer}/index.md` | **Skipped** | Consumed via `LayoutFragment` only. |

### Shared layout data

`LayoutFragment` (in `src/components/Layout.js`) provides `footerData` and `navbarData` to every page via a co-located GraphQL fragment. Under Next.js we replace this with a single `getLayoutData()` helper called from `app/layout.tsx`.

### Key insight that unlocks the approach

Every "page" in this codebase is derived from a small, finite, hand-edited set of markdown files. There is no large content collection, no taxonomy, no pagination. That means we don't need a content framework — a ~150-line `lib/content.ts` with typed readers per content type fully replaces the GraphQL data layer, and each route file can simply call its reader at build time.

## Design Decisions

### D1: App Router vs. Pages Router

**Choice:** App Router.

Pages Router would map more directly to the current "one template = one file" model, but the App Router's static-by-default rendering and colocated metadata (`generateMetadata`) cleanly replace the per-template `Head` exports we have today, and is the path forward for the framework. No piece of this site requires legacy Pages-Router-only behavior.

### D2: Replacing the GraphQL data layer

**Choice:** Hand-rolled typed content reader (`lib/content.ts`), one function per content type.

Options considered:

1. **Contentlayer** — Was the obvious "Gatsby-replacement" choice. Project is currently unmaintained / archived in 2024; not worth the dep.
2. **Keksi / next-mdx-remote / @next/mdx** — These are *MDX* tools. Our content is plain Markdown with YAML frontmatter; we don't want JSX in content.
3. **Hand-rolled with `gray-matter` + `remark`** — ~150 LOC, no runtime overhead, fully typed, fast at build.

Chosen: option 3.

Shape (illustrative):

```ts
// lib/content.ts
export type HomePage   = { frontmatter: HomeFrontmatter;   html: string };
export type AboutPage  = { frontmatter: AboutFrontmatter;  html: string };
export type MeetupNode = { frontmatter: MeetupFrontmatter; html: string };
// ...
export async function getHomePage(): Promise<HomePage> { ... }
export async function getAllMeetups(): Promise<MeetupNode[]> { ... } // sorted desc by date
export async function getLayoutData(): Promise<{ navbar: NavbarFrontmatter; footer: FooterFrontmatter }> { ... }
```

Each reader hits a single known path on disk and is called once per build, from a server component.

### D3: Decap CMS integration

**Choice:** CDN-loaded `decap-cms` bundle on `/admin/`, plus a separate small client-component module that imports `decap-cms-app` to register the six preview templates.

`gatsby-plugin-decap-cms` does two things: (a) injects the Decap CMS app into a route during build, and (b) lets you register preview templates that share React/Sass with your site code. Outside Gatsby, the canonical Decap setup is the CDN bundle:

```html
<!-- app/admin/page.tsx renders this -->
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
```

Preview templates are then registered by importing `decap-cms-app` in a `'use client'` component and calling `CMS.registerPreviewTemplate(...)`. Because the previews currently use raw SCSS imports (e.g. `import "../styles/home.scss"`), we must verify the Next.js webpack/turbopack config allows global Sass imports from client modules — it does by default for top-level `globals.scss`, but per-component global imports require the component to live under `app/` rather than be loaded as a standalone bundle. The safest path: keep preview templates as React components inside `app/admin/previews/` and import them from a single `'use client'` registrar component.

Trade-off: visual preview parity will need a manual pass — Decap previews have always been fragile, and the Sass/CSS-cascade behavior may drift slightly. Acceptable.

### D4: Markdown rendering library

**Choice:** `remark` + `remark-html` for body content (HTML produced at build time and inserted via `dangerouslySetInnerHTML`), and `react-markdown` for the few cases where frontmatter contains inline Markdown strings (e.g. `home.title`, `home.homeMainContent`).

`react-commonmark` is abandoned. `react-markdown` is the maintained successor with a similar API; the migration is mostly renaming the import and prop (`source` → `children`).

### D5: Redirect-template pages under static export

**Choice:** Static page that renders a `<meta http-equiv="refresh" content="2;url=...">` plus the existing JS `setTimeout` fallback.

We cannot use a server-side 301 in `next.config.js` `redirects: []` because under `output: 'export'` the redirects table is ignored at hosting time (it's a runtime concept). The current UX is intentionally a 2.5s delay with a goofy "computer doggo" image; we keep it.

### D6: Layout / shared chrome

**Choice:** `app/layout.tsx` is the only top-level layout, and it calls `getLayoutData()` at the top to fetch navbar/footer markdown. `Navbar` and `Footer` become typed server components consuming the result. Analytics `<Script>` tags live here.

### D7: SEO / metadata

**Choice:** Each page exports `generateMetadata()` that returns the same `title` / `description` / `keywords` fields the current `Head` exports produce.

### D8: Build artifact + deploy

**Choice:** `output: 'export'`, output dir `out/`. Update `netlify.toml`'s `publish = "public"` to `publish = "out"`. Keep the `yarn build` command.

## Implementation Plan

### Phase 0: Project bootstrap on a branch

**0a. Create Next.js skeleton alongside Gatsby.** Add Next.js, React 19-compatible deps, and TypeScript to `package.json`. Add `next.config.mjs`, `tsconfig.json`, `app/` and `lib/` directories. Do **not** delete Gatsby yet — both must coexist so we can A/B compare while building.

**0b. Add path-based dual scripts.** Add `dev:next`, `build:next` scripts. Leave `build` pointing at Gatsby until cut-over.

**0c. Enable Sass.** Next.js auto-detects `sass`. Verify by importing one global stylesheet from `app/layout.tsx`. No code changes to the SCSS files themselves.

**0d. Wire env vars.** Rename `GATSBY_SEGMENT_API_KEY` → `NEXT_PUBLIC_SEGMENT_API_KEY` (and the other three) in `.env` and document. Both prefixes can live in `.env` during the transition.

### Phase 1: Content layer

**1a. Type the frontmatter.** In `lib/content-types.ts`, define interfaces for `HomeFrontmatter`, `AboutFrontmatter`, `PastMeetupsFrontmatter`, `MeetupFrontmatter`, `NavbarFrontmatter`, `FooterFrontmatter`, `RedirectFrontmatter`. Derive shapes from the existing markdown files and `static/admin/config.yml`.

**1b. Implement readers.** `lib/content.ts` provides one async function per content type. Body is parsed to HTML via `remark().use(html).process(matter(...).content)`. Dates from frontmatter are parsed via `date-fns/parseISO`.

**1c. Verify against current data.** Write a tiny ad-hoc script (`scripts/dump-content.ts`, throwaway) that prints each reader's output and diff against current Gatsby GraphQL output captured from `gatsby develop`. Delete after verification.

### Milestone Checkpoint 1

`yarn ts-node scripts/dump-content.ts` (or equivalent) renders all five content types with parsed HTML and validated typing. No Next.js pages yet.

### Phase 2: Shared chrome

**2a. Port `Layout` → `app/layout.tsx`.** Move the global `<Script>` analytics blobs in verbatim, swapping `process.env.GATSBY_*` → `process.env.NEXT_PUBLIC_*`. Use `<Script strategy="afterInteractive">` per script.

**2b. Port `Navbar` and `Footer`.** Convert from `.js` to `.tsx`, type their props as `{ data: NavbarFrontmatter }` / `{ data: FooterFrontmatter }`. Keep their SCSS imports.

**2c. Port `CustomLink` and `Content`.** Straight JS→TS conversion. `Content` is a thin `dangerouslySetInnerHTML` wrapper; type the `content: string` prop.

### Phase 3: Pages (parity build, one at a time)

**3a. `/` (home).** `app/page.tsx`. Reads home markdown + all meetups, computes `upcomingMeetup` (next meetup whose `date > now`). Renders the same DOM as `src/pages/index.js`. Replace `ReactMarkdown source=` with `react-markdown` `children=`. Implement `generateMetadata` for SEO.

**3b. `/about/`.** `app/about/page.tsx`. Reads `about/index.md`. Body HTML rendered via `dangerouslySetInnerHTML`. Same gallery + organizers DOM as `src/templates/about-page.js`.

**3c. `/pastMeetups/`.** `app/pastMeetups/page.tsx`. Reads pastMeetups markdown + all meetups, filters to past. Renders the `MeetupTemplate` component (ported from `src/templates/meetup.js` to `app/_components/MeetupBlock.tsx`).

**3d. Redirect pages `/contact/`, `/work-together/`.** `app/contact/page.tsx` and `app/work-together/page.tsx`. Each reads its respective markdown to get `redirectTo`. Renders the "computer doggo" UI and registers a 2.5s `setTimeout` redirect plus a `<meta http-equiv="refresh">` for no-JS clients. Generate metadata `<title>Redirecting...</title>`.

**3e. `/404`.** `app/not-found.tsx`. Port `src/pages/404.js` as-is.

### Milestone Checkpoint 2

`yarn build:next` (running `next build && next export` semantics under `output: 'export'`) produces `out/` with every URL present. Spot-check each page against the Gatsby `public/` output for DOM/style parity.

### Phase 4: Decap CMS

**4a. Static admin page.** `app/admin/page.tsx` — a client component that returns minimal HTML and loads the Decap CMS bundle via `<Script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js" strategy="beforeInteractive">`. Keep `static/admin/config.yml` (moved to `public/admin/config.yml` since Next.js uses `public/` for static assets).

**4b. Preview templates.** Port the six files under `src/cms/preview-templates/` to `app/admin/previews/*.tsx`. Convert imports and call `CMS.registerPreviewTemplate(...)` from a `'use client'` registrar component loaded on the admin route.

**4c. Verify auth + edit flow end-to-end.** Log into the deployed preview build, edit one field on each collection, confirm the preview renders, confirm GitHub PR is opened.

### Phase 5: Deploy

**5a. Update `netlify.toml`.** Change `publish = "public"` → `publish = "out"`. Update `command = "yarn build:next"` (renamed below in 5b).

**5b. Rename scripts.** Once parity is confirmed, swap: `build` now runs Next.js; `build:gatsby` (if kept for rollback window) points at the old build.

**5c. Deploy preview.** Push branch, let Netlify deploy preview. Manually walk the site.

**5d. Delete Gatsby.** In a separate commit on the same branch (so we can revert cleanly), remove `gatsby-*` deps, `gatsby-config.js`, `gatsby-node.js`, `src/pages/index.js`, `src/pages/404.js`, `src/templates/*`, `src/components/*.js`, and the unused `src/styles/index.js`. Markdown content under `src/pages/**/*.md` stays where Decap writes it (paths in `static/admin/config.yml` are unchanged).

### Milestone Checkpoint 3 (cut-over)

Production deploy is Next.js. Gatsby is gone from the repo. Decap CMS still authors content to the same markdown paths, which the Next.js build consumes. Site URLs and SEO metadata unchanged.

## Files to Modify/Create

### New Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next config with `output: 'export'`, `images.unoptimized: true`. |
| `tsconfig.json` | TS config, `strict: true`, `moduleResolution: "bundler"`. |
| `app/layout.tsx` | Root layout: HTML shell, analytics `<Script>`s, `Navbar`/`Footer`, fetches layout data. |
| `app/page.tsx` | `/` route. |
| `app/about/page.tsx` | `/about/` route. |
| `app/pastMeetups/page.tsx` | `/pastMeetups/` route. |
| `app/contact/page.tsx` | `/contact/` redirect-style route. |
| `app/work-together/page.tsx` | `/work-together/` redirect-style route. |
| `app/not-found.tsx` | 404. |
| `app/admin/page.tsx` | Decap CMS shell page. |
| `app/admin/previews/*.tsx` | Six ported preview templates. |
| `app/admin/Registrar.tsx` | `'use client'` module that calls `CMS.registerPreviewTemplate` for each preview. |
| `app/_components/Navbar.tsx` | Ported navbar. |
| `app/_components/Footer.tsx` | Ported footer. |
| `app/_components/MeetupBlock.tsx` | Ported `meetup.js` component (was a template, now a shared component since meetups don't get their own routes). |
| `app/_components/CustomLink.tsx` | Ported. |
| `app/_components/Content.tsx` | Ported HTML-inserting helper. |
| `app/_components/RedirectShell.tsx` | Shared markup + `useEffect` redirect used by both contact/work-together pages. |
| `lib/content.ts` | Typed filesystem-based content readers. |
| `lib/content-types.ts` | Frontmatter interfaces. |
| `lib/markdown.ts` | Small helpers wrapping `remark`/`remark-html` and `react-markdown`. |
| `public/admin/config.yml` | Moved from `static/admin/config.yml` (Next.js convention). |
| `public/img/...` | Moved from `static/img/` (Next.js convention). |
| `docs/plans/migrate_gatsby_to_nextjs_ssg_typescript.md` | This document. |

### Modified Files

| File | Changes |
|------|---------|
| `package.json` | Add `next`, `react@19`, `react-dom@19`, `typescript`, `@types/*`, `gray-matter`, `remark`, `remark-html`, `react-markdown`. Remove all `gatsby-*` and `gatsby` deps. Add `dev:next`, `build:next` scripts; later swap `build` and `develop` over. Drop `parcel-bundler`, `lodash-webpack-plugin`, `prop-types`, `react-commonmark`. |
| `netlify.toml` | `publish = "out"`, `command = "yarn build"` (after script swap). Drop `YARN_FLAGS` if `--no-ignore-optional` was Gatsby-specific. |
| `.gitignore` | Add `.next/`, `out/`, `next-env.d.ts`. Remove `.cache/`, `public/` once Gatsby is gone. |
| `.env` | Add `NEXT_PUBLIC_*` mirrors of `GATSBY_*` keys; eventually delete `GATSBY_*`. |
| `README.md` | Update dev/build instructions. |
| `src/styles/*.scss` | Untouched (relocated path-wise — `src/styles/` may stay as-is and be imported from `app/` files; Next.js Sass loader handles any path). |
| `src/pages/**/*.md` | **Unchanged.** Content stays put; Decap writes there per `static/admin/config.yml` → moved to `public/admin/config.yml` but the `folder:` paths in it still point at `src/pages/meetups/` etc. and that's fine. |

### Deleted Files (Phase 5d)

`gatsby-config.js`, `gatsby-node.js`, `src/components/Layout.js`, `src/components/CustomLink.js`, `src/components/Content.js`, `src/components/Navbar/`, `src/components/Footer/`, `src/pages/index.js`, `src/pages/404.js`, `src/templates/`, `src/cms/cms.js`, `src/cms/preview-templates/` (after ports land), `src/styles/index.js`, `.cache/`, `public/` (Gatsby output dir).

## Testing Plan

There is no existing test framework. Verification is primarily build + manual + diff-based.

### Build verification

- `yarn build:next` must succeed with zero TypeScript errors and produce `out/` containing every route from the Current Architecture table.
- Output HTML for `/`, `/about/`, `/pastMeetups/` must include the same metadata (`<title>`, description, keywords) as the Gatsby build.

### Content-layer unit-ish checks

- For each `lib/content.ts` reader, manually invoke and assert that returned frontmatter matches the markdown source one-to-one. Done via the throwaway `scripts/dump-content.ts` in Phase 1c.
- Edge case: a meetup markdown file with `presenter.image` missing falls back to the headshot placeholder.
- Edge case: `home/index.md` with no upcoming meetup (all meetups in the past) — `index.tsx` should render with `upcomingMeetup === null` and not crash.
- Edge case: `redirectTo` frontmatter missing on a `contact` page — should render the shell but not redirect (mirrors current behavior: `navigate(undefined)` is a no-op).

### Visual / DOM parity

- Diff the Gatsby `public/index.html` against the Next.js `out/index.html` after each phase. Differences should be limited to:
  - React 19 / `next` runtime script tags
  - Hash-suffixed asset paths
  - Removed Gatsby runtime
- Use a browser side-by-side load (Netlify deploy preview vs. current prod) for `/`, `/about/`, `/pastMeetups/`, `/contact/`, `/work-together/`, `/404`, `/admin/`.

### CMS smoke test

- Log into `/admin/` on a deploy preview.
- For each of the six collections, open the editor, make a trivial change to one field, observe the preview renders.
- Save → expect a GitHub PR to be opened against the repo (Decap's GitHub backend).
- Revert / close the PR after verification.

### Analytics smoke test

- Load `/` in a deploy preview with the browser network tab open.
- Confirm Segment, PostHog, RudderStack, and Leadsy scripts load and `page()` fires.
- Confirm env vars are correctly inlined into the page (no `undefined` strings in the script bodies).

### Redirect behavior

- `/contact/` and `/work-together/` should:
  - Render the "computer doggo" page on first paint.
  - Trigger client-side redirect after ~2.5s.
  - Trigger a `<meta http-equiv="refresh">` fallback if JS is disabled (verify with JS toggled off).

## Future Enhancements

1. **Adopt a test framework** — Vitest or Jest, with at least one test per content reader and one Playwright check per route.
2. **Replace UA Google Analytics** — UA-450199-43 is end-of-life; pick GA4 or rely solely on PostHog/Segment.
3. **Adopt `next/image` with a custom loader** under `output: 'export'`, then convert markdown image paths and gain modern image formats / sizing.
4. **Normalize `/pastMeetups/` to `/past-meetups/`** with a static redirect HTML at the old slug.
5. **Promote meetups to individual routes** at `/meetups/[slug]/` via `generateStaticParams`. Today they're embedded only; SEO would benefit.
6. **Module CSS** — replace SCSS partial imports with CSS Modules to localize styling and shake unused styles.
7. **Move analytics into a typed client wrapper** instead of raw `<Script>` blobs; share between site and admin.

## Notes

- **Minimal-viable spirit:** each phase is independently mergeable, and Gatsby continues to serve the site until Phase 5b. We never enter a state where the deployed site is broken.
- **No comments, no over-engineering:** typed content readers should be as small as possible. Frontmatter types live in one file. Per project CLAUDE.md, prefer the minimum viable solution.
- **Path conventions:** App Router uses `app/`. The existing `src/` content directory stays in place to avoid breaking Decap's filesystem write paths. We treat `src/pages/**/*.md` as a *content store*, not a routing surface.
- **Why not Pages Router under `pages/`?** Mixing `pages/` with `src/pages/` (Gatsby's pages-as-routes directory) would force a rename or risk Next discovering content markdown as routes. App Router under `app/` sidesteps this entirely.

## Related Work

- Decap CMS docs: <https://decapcms.org/docs/intro/>
- Next.js static export: <https://nextjs.org/docs/app/building-your-application/deploying/static-exports>
- `react-commonmark` is deprecated; `react-markdown` is the maintained replacement.
- Current production behavior captured by reading the deployed boujeehacker.com site is the parity target.
