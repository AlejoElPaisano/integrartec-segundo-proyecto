Choose your language / Selecciona tu idioma:
- [English Version](README.md)
- [Versión en Español](README.es.md)

---

# FormForge — Form Validation Laboratory

> Second Integrative Project — IntegrarTEC (June 2026)

**Visual Identity:** Night Lab — dark mode by default, reactor cyan accent (`#06b6d4`), Space Grotesk + JetBrains Mono typefaces, rioplatense voice.

## Chosen Idea

**Idea 17: Form Validation Laboratory**

A tool to build forms with combinable validation rules and see how they respond in real time. Ideal for deeply understanding validation in React.

## Demo

- **Deploy:** [Pending — will be configured before final delivery]
- **Repository:** https://github.com/AlejoElPaisano/integrartec-segundo-proyecto

## Group Members

| Member | Challenge | Responsibility |
|-----------|---------|----------------|
| **MARTINEZ ALEJO** | D1 — Base | Scaffold, dynamic field creation, global store, layout |
| **ORTEGA AYELEN** | D2 — Rule Engine | Combinable rules (required, min, max, email, regex) |
| **RIVOIRA AGUSTINA** | D3 — Messages | Custom error messages per failing rule |
| **VALDIVIEZO GISELE** | D4 — Real-time Validation | Live validation + per-field state + error summary |
| **BRITEZ EMANUEL** | D5 — Form Gallery | Gallery with 20 pre-built templates, design |
| **CALEGARI LUIS** | Testing, corrections, integrations | General testing, bug fixes, integrations |

## Technologies Used

- **React 19** + **React Compiler** (`babel-plugin-react-compiler`)
- **TypeScript** (strict mode + `noUnusedLocals` + `noUnusedParameters`)
- **Vite 6** (bundler + dev server)
- **React Router v7** (SPA routing, with `lazy` + `Suspense`)
- **Zustand v5** + `persist` (global state with localStorage persistence)
- **Tailwind CSS v4** (styles with `@theme` in CSS, no `tailwind.config.js`)
- **Zod 4** (validation engine + single source of truth for types)
- **React Hook Form** + `@hookform/resolvers` (form management)
- **date-fns v4** (date handling, tree-shakeable)
- **@dnd-kit** (drag & drop with keyboard support)
- **lucide-react** (icons)
- **clsx** + **tailwind-merge** (conditional class composition)
- **ESLint 9** (flat config) + **Vitest** (testing)

## Main Features

- Create dynamic forms with configurable fields (label, type, placeholder)
- Add, edit, reorder (drag & drop with keyboard), and delete fields from a form
- Form persistence in localStorage (via Zustand persist)
- Combinable per-field validation rule engine (required, min, max, email, regex)
- Forms built with **React Hook Form + Zod** (dynamic schema from `rules[]`)
- Custom error messages per rule
- **Gallery with 20 pre-built forms**: login, signup, checkout, contact, satisfaction, appointment, event-registration, quote-request, job-application, newsletter-subscription, hotel-reservation, course-enrollment, technical-support, claim-warranty, donation, patient-registration, medical-appointment, product-review, service-review, scholarship-application
- Complete visual customization: colors, fonts, borders, shadows, backgrounds (color/gradient/image), images, emojis, animations
- Live theme preview
- "My Forms" page to search, sort, tag, and manage saved forms
- Import/Export forms as JSON
- Share forms via link (base64 in query string)
- Keyboard shortcuts (Ctrl+Z undo, Ctrl+S save, Ctrl+K command palette)
- Onboarding tour for new users
- Feedback toasts
- Light/dark/system theme
- UI with semantic HTML, ARIA labels, keyboard navigation, skip-to-content

## Project Structure

```
src/
  app/
    router.tsx              # Route configuration (React Router v7, lazy + Suspense)
    providers.tsx           # Global providers (AppProviders + ErrorBoundary + ToastContainer)
    layout.tsx              # Layout with header, nav, main, footer
  features/
    form-lab/               # Domain: Form laboratory
      components/           # Feature UI (HomePage, FormBuilder, FormPreview, MyForms, TemplateGallery, modals)
      hooks/                # useFormLab, useRuleEngine, useHistory
      store.ts              # Global state with Zustand + persist
      schema.ts             # Zod schemas (single source of truth)
      utils.ts              # Pure logic: rule engine, buildFormSchema, helpers
      templates.ts          # Catalog and form creation from templates
      dom-helpers.ts        # DOM side-effect helpers (downloadTextFile)
    form-theme/             # Domain: Form visual customization
      components/           # Feature UI (ThemeDrawer, preview, pickers)
      hooks/                # useFormTheme
      store.ts              # Theme state with Zustand + persist
      schema.ts             # Re-exports the shared theme schema
      utils.ts              # Theme helpers, presets, visual mappers
      dom-helpers.ts        # applyThemeToCssVars, clearThemeCssVars
      presets/              # Predefined theme presets
    settings/               # Domain: User settings (light/dark theme)
    notifications/          # Domain: Toast system (store + hooks/useToast)
    command-palette/        # Domain: Command palette (Ctrl+K)
    onboarding/             # Domain: Guided app tour
    error-pages/            # Domain: 404 + ErrorBoundary fallback
  shared/
    components/ui/          # Generic primitives (Button, Input, Card, Modal, ErrorBoundary, EmptyState)
    hooks/                  # Cross-cutting hooks (useConfirmDialog, useKeyboardShortcut)
    lib/                    # Generic helpers (cn, storage)
  main.tsx                  # Entry point
  index.css                 # Tailwind CSS v4 + @theme tokens + .form-* classes
```

> **Note about types:** there is no `types.ts` in features. Types are automatically derived from the Zod schema via `z.infer<typeof schema>` (skill rule §9). The theme schema (`FormTheme`) lives in `src/features/form-theme/schema.ts` and `form-lab` imports it from there when it needs to type the `theme` field of the form.

## Included Templates

The gallery offers **20 editable starting points**:

| # | Template | Category | Complexity |
|---|----------|----------|------------|
| 1 | Login | accounts | simple |
| 2 | User registration | accounts | intermediate |
| 3 | Checkout | commerce | advanced |
| 4 | Contact form | services | intermediate |
| 5 | Satisfaction survey | feedback | simple |
| 6 | Appointment booking | reservations | intermediate |
| 7 | Event registration | services | advanced |
| 8 | Quote request | services | advanced |
| 9 | Job application | human-resources | advanced |
| 10 | Newsletter subscription | accounts | simple |
| 11 | Hotel reservation | reservations | advanced |
| 12 | Course enrollment | education | intermediate |
| 13 | Technical support request | support | intermediate |
| 14 | Claim or warranty | support | intermediate |
| 15 | Donation | services | intermediate |
| 16 | Patient registration | health | advanced |
| 17 | Medical appointment | health | intermediate |
| 18 | Product review | feedback | intermediate |
| 19 | Service review | feedback | intermediate |
| 20 | Scholarship application | education | advanced |

Each template declares its validations through the `FieldRule` contract from
`schema.ts` (types: `required`, `min`, `max`, `email`, `regex`). D5 preserves those
rules when creating the form; execution in the preview uses the D2 engine
via `buildFormSchema()` + Zod + React Hook Form.

## Usage Instructions

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:5173)
pnpm run dev

# Production build (TypeScript check + Vite build)
pnpm run build

# Standalone type check
pnpm run typecheck

# Preview production build
pnpm run preview

# Tests (Vitest, 141 tests in 7 files)
pnpm test

# Tests in UI mode
pnpm test:ui

# Lint (ESLint 9 flat config)
pnpm run lint
```

### Stack and Configuration

- **Import alias:** `@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`)
- **React Compiler:** enabled via `babel-plugin-react-compiler` in `vite.config.ts`
- **Tailwind v4:** configured with `@tailwindcss/vite`, no `tailwind.config.js`; tokens in `src/index.css` with `@theme`

## Deploy

- **Functional deploy:** [Pending — will be configured before final delivery]
- **Repository:** https://github.com/AlejoElPaisano/integrartec-segundo-proyecto

> **Important for SPA:** When deploying, configure SPA redirect so that React Router routes work on reload. On Vercel, add `vercel.json` with `rewrites`; on Netlify, a `public/_redirects` with `/* /index.html 200`.

## How to Contribute (for the team)

### Branch convention

```
feat/d1-polish    # D1 improvements (I1)
feat/d2-rules     # Rule engine (I2)
feat/d3-messages  # Error messages (I3)
feat/d4-realtime  # Real-time validation (I4)
feat/d5-gallery   # Form gallery (I5)
```

### Commit convention

Use [Conventional Commits](https://www.conventionalcommits.org):

- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — refactoring without changing behavior
- `docs:` — documentation
- `chore:` — maintenance tasks
- `test:` — tests

**Example:** `feat(d2): add regex rule validation engine`

> **Tip:** When integrating PRs to `develop`, use **squash-merge** to keep history clean and avoid merge commits that don't follow Conventional Commits.

### Public contracts

Types shared between members are in `src/features/form-lab/schema.ts`:

- `FieldRule` — validation rule type
- `FormField` — form field with its `rules[]`
- `FieldType` — input types (`text`, `email`, `number`, `password`, `textarea`, `date`)

The theme schema (`FormTheme`) lives in `src/features/form-theme/schema.ts` because it's that feature's domain; `form-lab` imports it to type the `theme` field of the form.

**Rule:** do not redefine these types in your own file. Import them from the official schemas.

### Before starting your challenge

1. Create your branch from `develop`: `git checkout -b feat/dX-your-challenge`
2. Make sure `pnpm run lint` and `pnpm run typecheck` pass cleanly before committing
3. Make small and frequent PRs; avoid touching files from other challenges

## Challenges (D1–D5)

| Challenge | Responsible | Description | Dependencies | Status |
|---------|-------------|-------------|--------------|--------|
| D1 | Alejo Martínez | Scaffold + dynamic field creation + global store | — | ✅ Complete |
| D2 | Ayelén Ortega | Combinable per-field rule engine | D1 | ✅ Complete |
| D3 | Agustina Rivoira | Custom error messages per failing rule | D2 | ✅ Complete |
| D4 | Gisele Valdiviezo | Real-time validation + per-field state + summary | D2 | ✅ Complete |
| D5 | Emanuel Britez | Gallery of 20 pre-built forms | D1 | ✅ Complete |
