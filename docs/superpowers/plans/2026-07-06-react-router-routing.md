# React Router Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fake `useState("home")` page-switching in `psychapro.jsx` with real `react-router-dom` routes so each piece of content (home, test catalog, each of the 10 individual tests, consultations, each of the 3 legal pages) has its own crawlable URL, and split the 3026-line single file into focused files along the way.

**Architecture:** `BrowserRouter` wraps `<App/>` in `main.jsx`. `App.jsx` becomes a layout shell (`NavBar` + `<Routes>` + `Footer` + `CookieBanner`) with no page state of its own. Existing component/data/logic code is extracted verbatim from `src/psychapro.jsx` into `src/data/`, `src/lib/`, `src/components/`, and `src/pages/`, with only the navigation plumbing (`setPage(...)` calls, `selectedTest`/`testAnswers` prop-drilling) rewritten to use `useNavigate`/`useParams`/`<Link>`/`sessionStorage`. A `vercel.json` rewrite is added so nested routes don't 404 on refresh.

**Tech Stack:** React 19, Vite, react-router-dom (new dependency), Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-07-06-react-router-routing-design.md`

---

## Reference: current file map (before this plan)

All line numbers below refer to `src/psychapro.jsx` **before any changes in this plan**. Re-check with `grep -n "^function \|^const [A-Z_]* = \|^export default" src/psychapro.jsx` if a line has shifted after an earlier task in this plan.

| Lines | Content |
|---|---|
| 1 | `import { useState, useEffect, useRef, useMemo } from "react";` |
| 3–19 | `COLORS` |
| 20–41 | `Logo` |
| 43–154 | `TESTS` |
| 156–162 | `CATEGORIES` |
| 168–373 | `QUESTION_BANKS` |
| 375–377 | `ANSWER_OPTIONS`, `ANSWER_OPTIONS_FREQ`, `ANSWER_OPTIONS_FREQ5` |
| 380–384 | `getAnswerOptions` |
| 389–439 | `computeResults` |
| 441–472 | `DIMENSION_LABELS` |
| 475–649 | `getDimensionDescription` |
| 651–699 | `getGlobalLevel` |
| 701–761 | `generateSummary` |
| 763–836 | `generateAdvice` |
| 838–961 | `NavBar` |
| 963–1102 | `Hero` |
| 1104–1158 | `HowItWorks` |
| 1160–1280 | `TestCatalog` |
| 1281–1401 | `TestDetail` |
| 1404–1555 | `TakeTest` |
| 1557–2149 | `Results` (includes dynamic jsPDF `<script>` loading, no npm dependency involved) |
| 2151–2154 | `sanitizeInput` (dead code — defined, never called anywhere in the file; move as-is, don't delete, not in scope) |
| 2159–2167 | `SEO_DATA` |
| 2168–2209 | `useSEO` |
| 2210–2231 | `JsonLd` |
| 2232–2315 | `CookieBanner` |
| 2316–2574 | `Consultations` |
| 2575–2849 | `MentionsLegales` (has internal `tab`/`setTab` state, `activeLegal` prop) |
| 2850–2932 | `Footer` |
| 2933–3026 | `App` (default export) |

`main.jsx` currently: `ReactDOM.createRoot(...).render(<React.StrictMode><App /></React.StrictMode>)`, imports `App` from `./psychapro.jsx`.

## Target file structure

```
src/
  main.jsx                  (adds BrowserRouter)
  App.jsx                   (layout + <Routes>, replaces psychapro.jsx as the default export)
  lib/
    colors.js               (COLORS — needed by nearly every file below)
    scoring.js               (computeResults, getDimensionDescription, getGlobalLevel, generateSummary, generateAdvice)
    seo.js                   (useSEO, JsonLd)
  data/
    tests.js                 (TESTS, CATEGORIES)
    questionBanks.js         (QUESTION_BANKS, DIMENSION_LABELS, ANSWER_OPTIONS, ANSWER_OPTIONS_FREQ, ANSWER_OPTIONS_FREQ5, getAnswerOptions)
  components/
    Logo.jsx
    NavBar.jsx
    Footer.jsx
    CookieBanner.jsx
  pages/
    Home.jsx                 (Hero + HowItWorks, folded in as unexported local components, + <TestCatalog/>)
    TestCatalog.jsx
    TestDetail.jsx
    TakeTest.jsx
    Results.jsx               (sanitizeInput folded in as a local unexported helper)
    Consultations.jsx
    Legal.jsx                 (renamed from MentionsLegales)
    NotFound.jsx              (new)
```

`src/lib/colors.js` is not explicitly listed in the spec's file structure sketch but is required: `COLORS` (psychapro.jsx:3-19) is imported by literally every component being split out, so it needs a shared home. Everything else matches the spec exactly.

## Route table (from spec)

| URL | Page component | Indexable |
|---|---|---|
| `/` | `Home` | Yes |
| `/tests` | `TestCatalog` | Yes |
| `/tests/:slug` | `TestDetail` | Yes |
| `/tests/:slug/passer` | `TakeTest` | No (`noindex`) |
| `/tests/:slug/resultats` | `Results` | No (`noindex`) |
| `/consultations` | `Consultations` | Yes |
| `/legal/:section` (`section` ∈ `mentions-legales`\|`confidentialite`\|`cgu`) | `Legal` | Yes |
| `*` | `NotFound` | No (`noindex`) |

`Legal` is implemented as a single param route (`/legal/:section`) rather than three separate `<Route>` entries pointing at the same element — same three URLs, simpler router config. `:slug` is the existing `id` field on each `TESTS` entry (e.g. `phq9`).

---

### Task 1: Install react-router-dom

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm, not by hand)

- [ ] **Step 1: Install the dependency**

Run: `npm install react-router-dom`
Expected: `package.json` gains a `"react-router-dom": "^7.x.x"` line under `dependencies`; `package-lock.json` updates; exit code 0.

- [ ] **Step 2: Verify**

Run: `npm ls react-router-dom`
Expected: prints the installed version with no `UNMET DEPENDENCY` error.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-router-dom dependency"
```

---

### Task 2: Extract COLORS into src/lib/colors.js

**Files:**
- Create: `src/lib/colors.js`
- Modify: `src/psychapro.jsx:3-19` (delete after extraction, done implicitly as later tasks empty the file)

- [ ] **Step 1: Create the file**

Copy lines 3-19 of `src/psychapro.jsx` verbatim into `src/lib/colors.js`, and export it:

```js
export const COLORS = {
  cream: "#FFF8F0",
  warmWhite: "#FFFDF9",
  sand: "#F5E6D3",
  terracotta: "#C4704B",
  terracottaLight: "#E8956D",
  sage: "#8FA68A",
  sageDark: "#6B8B65",
  sageLight: "#B8D4B2",
  deepBrown: "#3D2B1F",
  warmGray: "#8C7B6B",
  blush: "#F2D4C4",
  lavender: "#D4C5E2",
  softGold: "#D4A853",
  offWhite: "#FAF6F1",
};
```

- [ ] **Step 2: Leave `src/psychapro.jsx` untouched for now**

Do not delete anything from `psychapro.jsx` yet — it stays as the working reference/copy source until Task 19 deletes it. Every subsequent extraction task copies *from* it without modifying it.

- [ ] **Step 3: Commit**

```bash
git add src/lib/colors.js
git commit -m "refactor: extract COLORS into src/lib/colors.js"
```

---

### Task 3: Extract test data into src/data/tests.js

**Files:**
- Create: `src/data/tests.js`

- [ ] **Step 1: Create the file**

Copy `psychapro.jsx:43-162` (`TESTS` array and `CATEGORIES` object) verbatim into `src/data/tests.js`, add `export` to both declarations. No other changes — these two constants don't reference `COLORS` or anything else external... except they do: each `TESTS` entry has a `color: COLORS.terracotta` field. Add the import:

```js
import { COLORS } from "../lib/colors.js";

export const TESTS = [
  // ...copy lines 44-154 verbatim...
];

export const CATEGORIES = {
  // ...copy lines 157-162 verbatim...
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tests.js
git commit -m "refactor: extract TESTS/CATEGORIES into src/data/tests.js"
```

---

### Task 4: Extract question banks into src/data/questionBanks.js

**Files:**
- Create: `src/data/questionBanks.js`

- [ ] **Step 1: Create the file**

Copy verbatim, no external dependencies needed for these:
- `psychapro.jsx:168-373` → `export const QUESTION_BANKS = { ... }`
- `psychapro.jsx:375-377` → `export const ANSWER_OPTIONS = [...]`, `export const ANSWER_OPTIONS_FREQ = [...]`, `export const ANSWER_OPTIONS_FREQ5 = [...]`
- `psychapro.jsx:380-384` → `export function getAnswerOptions(testId) { ... }` (references `ANSWER_OPTIONS_FREQ`/`ANSWER_OPTIONS_FREQ5`/`ANSWER_OPTIONS`, all in the same file, no import needed)
- `psychapro.jsx:441-472` → `export const DIMENSION_LABELS = { ... }`

- [ ] **Step 2: Commit**

```bash
git add src/data/questionBanks.js
git commit -m "refactor: extract question banks and dimension labels into src/data/questionBanks.js"
```

---

### Task 5: Extract the scoring engine into src/lib/scoring.js

**Files:**
- Create: `src/lib/scoring.js`

- [ ] **Step 1: Create the file**

Copy verbatim:
- `psychapro.jsx:389-439` → `computeResults` (references `QUESTION_BANKS`, `getAnswerOptions`)
- `psychapro.jsx:475-649` → `getDimensionDescription`
- `psychapro.jsx:651-699` → `getGlobalLevel` (references `QUESTION_BANKS` inside the `types16` branch)
- `psychapro.jsx:701-761` → `generateSummary`
- `psychapro.jsx:763-836` → `generateAdvice`

Add `export` to each function declaration and this import at the top:

```js
import { QUESTION_BANKS, DIMENSION_LABELS, getAnswerOptions } from "../data/questionBanks.js";
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/scoring.js
git commit -m "refactor: extract scoring engine into src/lib/scoring.js"
```

---

### Task 6: Create src/components/Logo.jsx

**Files:**
- Create: `src/components/Logo.jsx`

- [ ] **Step 1: Create the file**

Copy `psychapro.jsx:20-41` verbatim. `Logo` references `COLORS` — add:

```js
import { COLORS } from "../lib/colors.js";

export function Logo({ size = 40 }) {
  // ...copy body verbatim...
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Logo.jsx
git commit -m "refactor: extract Logo into src/components/Logo.jsx"
```

---

### Task 7: Create src/components/CookieBanner.jsx

**Files:**
- Create: `src/components/CookieBanner.jsx`

- [ ] **Step 1: Create the file**

Copy `psychapro.jsx:2232-2308` verbatim (the component's closing brace; lines 2309-2315 are trailing blank/comment lines before `Consultations` starts at 2316, harmless to include but not part of the component). No navigation logic — this component doesn't reference `page`/`setPage`, just `COLORS` and local `useState`.

```js
import { useState } from "react";
import { COLORS } from "../lib/colors.js";

export function CookieBanner() {
  // ...copy body verbatim...
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CookieBanner.jsx
git commit -m "refactor: extract CookieBanner into src/components/CookieBanner.jsx"
```

---

### Task 8: Create src/lib/seo.js (routing-aware SEO hook)

**Files:**
- Create: `src/lib/seo.js`

This replaces the `page`-keyed `SEO_DATA`/`useSEO`/`JsonLd` (`psychapro.jsx:2159-2231`) with a hook driven by the route, called individually from each page with that page's own title/description/indexability — this avoids duplicating the whole route table a second time inside the SEO hook, and is what makes per-test titles/descriptions possible (spec requirement).

- [ ] **Step 1: Write the new hook**

```js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://monpsy.click";

function setMeta(attr, attrVal, content) {
  let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, attrVal); document.head.appendChild(el); }
  el.content = content;
}

// Call from each page component with that page's own title/description.
// indexable defaults to true; pass false for /tests/:slug/passer, /tests/:slug/resultats, and the 404 page.
export function useSEO({ title, description, indexable = true }) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", indexable ? "index, follow" : "noindex, nofollow");
    setMeta("name", "author", "PsychaPro SAS");
    setMeta("name", "viewport", "width=device-width, initial-scale=1.0");

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", SITE_URL + location.pathname);
    setMeta("property", "og:image", SITE_URL + "/og-image.jpg");
    setMeta("property", "og:locale", "fr_FR");
    setMeta("property", "og:site_name", "PsychaPro");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", SITE_URL + "/og-image.jpg");

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = SITE_URL + location.pathname;

    document.documentElement.lang = "fr";
  }, [title, description, indexable, location.pathname]);
}

export function JsonLd() {
  useEffect(() => {
    const data = { "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "PsychaPro", "url": SITE_URL,
      "description": "Tests psychologiques gratuits et consultations en visioconférence avec des psychologues qualifiés.",
      "address": { "@type": "PostalAddress", "addressLocality": "Lyon", "postalCode": "69002", "addressCountry": "FR" },
      "priceRange": "Gratuit — €€", "medicalSpecialty": "Psychiatric",
      "availableService": [
        { "@type": "MedicalTest", "name": "Big Five (OCEAN)", "description": "Test de personnalité validé scientifiquement" },
        { "@type": "MedicalTest", "name": "PHQ-9", "description": "Dépistage dépression validé cliniquement" },
        { "@type": "MedicalTest", "name": "GAD-7", "description": "Dépistage anxiété validé cliniquement" },
      ],
    };
    let s = document.getElementById("jsonld-pp");
    if (!s) { s = document.createElement("script"); s.id = "jsonld-pp"; s.type = "application/ld+json"; document.head.appendChild(s); }
    s.textContent = JSON.stringify(data);
  }, []);
  return null;
}
```

(Body of `JsonLd` and the `og:url`/`canonical` values copied from the already-corrected `psychapro.jsx:2190-2225`, which already point at `monpsy.click`.)

- [ ] **Step 2: Commit**

```bash
git add src/lib/seo.js
git commit -m "feat: add route-aware useSEO hook replacing page-keyed SEO_DATA"
```

---

### Task 9: Create src/components/NavBar.jsx

**Files:**
- Create: `src/components/NavBar.jsx`

- [ ] **Step 1: Create the file**

Copy `psychapro.jsx:838-961` and make these exact changes:

1. Imports:
```js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { Logo } from "./Logo.jsx";
```
2. Signature: `export function NavBar()` — no more `{ page, setPage }` props.
3. Add `const location = useLocation();` at the top of the function body.
4. `navItems` becomes route-aware:
```js
const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/tests", label: "Nos tests" },
];
```
5. Delete the `navigate` helper (`const navigate = (key) => { setPage(key); setMobileOpen(false); };`) — replaced by `<Link>` below, closing the mobile menu via `onClick={() => setMobileOpen(false)}` directly on each link.
6. Logo/brand click (`<div onClick={() => navigate("home")} ...>`) → wrap in `<Link to="/" style={{ textDecoration: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>` (move the `cursor`/`display`/`gap` styles from the old `div` onto the `Link`, drop `onClick`).
7. Each `navItems.map(item => ...)` button (desktop and mobile, two occurrences) → replace `<button key={item.key} onClick={() => navigate(item.key)} aria-current={page === item.key ? "page" : undefined} style={{ ... }}>{item.label}</button>` with:
```jsx
<Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} aria-current={location.pathname === item.to ? "page" : undefined} style={{
  background: "none", border: "none", cursor: "pointer", textDecoration: "none",
  fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
  color: location.pathname === item.to ? COLORS.terracotta : COLORS.warmGray,
  borderBottom: location.pathname === item.to ? `2px solid ${COLORS.terracotta}` : "2px solid transparent",
  paddingBottom: 4, transition: "all 0.3s",
}}>
  {item.label}
</Link>
```
(keep the mobile variant's distinct styling, same substitution pattern: `onClick={() => navigate(item.key)}` → `to={item.to}` + `onClick={() => setMobileOpen(false)}`, `page === item.key` → `location.pathname === item.to`)
8. "Commencer un test" buttons (2 occurrences: desktop + mobile) → `<Link to="/tests" onClick={() => setMobileOpen(false)} style={{ ...same styles..., textDecoration: "none", display: "inline-block" }}>Commencer un test</Link>`
9. "Prendre RDV" buttons (2 occurrences) → `<Link to="/consultations" onClick={() => setMobileOpen(false)} style={{ ...same styles..., textDecoration: "none", display: "inline-block" }}>Prendre RDV</Link>` (mobile one keeps its `Prendre RDV →` label and `textAlign: "center"`/`boxSizing: "border-box"` styles)

Everything else (scroll listener, mobile hamburger button, `<style>` keyframes) is copied unchanged.

- [ ] **Step 2: Commit**

```bash
git add src/components/NavBar.jsx
git commit -m "refactor: convert NavBar to react-router Link/useLocation"
```

---

### Task 10: Create src/components/Footer.jsx

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Read the current Footer body**

Read `psychapro.jsx:2850-2931` in full (2931 is the component's closing brace; line 2932 is a trailing blank line before `App` starts at 2933) to get its exact JSX structure before editing, since the column/link data structure (`{ label: "...", action: () => setPage("tests") }` etc., seen partially at lines 2877-2891) needs a like-for-like conversion.

- [ ] **Step 2: Create the file**

Copy the component, with these changes:
1. Imports: `import { Link } from "react-router-dom";` plus `COLORS`/`Logo` as needed (check what the original Footer body actually imports/uses — it likely uses `Logo` and `COLORS` given the codebase's pattern).
2. Signature: `export function Footer()` — drop `{ setPage }`.
3. Replace every `{ label: "...", action: () => setPage("tests") }`-style entry with `{ label: "...", to: "/tests" }`, mapping:
   - `setPage("tests")` → `to: "/tests"` (covers "Personnalité", "Santé mentale", "Bien-être", "Relations", "Rapport PDF", "Nos tests")
   - `setPage("consultations")` → `to: "/consultations"` ("Prendre rendez-vous")
   - `setPage("legal")` → `to: "/legal/mentions-legales"` ("Mentions légales")
   - `setPage("legal-rgpd")` → `to: "/legal/confidentialite"` ("Confidentialité (RGPD)")
   - `setPage("legal-cgv")` → `to: "/legal/cgu"` ("Conditions d'utilisation")
4. Wherever the JSX renders these as `<button onClick={item.action}>{item.label}</button>`, change to `<Link to={item.to}>{item.label}</Link>` (carry over the existing `style={{...}}` object unchanged, add `textDecoration: "none"` if not already present so links don't get a default underline).
5. One footer entry ("Contact") currently has a no-op action (`{ label: "Contact", action: () => {} }`, `psychapro.jsx:2892`) — it doesn't navigate anywhere today. Give it `to: "#"` so the `<Link>` conversion has something to render; this preserves the current no-op behavior rather than inventing a real Contact page, which is out of scope here.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "refactor: convert Footer to react-router Link"
```

---

### Task 11: Create src/pages/Home.jsx

**Files:**
- Create: `src/pages/Home.jsx`

- [ ] **Step 1: Create the file**

`Hero` (`psychapro.jsx:963-1102`) and `HowItWorks` (`psychapro.jsx:1104-1158`) are only ever used on the home screen — fold them in as local, unexported components in this same file rather than separate files.

```js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { useSEO } from "../lib/seo.js";
import { TestCatalog } from "./TestCatalog.jsx";

function Hero() {
  const navigate = useNavigate();
  // ...copy body of psychapro.jsx:963-1102 verbatim, with these changes:
  // - drop the `{ setPage }` prop from the function signature
  // - `onClick={() => setPage("tests")}` → `onClick={() => navigate("/tests")}` (the "Découvrir les tests →" button)
  // - `onClick={() => setPage("consultations")}` → `onClick={() => navigate("/consultations")}` (the "Consulter un pro →" button)
}

function HowItWorks() {
  // ...copy body of psychapro.jsx:1104-1158 verbatim...
  // this component receives `{ setPage }` today but never calls it (dead prop) — drop it from the signature, no other change needed
}

export function Home() {
  useSEO({
    title: "PsychaPro — Tests psychologiques gratuits et consultations en ligne",
    description: "Passez des tests psychologiques validés scientifiquement, obtenez vos résultats et consultez un professionnel en visio.",
  });
  return (
    <>
      <Hero />
      <HowItWorks />
      <TestCatalog />
    </>
  );
}
```

Verify the `HowItWorks` "never calls `setPage`" claim by re-reading `psychapro.jsx:1104-1158` before assuming it — if it turns out to reference `setPage` somewhere not caught during planning, apply the same `navigate()` substitution pattern used in `Hero`.

- [ ] **Step 2: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "refactor: extract Home page (Hero + HowItWorks + TestCatalog)"
```

---

### Task 12: Create src/pages/TestCatalog.jsx

**Files:**
- Create: `src/pages/TestCatalog.jsx`

- [ ] **Step 1: Read the current component**

Read `psychapro.jsx:1160-1280` in full to get the exact card-click handler and category-filter JSX before editing.

- [ ] **Step 2: Create the file**

```js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS, CATEGORIES } from "../data/tests.js";
import { useSEO } from "../lib/seo.js";

export function TestCatalog() {
  useSEO({
    title: "Nos tests psychologiques gratuits — PsychaPro",
    description: "Personnalité, 16 profils, compétences émotionnelles, dépistage dépression et anxiété, épuisement professionnel, estime de soi… Tests gratuits.",
  });
  const navigate = useNavigate();
  // ...copy the rest of the body verbatim, with:
  // - drop `{ setPage, setSelectedTest }` from the function signature (replaced by useNavigate above)
  // - wherever a test card's onClick currently does `setSelectedTest(test); setPage("test-detail");` (psychapro.jsx:1217), replace with `navigate(\`/tests/\${test.id}\`)`
}
```

Note: this component is rendered both standalone at `/tests` (its own `useSEO` call applies there) and embedded inside `Home` (Task 11), where `Home`'s own `useSEO` call runs afterward in the same render and will win, since both write to the same `document.title`/meta tags and React runs effects in child-then-parent order... actually child effects run first, so `TestCatalog`'s `useSEO` would run, then `Home`'s — meaning `Home`'s title wins, which is correct (last-applied wins, and `Home`'s effect has `location.pathname` `/` while `TestCatalog`'s effect would also fire pointing at `/tests` canonical, briefly setting the wrong canonical before `Home`'s effect corrects it). To avoid this flicker/incorrectness when `TestCatalog` is embedded in `Home`, make the `useSEO` call inside `TestCatalog` conditional: only call it when this component owns the page, not when embedded.

- [ ] **Step 3: Fix the embedding conflict**

Give `TestCatalog` an optional prop instead of always calling `useSEO`:

```js
export function TestCatalog({ standalone = true } = {}) {
  useSEO(standalone ? {
    title: "Nos tests psychologiques gratuits — PsychaPro",
    description: "Personnalité, 16 profils, compétences émotionnelles, dépistage dépression et anxiété, épuisement professionnel, estime de soi… Tests gratuits.",
  } : { title: document.title, description: "", indexable: true });
  // ...
}
```

This is awkward (calling `useSEO` with the current `document.title` as a no-op). Simpler: extract the `useSEO` call out of `TestCatalog` and only call it from the `/tests` route wrapper, not from inside `TestCatalog` itself. Concretely: **do not call `useSEO` inside `TestCatalog` at all.** Instead:
- In `pages/Home.jsx` (Task 11), `Home` calls `useSEO` with the home title/description (already planned).
- Create a second, thin export in this same file for the standalone route:

```js
export function TestCatalog() { /* the component, no useSEO call inside it */ }

export function TestCatalogPage() {
  useSEO({
    title: "Nos tests psychologiques gratuits — PsychaPro",
    description: "Personnalité, 16 profils, compétences émotionnelles, dépistage dépression et anxiété, épuisement professionnel, estime de soi… Tests gratuits.",
  });
  return <TestCatalog />;
}
```

Route to `TestCatalogPage` (Task 16), import plain `TestCatalog` into `Home.jsx` (Task 11 already does this correctly).

- [ ] **Step 4: Commit**

```bash
git add src/pages/TestCatalog.jsx src/pages/Home.jsx
git commit -m "refactor: extract TestCatalog page, fix duplicate useSEO when embedded in Home"
```

---

### Task 13: Create src/pages/TestDetail.jsx

**Files:**
- Create: `src/pages/TestDetail.jsx`

- [ ] **Step 1: Create the file**

Copy `psychapro.jsx:1281-1401` with these changes:

```js
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS } from "../data/tests.js";
import { useSEO } from "../lib/seo.js";

export function TestDetail() {
  const { slug } = useParams();
  const test = TESTS.find(t => t.id === slug);
  const navigate = useNavigate();

  useSEO(test ? {
    title: `${test.name} — Test gratuit — PsychaPro`,
    description: test.description,
  } : { title: "Test introuvable — PsychaPro", description: "", indexable: false });

  if (!test) return <Navigate to="/tests" replace />;

  return (
    // ...copy the JSX body verbatim...
    // - `onClick={() => setPage("tests")}` (back button, psychapro.jsx:1289) → `onClick={() => navigate("/tests")}`
    // - `onClick={() => setPage("take-test")}` (start button, psychapro.jsx:1383) → `onClick={() => navigate(\`/tests/\${test.id}/passer\`)}`
  );
}
```

Note: `useSEO` must be called unconditionally (React hook rules — can't call it after the `if (!test) return ...` early return), hence the ternary feeding it a fallback title/description when `test` is `undefined`, before the early-return check below it.

- [ ] **Step 2: Manually verify the invalid-slug case**

Once this task and Task 16 (routes wired up) are both done, visiting `/tests/does-not-exist` should redirect to `/tests`, not crash. Flag this as a check to (re-)run after Task 16 if it can't be verified in isolation yet.

- [ ] **Step 3: Commit**

```bash
git add src/pages/TestDetail.jsx
git commit -m "refactor: extract TestDetail page, resolve test via useParams"
```

---

### Task 14: Create src/pages/TakeTest.jsx

**Files:**
- Create: `src/pages/TakeTest.jsx`

- [ ] **Step 1: Create the file**

Copy `psychapro.jsx:1404-1555` with these changes:

```js
import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS } from "../data/tests.js";
import { QUESTION_BANKS, getAnswerOptions } from "../data/questionBanks.js";
import { useSEO } from "../lib/seo.js";

export function TakeTest() {
  const { slug } = useParams();
  const test = TESTS.find(t => t.id === slug);
  const navigate = useNavigate();

  useSEO({
    title: test ? `Passation — ${test.name} — PsychaPro` : "Test introuvable — PsychaPro",
    description: "Répondez aux questions en toute confidentialité.",
    indexable: false,
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  if (!test) return <Navigate to="/tests" replace />;

  const questionBank = QUESTION_BANKS[test.id] || [];
  const options = getAnswerOptions(test.id);
  const total = questionBank.length;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [current]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      sessionStorage.setItem(`psychapro_answers_${test.id}`, JSON.stringify(newAnswers));
      navigate(`/tests/${test.id}/resultats`);
    }
  };

  if (total === 0) {
    return (
      // ...copy the "not available" fallback JSX verbatim, with
      // `onClick={() => setPage("tests")}` → `onClick={() => navigate("/tests")}`
    );
  }

  // ...copy the rest of the JSX body verbatim (question card, progress bar, prev/next buttons) —
  // none of it calls setPage/setTestAnswers directly except handleNext above, which is already rewritten.
}
```

This preserves the exact current behavior described in the spec: `TakeTest` still keeps its own local in-progress `answers` state (lost on a mid-test refresh, same as today), and only the final completed set is persisted — to `sessionStorage` here instead of being lifted to a parent state.

- [ ] **Step 2: Commit**

```bash
git add src/pages/TakeTest.jsx
git commit -m "refactor: extract TakeTest page, persist completed answers to sessionStorage"
```

---

### Task 15: Create src/pages/Results.jsx

**Files:**
- Create: `src/pages/Results.jsx`

- [ ] **Step 1: Read the full current component**

Read `psychapro.jsx:1557-2154` in full (includes the dynamic jsPDF `<script>` loading and PDF-generation code) — this plan only pins down the parts that change; the PDF generation logic itself (canvas/text drawing calls) is copied unchanged.

- [ ] **Step 2: Create the file**

**Hook-ordering warning (read before writing this file):** the original `Results` component (`psychapro.jsx:1557-1580`) already calls `useMemo` *after* an `if (!test) return null;` early return (line 1575). That "works" in the original code only because `App` never mounts `Results` with a falsy `test` — the prop is always set before `page` becomes `"results"`, so the hook count never actually varies across renders of that instance. In the router version this assumption no longer holds: React Router **reuses the same `Results` component instance** across client-side navigations between different `/tests/:slug/resultats` URLs (e.g. `/tests/phq9/resultats` → `/tests/gad7/resultats` without an unmount), and `slug` can resolve to an invalid test or missing sessionStorage answers on any given render. If any hook is only called conditionally (e.g. after an early `<Navigate>` return), a later render of the *same instance* that takes the other branch will call a different number of hooks than the previous render, and React throws "Rendered fewer hooks than expected." **All hooks — the three `useState` calls, both `useEffect` calls, and the `useMemo` — must be called unconditionally, before any early return.** Only the JSX being returned is conditional.

```js
import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS } from "../data/tests.js";
import { computeResults } from "../lib/scoring.js";
import { useSEO } from "../lib/seo.js";

function sanitizeInput(value) {
  if (typeof value !== "string") return "";
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

export function Results() {
  const { slug } = useParams();
  const test = TESTS.find(t => t.id === slug);
  const navigate = useNavigate();

  useSEO({
    title: test ? `Résultats — ${test.name} — PsychaPro` : "Résultats introuvables — PsychaPro",
    description: "Profil psychologique détaillé et rapport PDF.",
    indexable: false,
  });

  const storedAnswers = test ? sessionStorage.getItem(`psychapro_answers_${test.id}`) : null;
  const testAnswers = storedAnswers ? JSON.parse(storedAnswers) : null;

  // --- every hook from the original psychapro.jsx:1558-1573 and :1578, called unconditionally, BEFORE any early return ---
  const [visible, setVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  useEffect(() => {
    if (window.jspdf) { setPdfReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => setPdfReady(true);
    script.onerror = () => console.error("Impossible de charger jsPDF");
    document.head.appendChild(script);
  }, []);

  // guarded internally: returns null when there's nothing to compute yet, instead of skipping the hook call
  const results = useMemo(() => (test && testAnswers) ? computeResults(test.id, testAnswers) : null, [test, testAnswers]);

  // --- only now, after every hook has been called, is it safe to branch on what to render ---
  if (!test) return <Navigate to="/tests" replace />;
  if (!testAnswers) return <Navigate to={`/tests/${test.id}/passer`} replace />;
  if (!results) {
    return (
      // ...copy the "Impossible de calculer les résultats" fallback JSX verbatim from psychapro.jsx:1581-1587, with
      // `onClick={() => setPage("tests")}` → `onClick={() => navigate("/tests")}`
    );
  }

  // ...copy the rest of the component body verbatim from psychapro.jsx:1589-2149 (levelColor, exportPDF, and all rendered result cards/charts), with:
  // - `onClick={() => setPage("tests")}` (psychapro.jsx:1584 — already covered above; there is no second occurrence in this remaining range other than the one just handled)
  // - `onClick={() => setPage("consultations")}` (psychapro.jsx:1919, 2125) → `onClick={() => navigate("/consultations")}`
  // - the jsPDF-loading logic and PDF-building function inside exportPDF are unchanged (they read pdfReady/pdfLoading state declared above)
}
```

- [ ] **Step 2b: Verify no other hook calls exist further down**

Before considering this file done, scan the copied body (`psychapro.jsx:1589-2149`) for any other `useState`/`useEffect`/`useMemo`/`useRef` calls beyond the ones already relocated above. If any are found, they must also be moved up above the three early-return checks, following the same reasoning.

`sanitizeInput` is dead code (never called — confirmed by grep across the whole original file) — moved here as an unexported local helper since it lived right after `Results` originally and this is the closest conceptual home; not calling it anywhere is out of scope for this plan (unrelated cleanup).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Results.jsx
git commit -m "refactor: extract Results page, read completed answers from sessionStorage"
```

---

### Task 16: Create src/pages/Consultations.jsx

**Files:**
- Create: `src/pages/Consultations.jsx`

- [ ] **Step 1: Read the full current component**

Read `psychapro.jsx:2316-2574` in full to confirm whether the `setPage` prop is referenced anywhere in the body (the grep run during planning found no `setPage(` call inside this range, suggesting it's an unused prop, but confirm before deleting it from the signature).

- [ ] **Step 2: Create the file**

Copy the component body verbatim into `src/pages/Consultations.jsx`, changing only:
1. Imports: `COLORS` from `../lib/colors.js`, `useSEO` from `../lib/seo.js`.
2. Signature: `export function Consultations()` — drop `{ setPage }` if step 1 confirmed it's unused; if it turns out to be used, replace that specific call with the equivalent `useNavigate()` call instead of dropping the prop.
3. Add at the top of the function body:
```js
useSEO({
  title: "Consulter une professionnelle — PsychaPro",
  description: "Prenez rendez-vous avec une psychothérapeute ou une professionnelle de l'écoute.",
});
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Consultations.jsx
git commit -m "refactor: extract Consultations page"
```

---

### Task 17: Create src/pages/Legal.jsx (renamed from MentionsLegales)

**Files:**
- Create: `src/pages/Legal.jsx`

- [ ] **Step 1: Read the full current component**

Read `psychapro.jsx:2575-2849` in full — needed to correctly move the three `<article>` blocks (mentions/RGPD/CGU content) and the tab-switch buttons.

- [ ] **Step 2: Create the file**

```js
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { useSEO } from "../lib/seo.js";

const SECTION_TO_TAB = { "mentions-legales": "mentions", "confidentialite": "rgpd", "cgu": "cgv" };
const TAB_TO_SECTION = { mentions: "mentions-legales", rgpd: "confidentialite", cgv: "cgu" };
const SEO_BY_SECTION = {
  "mentions-legales": { title: "Mentions légales — PsychaPro", description: "Informations légales du site monpsy.click." },
  "confidentialite": { title: "Confidentialité (RGPD) — PsychaPro", description: "Politique de confidentialité et RGPD de PsychaPro." },
  "cgu": { title: "Conditions Générales d'Utilisation — PsychaPro", description: "Conditions d'utilisation du site monpsy.click." },
};

export function Legal() {
  const { section } = useParams();
  const navigate = useNavigate();
  const tab = SECTION_TO_TAB[section];

  useSEO(SEO_BY_SECTION[section] || { title: "Mentions légales — PsychaPro", description: "", indexable: false });

  if (!tab) return <Navigate to="/legal/mentions-legales" replace />;

  // ...copy the rest of psychapro.jsx:2575-2849 verbatim, with:
  // - drop the `{ setPage, activeLegal }` props and the `const [tab, setTab] = useState(activeLegal || "mentions");` line (psychapro.jsx:2576) — `tab` now comes from the derivation above
  // - the "← Retour à l'accueil" button (psychapro.jsx:2583, `onClick={() => setPage("home")}`) → `onClick={() => navigate("/")}`
  // - the three tab-switch buttons (psychapro.jsx:2588, currently `onClick={() => setTab(t.key)}` where `t.key` is "mentions"/"rgpd"/"cgv") → `onClick={() => navigate(\`/legal/\${TAB_TO_SECTION[t.key]}\`)}`
  // - every `tab === "mentions"` / `tab === "rgpd"` / `tab === "cgv"` conditional (psychapro.jsx:2598, 2658, 2746) is unchanged — `tab` is still a plain string with the same three values, just sourced differently
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Legal.jsx
git commit -m "refactor: rename MentionsLegales to Legal page, derive active section from URL"
```

---

### Task 18: Create src/pages/NotFound.jsx

**Files:**
- Create: `src/pages/NotFound.jsx`

- [ ] **Step 1: Create the file**

New component, no prior equivalent in `psychapro.jsx`:

```js
import { Link } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { useSEO } from "../lib/seo.js";

export function NotFound() {
  useSEO({ title: "Page introuvable — PsychaPro", description: "", indexable: false });
  return (
    <section style={{ padding: "140px 2rem 100px", textAlign: "center", minHeight: "60vh" }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: COLORS.deepBrown, marginBottom: 16 }}>
        Page introuvable
      </h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.warmGray, marginBottom: 24 }}>
        Cette page n'existe pas ou plus.
      </p>
      <Link to="/" style={{
        display: "inline-block", background: COLORS.terracotta, color: "white",
        borderRadius: 21, padding: "14px 30px", textDecoration: "none",
        fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
      }}>
        ← Retour à l'accueil
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/NotFound.jsx
git commit -m "feat: add NotFound page for unmatched routes"
```

---

### Task 19: Create App.jsx and wire up all routes

**Files:**
- Create: `src/App.jsx`
- Modify: `src/main.jsx`
- Delete: `src/psychapro.jsx`

- [ ] **Step 1: Create src/App.jsx**

```js
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { COLORS } from "./lib/colors.js";
import { JsonLd } from "./lib/seo.js";
import { NavBar } from "./components/NavBar.jsx";
import { Footer } from "./components/Footer.jsx";
import { CookieBanner } from "./components/CookieBanner.jsx";
import { Home } from "./pages/Home.jsx";
import { TestCatalogPage } from "./pages/TestCatalog.jsx";
import { TestDetail } from "./pages/TestDetail.jsx";
import { TakeTest } from "./pages/TakeTest.jsx";
import { Results } from "./pages/Results.jsx";
import { Consultations } from "./pages/Consultations.jsx";
import { Legal } from "./pages/Legal.jsx";
import { NotFound } from "./pages/NotFound.jsx";

export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLORS.cream }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <JsonLd />

      <a href="#main-content" style={{
        position: "absolute", top: -60, left: 8, zIndex: 999,
        background: COLORS.terracotta, color: "white", padding: "10px 20px",
        borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
        textDecoration: "none", transition: "top 0.2s",
      }}
        onFocus={e => e.target.style.top = "8px"}
        onBlur={e => e.target.style.top = "-45px"}
      >Aller au contenu principal</a>

      {/* copy the full <style>{`...`}</style> block verbatim from psychapro.jsx:2961-3000 (global responsive/a11y/print CSS) */}

      <NavBar />

      <main role="main" id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<TestCatalogPage />} />
          <Route path="/tests/:slug" element={<TestDetail />} />
          <Route path="/tests/:slug/passer" element={<TakeTest />} />
          <Route path="/tests/:slug/resultats" element={<Results />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/legal/:section" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
```

- [ ] **Step 2: Update src/main.jsx**

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 3: Delete the old single file**

```bash
git rm src/psychapro.jsx
```

Before running this, double check every one of `COLORS`, `Logo`, `TESTS`, `CATEGORIES`, `QUESTION_BANKS`, `DIMENSION_LABELS`, `ANSWER_OPTIONS*`, `getAnswerOptions`, `computeResults`, `getDimensionDescription`, `getGlobalLevel`, `generateSummary`, `generateAdvice`, `NavBar`, `Hero`, `HowItWorks`, `TestCatalog`, `TestDetail`, `TakeTest`, `Results`, `sanitizeInput`, `SEO_DATA`/`useSEO`, `JsonLd`, `CookieBanner`, `Consultations`, `MentionsLegales`, `Footer`, `App` from the reference table at the top of this plan has a corresponding home in the new files created by Tasks 2–18. If anything was missed, extract it into the most appropriate existing file before deleting.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: wire up react-router routes in App.jsx, remove legacy psychapro.jsx"
```

---

### Task 20: Add vercel.json rewrite for SPA routing

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create the file**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Without this, Vercel serves a 404 for a direct hit or browser refresh on any nested route (e.g. `/tests/phq9`), since there's no actual file at that path in the static build output.

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "fix: add SPA rewrite so nested routes don't 404 on Vercel"
```

---

### Task 21: Manual verification pass

No automated test runner exists in this project (confirmed: no vitest/jest in `package.json`); introducing one is out of scope per the spec. Verify manually with the dev server.

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Vite starts without errors, prints a local URL (e.g. `http://localhost:5173`).

- [ ] **Step 2: Walk every route in the browser**

Check each of the following loads without a console error and shows the expected content:
- `/` — home (hero, how it works, test catalog)
- `/tests` — test catalog only
- `/tests/phq9` — PHQ-9 detail page; check the browser tab title changes to include "PHQ-9"
- `/tests/phq9/passer` — question flow starts; answer all questions
- After the last question: should land on `/tests/phq9/resultats` showing the computed results
- Hard-refresh (F5) on `/tests/phq9/resultats` — results should still show (sessionStorage persisted them), not redirect to `/passer`
- `/tests/does-not-exist` — should redirect to `/tests`, not crash
- `/consultations` — loads
- `/legal/mentions-legales`, `/legal/confidentialite`, `/legal/cgu` — each shows its own distinct section content, and the in-page tab buttons switch the URL
- `/legal/not-a-real-section` — should redirect to `/legal/mentions-legales`
- `/some-random-path` — shows the `NotFound` page
- Click every nav link (desktop + mobile hamburger), footer link, and the home/hero/how-it-works CTA buttons — confirm each navigates to the right URL

- [ ] **Step 3: Verify noindex tags**

In the browser devtools, inspect `<head>` on `/tests/phq9/passer`, `/tests/phq9/resultats`, and `/some-random-path` — each should have `<meta name="robots" content="noindex, nofollow">`. Inspect `/`, `/tests`, `/tests/phq9`, `/consultations`, and the three `/legal/...` pages — each should have `<meta name="robots" content="index, follow">`.

- [ ] **Step 4: Production build check**

Run: `npm run build`
Expected: builds successfully with no errors.

Run: `npm run preview`
Expected: serves the production build; spot-check `/` and one nested route like `/tests/phq9` both load correctly (this uses Vite's own preview server, which does SPA-fallback automatically — the real test of `vercel.json` only happens after deploying to Vercel, called out separately below).

- [ ] **Step 5: Commit (only if verification uncovered fixes)**

If any of the above steps required a code fix, commit it separately with a message describing what was wrong, e.g.:
```bash
git commit -am "fix: <specific issue found during manual verification>"
```

---

### Task 22: Regenerate public/sitemap.xml with real routes

**Files:**
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Replace the sitemap contents**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://monpsy.click/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://monpsy.click/tests</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://monpsy.click/tests/profile5</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/types16</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/emotions</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/phq9</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/gad7</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/epuisement</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/stress</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/attachment</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/estime</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/tests/resilience</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://monpsy.click/consultations</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://monpsy.click/legal/mentions-legales</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://monpsy.click/legal/confidentialite</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://monpsy.click/legal/cgu</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
```

The 10 test slugs (`profile5`, `types16`, `emotions`, `phq9`, `gad7`, `epuisement`, `stress`, `attachment`, `estime`, `resilience`) come directly from the `id` field of each entry in `src/data/tests.js` (Task 3) — cross-check against that file rather than trusting this list blindly, in case a test was added/removed/renamed since this plan was written.

- [ ] **Step 2: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat: regenerate sitemap.xml with real per-test and legal page URLs"
```

---

## After this plan (not part of it)

- Deploying: push the branch/commits to GitHub, let Vercel auto-deploy, then confirm on the live `monpsy.click` domain that `vercel.json`'s rewrite actually prevents 404s on nested routes (Vite's local preview server can mask a missing-rewrite bug that only shows up on Vercel's real static hosting).
- Submitting the updated sitemap to Google Search Console and requesting indexing/re-crawl once deployed.
- Revisiting the `psychapro.fr` canonical-domain switch once its DNS/Vercel setup is complete (tracked separately, see project memory).
