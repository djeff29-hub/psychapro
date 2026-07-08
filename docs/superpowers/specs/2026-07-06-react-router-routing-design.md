# React Router routing for PsychaPro — Design

## Context

PsychaPro (`monpsy.click`) is a single-page React app deployed on Vercel (Vite, no SSR). Navigation between "pages" (home, test catalog, individual test detail, taking a test, results, consultations, legal) is currently implemented as in-memory `useState("home")` in `App` — the browser URL never changes regardless of which screen is shown.

This was identified as the primary structural blocker to Google indexing: the site has exactly one crawlable URL (`/`) no matter how much distinct content exists behind different screens (10 psychological tests, consultations, legal pages). A prior fix corrected hardcoded SEO tags that pointed to the wrong domain (`psychapro.fr` instead of the live `monpsy.click`), but that alone cannot make individual tests indexable without real URLs.

## Goal

Give each piece of indexable content (home, test catalog, each individual test, consultations, each legal page) its own real, bookmarkable, crawlable URL using `react-router-dom`, while keeping transactional/personal-data screens (taking a test, viewing results) navigable via real URLs but excluded from indexing.

## Route table

| URL | Page component | Indexable |
|---|---|---|
| `/` | `Home` | Yes |
| `/tests` | `TestCatalog` | Yes |
| `/tests/:slug` (e.g. `/tests/phq9`) | `TestDetail` | Yes |
| `/tests/:slug/passer` | `TakeTest` | No — `noindex` |
| `/tests/:slug/resultats` | `Results` | No — `noindex` |
| `/consultations` | `Consultations` | Yes |
| `/legal/mentions-legales` | `Legal` (mentions section) | Yes |
| `/legal/confidentialite` | `Legal` (RGPD section) | Yes |
| `/legal/cgu` | `Legal` (CGU section) | Yes |
| `*` (anything else) | `NotFound` | No — `noindex` |

`:slug` maps directly to the existing `id` field already present on each entry in `TESTS` (e.g. `phq9`, `types16`, `emotions`) — no new identifier needs to be introduced.

## Architecture

- `main.jsx` wraps `<App />` in react-router-dom's `<BrowserRouter>`.
- `App.jsx` becomes the layout shell: `NavBar` + `<Routes>` + `Footer`. The `useState("home")` page-switching state is removed entirely.
- `vercel.json` is added at the repo root with a catch-all rewrite (`"/(.*)"` → `/index.html`) so that a direct hit or refresh on a nested route (e.g. `/tests/phq9`) is served the SPA shell instead of a Vercel 404 (Vercel does not do this automatically for a Vite project without a rewrite rule).
- `useSEO` (currently keyed off the `page` state) is rewritten to read `useLocation()` / `useParams()` from react-router instead, and additionally sets `<meta name="robots" content="noindex">` when the current route is one of the non-indexable ones (`/tests/:slug/passer`, `/tests/:slug/resultats`, `*`). All other routes keep `index, follow`.
- **Per-test SEO copy (in scope):** today `SEO_DATA["test-detail"]` is a single generic title/description shared by every test, which would mean all 10 new `/tests/:slug` URLs carry identical `<title>`/meta description — undermining the point of giving them distinct URLs (duplicate-content signal to Google). Instead, for `/tests/:slug`, `useSEO` builds the title/description from the matched test's own existing `name` and `description` fields already present in `TESTS` (e.g. title = `${test.name} — Test gratuit — PsychaPro`, description = `test.description`), rather than a static `SEO_DATA` entry. No new copy needs to be authored — the fields already exist in `data/tests.js`.

## File structure

The current single file (`src/psychapro.jsx`, ~3000 lines: components, per-test question banks, scoring engine, and every page all together) is split as part of this change:

```
src/
  main.jsx
  App.jsx                 (layout + <Routes>)
  data/
    tests.js              (TESTS, CATEGORIES)
    questionBanks.js       (QUESTION_BANKS, DIMENSION_LABELS, ANSWER_OPTIONS*)
  lib/
    scoring.js             (computeResults, getDimensionDescription, generateSummary, generateAdvice, getGlobalLevel)
    seo.js                 (SEO_DATA, useSEO, JsonLd)
  components/
    Logo.jsx, NavBar.jsx, Footer.jsx
  pages/
    Home.jsx, TestCatalog.jsx, TestDetail.jsx, TakeTest.jsx, Results.jsx, Consultations.jsx, Legal.jsx, NotFound.jsx
```

Existing logic (scoring engine, question banks, visual styling, copy) is moved as-is into the new files — this is a structural split, not a rewrite of behavior.

**Legal page component identity:** the current `MentionsLegales` component (line 2575 of `psychapro.jsx`) takes an `activeLegal` prop and holds its own internal `tab` state (`useState(activeLegal || "mentions")`) that decides which of the three sections (mentions / RGPD / CGU) renders, with its own tab-switch buttons. This component is renamed to `pages/Legal.jsx` as part of the move — it is not a new component. Its internal `tab` state is removed entirely; the rendered section is derived directly from the URL (e.g. `useParams()` or matching on `useLocation().pathname` against `/legal/mentions-legales` | `/legal/confidentialite` | `/legal/cgu`), so the three routes each render a distinct section without any component-local state. The component's own tab-switch buttons (currently calling something like `setTab(...)`) become `<Link>` elements pointing at the three legal routes, same as every other internal navigation call covered by "Data flow / state" below.

## Data flow / state

- `TestDetail`, `TakeTest`, and `Results` resolve the current test via `useParams().slug` and `TESTS.find(t => t.id === slug)`, replacing the `selectedTest` state that used to be threaded down from `App`.
- **Answer persistence granularity (matches current behavior, just relocated):** today, `TakeTest` keeps the in-progress answers in a local state scoped to the question-taking flow, and only hands the completed set up to the parent (`setTestAnswers(...)`) once the last question is answered. This change keeps that same granularity — it does not add mid-test resume. Concretely: `TakeTest` still keeps its own local in-progress answers (lost on a refresh of `/tests/:slug/passer`, exactly like today); only the final completed answer set is written to `sessionStorage` under a per-slug key, at the same moment it currently gets lifted to the parent. This is what lets `/tests/:slug/resultats` survive a refresh (which is impossible at all today, since there is no results URL to refresh) without expanding scope to a resumable in-progress questionnaire, which was not requested.
- If `Results` is loaded for a slug with no completed answers found in `sessionStorage`, it redirects to `/tests/:slug/passer`.
- All internal navigation (`setPage("x")` calls throughout the current codebase) is replaced with react-router `<Link>` components or `navigate()` calls to the corresponding path.

## Error handling

- Unknown test slug (e.g. `/tests/xyz`): redirect to `/tests` with an inline message rather than a crash (`TESTS.find` returning `undefined` is the trigger condition).
- Any URL not matching a defined route: dedicated `NotFound` page component, marked `noindex`.

## SEO follow-up (in scope for this change)

Once routes exist, `public/sitemap.xml` is regenerated to list the indexable URLs: `/`, `/tests`, `/tests/:slug` for each of the 10 tests, `/consultations`, and the 3 legal pages. `public/robots.txt` (already added) needs no change since it just points to the sitemap.

## Out of scope

- Server-side rendering / static generation (Next.js migration) — the app remains client-side rendered; Googlebot must still execute JS to see content, but at least each URL now serves distinct, eventually-renderable content instead of all URLs collapsing to the same screen.
- Automated tests — the project has no test runner configured (no vitest/jest). Introducing one is not part of this change; verification will be manual (navigate each route, hard-refresh on a nested route, hit an invalid slug, hit an undefined route) in the browser before considering the work done.
- Switching the canonical domain to `psychapro.fr` — deferred until that domain's DNS is pointed at Vercel and a redirect from `monpsy.click` is configured (tracked separately, not part of this change).
