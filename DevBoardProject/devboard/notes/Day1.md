# DevBoard — Day 1: Project Setup, Routing & Layout Shell

## Goal

Build the architectural skeleton every later feature plugs into: a Vite + React + TypeScript app with real routing and a persistent layout shell (sidebar + topbar + content area) — the shape shared by Linear, Grafana, PagerDuty, and every enterprise SaaS product.

---

## Concepts

### Vite over CRA
CRA is effectively dead — no updates, slow webpack-based bundling. Vite serves native ES modules in dev (near-instant start, instant HMR) and uses Rollup for production builds. Since DevBoard is a client-only SPA behind fake auth (no SSR needed), Vite is the right tool — a meta-framework like Next/Remix would add unneeded complexity.

### Feature-based structure (not type-based)
Type-based (`components/`, `hooks/`, `services/`) feels organized at 10 files but collapses at 200 — every change touches multiple folders, and unrelated features get mixed together.

Feature-based groups by domain instead:
```
features/incidents/{components,hooks,api,types}
features/dashboard/{components,hooks,api,types}
```
"Everything about incidents" lives in one place. Deleting a feature = deleting a folder. `shared/` holds only things used by 2+ features — don't put things there prematurely.

**Rule of three:** duplicate first, extract to `shared/` once a pattern repeats 3 times. Premature abstraction is worse than duplication.

### React Router: nested routes & layout routes
A **layout route** renders a persistent shell and an `<Outlet />` where child routes render — this is *not* rendering `<Sidebar/>` inside every page (which causes duplication, remount flicker, and drift risk).

```
Route: "/" (Layout)
  ├── index → Dashboard
  ├── "incidents" → IncidentsList
  └── "analytics" → Analytics
```

Mental model: layout routes are React composition, not URL config. `<Layout><Outlet/></Layout>` is structurally the same as `<Layout><Dashboard/></Layout>` — the router just decides what fills the hole. Sidebar/Topbar never remount on navigation — only `<Outlet/>` content swaps.

### `Link` vs `NavLink`
Both render the same `<a>` tag and do client-side navigation. `NavLink` is `Link` plus a `className`/`style` function receiving `{ isActive, isPending }` from the router's location match.

**Use `NavLink`** for persistent nav elements (sidebars, tabs, breadcrumbs) where highlighting current location matters.
**Use plain `Link`** anywhere "is this the current page" has no visual meaning — table row links, "view details" links, footer links, links in body text.

### The `end` prop
Without `end`, React Router treats a path as a **prefix match** — `/` would match (and highlight as active) `/incidents`, `/settings`, etc., since every path starts with `/`. `end` forces an exact match. Only needed on the root `/` link; other paths (`/incidents`, `/analytics`) don't need it since they aren't prefixes of each other.

### URL-as-state (preview of Day 9)
Linear's URLs look like `linear.app/{workspace}/issue/{id}/{slug}` — the URL encodes *which issue is open*, not just page location. This is a deliberate architecture choice: refresh, share, and back/forward all work for free with zero extra state management. DevBoard will do the same with `/incidents/:id` on Day 9.

### TypeScript path aliases
Configured `@/` → `src/` from day one. Without this, deep imports look like `../../../../shared/components/ui/Button` — fragile and unreadable. Retrofitting aliases later means rewriting every import in the project.

### Common mistakes to avoid
- All routes in one giant file instead of colocating near features (we're intentionally centralizing routes in `App.tsx` for now since there are only 3–4 flat routes — see **Routing evolution** below)
- Hardcoded sidebar list instead of data-driven (`NAV_ITEMS` array)
- Skipping TypeScript strict mode "to move faster"

---

## Routing evolution (why today's approach will change later)

Today, `App.tsx` **centralizes** all routes — one file owns all routing knowledge. Fine now, with 3–4 flat routes.

By **Day 9**, `incidents` becomes a list + detail (`/incidents`, `/incidents/:id`) — nested. At that point `App.tsx` shouldn't need to know the internals of the incidents feature (same type-based-vs-feature-based problem, applied to routes). We'll **colocate** each feature's own routes inside its own folder (`features/incidents/routes.tsx`), and `App.tsx` will just mount them without knowing what's inside. This wasn't done today because there's nothing to colocate yet with only flat routes — doing it now would be over-engineering.

---

## Folder Structure (after Day 1)

```
devboard/
├── src/
│   ├── app/
│   │   ├── App.tsx           # Router setup
│   │   └── Layout.tsx        # Sidebar + Topbar + Outlet shell
│   ├── features/
│   │   ├── dashboard/pages/DashboardPage.tsx
│   │   ├── incidents/pages/IncidentsPage.tsx
│   │   ├── analytics/pages/AnalyticsPage.tsx
│   │   └── settings/pages/SettingsPage.tsx
│   ├── shared/
│   │   └── components/{Sidebar.tsx, Topbar.tsx}
│   ├── index.css
│   └── main.tsx
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Implementation Summary

1. Scaffolded with `npm create vite@latest devboard -- --template react-ts`, installed `react-router-dom`
2. Configured `@/` path alias in both `vite.config.ts` (`resolve.alias`) and `tsconfig.json` (`baseUrl` + `paths`)
3. Built data-driven `Sidebar` (`NAV_ITEMS` array → `.map()`, `NavLink` with `isActive` render prop, `aria-hidden` on decorative icons)
4. Built `Topbar` (header bar, user avatar placeholder with `aria-label`)
5. Built `Layout` — composition root: `<Sidebar/>` + `<Topbar/>` + `<main><Outlet/></main>`
6. Created placeholder pages for Dashboard, Incidents, Analytics
7. Wired `BrowserRouter` + nested `<Route>`s under the Layout route in `App.tsx`

**Linter decision:** ESLint over Oxlint — Oxlint is faster but its plugin ecosystem (React hooks rules, `jsx-a11y`, TanStack Query rules) is less mature as of mid-2026. Since accessibility and hooks-correctness are deliberately being built as habits throughout this course, ESLint's more complete rule coverage wins.

**npm audit note:** A high-severity React Router advisory (RSC Mode CSRF bypass) appeared in `npm audit`. Confirmed it doesn't apply — the vulnerable path only affects React Server Components mode with server actions; DevBoard uses client-only `BrowserRouter` with no RSC. Left as-is rather than running `audit fix --force`, which would have downgraded `react-router-dom` unnecessarily.

**Unstyled appearance is expected:** Tailwind isn't installed until Day 2, so `className` utility classes currently do nothing — the browser is rendering default HTML styling (underlined blue nav links, stacked blocks). Structure was verified correct: Sidebar/Topbar persist across navigation, only the `<Outlet/>` content swaps — confirming the nested-route Layout pattern works.

---

## Senior Engineer Notes

- `pages/` (not `views/`/`screens/`) matches React Router / Next.js / Remix convention — keeps resume vocabulary aligned with what interviewers expect
- Don't create `hooks/`, `api/`, `types/` folders inside features until there's an actual file for them — empty speculative folders are a smell
- Accessibility bolted in from day one (`aria-hidden`, `aria-label`) — far cheaper than retrofitting across 30 days of components later
- Watch for hardcoded route strings scattered across files as the app grows — by Day 9 we'll centralize a `routes.ts` constants file once the pain is real, rather than pre-building it now

---

## Mini Challenge — Settings Nav Item

**Task:** Add a `Settings` nav item at `/settings` with its own page component, wired into `NAV_ITEMS` and `App.tsx`.

**Result: Completed correctly.**
- `SettingsPage` created following the same shape as other placeholder pages
- Correctly nested under the `Layout` route (inherits Sidebar/Topbar automatically)
- Added to `NAV_ITEMS` with `end` correctly *omitted* (only `/` needs `end: true`) — correct instinct, not flagged as a mistake
- Consistent with existing pattern, no unrelated code touched

No corrections needed — this was a clean, correct extension of the existing data-driven structure.

---

## Interview Questions — Answers & Review

**1. What problem does a layout route solve that rendering `<Sidebar/>` in every page doesn't?**

> "We don't have to repeat the code. Sidebar not flickers, and state of sidebar retains also."

**Review: Correct raw understanding, needs sharper interview packaging.** The deeper concept underneath "no repeat/no flicker/state retained" is **drift risk**: this isn't a runtime bug, it's a maintenance-decay problem. If `<Sidebar/>` were duplicated inside every page, nothing crashes when someone adds a new page and forgets to include it (or copy-pastes an outdated version) — the pages just silently stop looking consistent over time because nothing structurally enforces it. A layout route makes that divergence *impossible*, not just less likely, since there's exactly one render location for persistent chrome. Interview-ready phrasing: *"A layout route establishes one render location for persistent chrome, so shared UI can't drift out of sync, and its internal state naturally survives navigation since it isn't remounting."*

**2. Why does `NavLink` need the `end` prop on some routes but not others?**

> "What changes is the active-link behavior, not the route itself. Without `end`, React Router treats the Dashboard path `/` as a prefix match, so it can look 'active' for other URLs like `/incidents` or `/settings` as well. In other words, the Dashboard tab starts to appear selected on pages where it should not be. The `end` prop makes the match exact, so only the true dashboard URL activates that link."

**Review: Correct.** Precisely worded — "prefix match" is exactly the right mental model, and the failure mode (Dashboard staying highlighted everywhere) was correctly identified, not just the mechanism.

**3. What's the difference between `BrowserRouter` and `HashRouter`, and when would you choose each?**

*(Answered as "don't know anything.")*

**Review — for reference:** `BrowserRouter` uses the real URL path (`/incidents`) via the HTML5 History API — clean URLs, but requires the server to serve `index.html` for any path (otherwise refreshing `/incidents` 404s, since no file exists at that path). `HashRouter` uses a `#` (`/#/incidents`) — everything after `#` is client-side only, works on any static host with zero config, but looks dated and hurts SEO. **We use `BrowserRouter`** — correct choice for any real app on properly configured hosting (Vercel handles this correctly). `HashRouter` is really only for constrained static hosts you can't configure.

**4. Explain feature-based vs type-based folder structure — what breaks down with type-based structure as an app scales?**

> "In type based structure, when app scales it will become hard to find component of the particular feature and if we need to change a component of one feature then it will touches 3 to 4 files."

**Review: Correct.** Good, concrete framing.

**5. What does `<Outlet />` actually do under the hood, conceptually?**

> "Its just a placeholder, where react router renders the required component based on url."

**Review: Correct but thin.** Deepen it: `<Outlet/>` isn't magic — React Router looks at the current URL, matches it against the route tree, and renders the matched child element at the exact JSX location where `<Outlet/>` sits in the parent. Conceptually it's just "conditional children," implemented by the router instead of manually writing `{condition && <Component/>}` yourself.

**6. Why did we configure path aliases now instead of later?**

> "Because later we need to change imports in each file."

**Review: Correct, but there's a sharper reason.** Doing it later means changing imports in **every file that exists by then** — potentially hundreds by Day 20 — versus 7 files today. The cost isn't just "annoying," it scales directly with how many files exist at the time you make the change. That's the real argument for front-loading structural decisions.

**7. What's a scenario where premature use of `shared/` for a component becomes a liability?**

> "We need to follow YAGNI... move to shared only when 2+ uses are there."

**Review: Answered with the rule-of-three definition, not a scenario — this question wanted a concrete example.** Example: you build an `IncidentCard` for the incidents feature, then need something visually similar for a `NotificationCard` in Week 2. If you abstract to one shared `<Card variant="incident"|"notification">` after seeing it used only *twice*, you often guess wrong about what actually varies — ending up with a component full of conditional props trying to serve two masters. That's the actual liability: premature abstraction based on too little evidence, not just "an extra folder."

**8. Why is Vite faster in dev than a Webpack-based tool like CRA?**

> "Hot Module Reloading (HMR), fast, also CRA is dead there is no updates and slow."

**Review: Correct.**

**9. What's the "rule of three" and how does it apply to extracting shared code?**

> "We need to follow YAGNI: You're not gonna need it — move a component to shared only when 2+ uses of it are there."

**Review: Correct — right target this time** (note: precisely it's "3+", not "2+" — extract once a pattern repeats a *third* time, not the second).

**10. If two features needed nearly identical but not-quite-the-same tables, would you abstract them into one shared component immediately? Why or why not?**

> "No, we need to follow YAGNI... move to shared only when 2+ uses are there."

**Review: Right instinct ('No'), reasoning needs to be scenario-specific.** Two "nearly identical but not-quite" tables is exactly the Q7 trap — forcing one shared `<Table>` too early produces a component riddled with `if (variant === 'incidents')` branches, which is *harder* to maintain than two separate simpler tables. Wait for a third near-identical table before abstracting — at that point the real shared shape (columns config, sorting, pagination) becomes obvious instead of guessed.

**Overall assessment:** Q4, Q6, Q8, Q9 solid. Q1 and Q5 correct but need sharper interview phrasing (stated above). Q7 and Q10 show the rule of three is memorized but not yet applied to a concrete scenario — worth practicing, since "knowing the rule" and "spotting when you're about to violate it" are different skills, and interviews test the second one. Q3 needs review (notes above).

---

## Homework — Answers & Review

**1. Remove the `end` prop from Dashboard's `NavLink` — what breaks, and why?**

> "What changes is the active-link behavior, not the route itself. Without `end`, React Router treats the Dashboard path `/` as a prefix match, so it can look 'active' for other URLs like `/incidents` or `/settings` as well. In other words, the Dashboard tab starts to appear selected on pages where it should not be. The `end` prop makes the match exact, so only the true dashboard URL activates that link."

**Review: Correct.** (Same answer as interview Q2 — both correctly answered.)

**2. `NavLink` vs plain `Link` — when would you use plain `Link` instead?**

> "Link = 'go to this page' NavLink = 'go to this page and also know whether it is the current page'"

**Review: Correct but surface-level.** The deeper mechanism: both render the same `<a>` tag and do client-side navigation — `NavLink` is `Link` plus a `className`/`style` function receiving `{ isActive, isPending }`. The real answer to "when to use plain `Link`" is: anywhere "is this the current page" has no visual meaning — table row links, "view details" links, footer links, links inside body text. Using `NavLink` there just carries unused active-state logic for no reason.

**3. Look at Linear's URL structure and compare it to what we're building.**

> "nested routes"

**Review: Too thin — this needed more.** "Nested routes" doesn't actually describe what Linear's URLs do. Linear's URLs look like `linear.app/{workspace}/issue/{id}/{slug}` — the URL encodes *state* (which issue is open), not just location. This is the URL-as-state pattern: refresh, share, and back/forward all work for free with zero extra state management. Directly previews Day 9, where `/incidents/:id` will do the same thing for incident detail routing.

**Overall homework assessment:** Q1 and Q2 show real understanding. Q3 was rushed — worth noting since the pattern of skimming homework shouldn't become the default as bootcamps compound.

---

## Git Commit

```
feat(app): scaffold project with routing and layout shell

- set up Vite + React + TypeScript with @ path aliases
- add nested route layout (Sidebar + Topbar + Outlet)
- add placeholder pages for dashboard, incidents, analytics, settings
```

---

## Day Summary

Built the architectural skeleton: routing, a persistent layout shell using nested routes and `<Outlet/>`, and a feature-based folder structure with path aliases configured correctly from the start. Confirmed ESLint over Oxlint for the linter (ecosystem maturity on hooks/a11y rules). Resolved an `npm audit` false alarm (React Router RSC-mode CSRF advisory doesn't apply to client-only `BrowserRouter` usage). Completed the Settings mini-challenge cleanly. Every day going forward plugs into this shape rather than fighting it.

## Next: Day 2

Install Tailwind CSS and shadcn/ui, build the actual design system foundation (Button, Card, Badge, Input), and build the `<EngineeringNote>` component — a `devMode` toggle (Zustand) + hover/click badges + side drawer explaining "why this approach" — reusable infrastructure that gets threaded into architecturally significant decisions from here forward.