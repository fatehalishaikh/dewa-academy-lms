# CLAUDE.md

Don't add yourself to the commit authors.
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

UI UX only prototype for **DEWA Academy School Management System** — no backend, no API calls, all data is mocked in-memory or via static JSON. Do not add real authentication, network requests, or persistence.

## Commands

```bash
npm run dev       # start dev server, don't start the server, its running at port 5173 already
npm run build     # type-check + build
npm run lint      # eslint
```

Adding shadcn components:
```bash
npx shadcn@latest add <component>
```

## Stack

- **React 19 + Vite + TypeScript**
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin (no `tailwind.config.js`; all theme tokens are CSS custom properties in `src/index.css`)
- **shadcn/ui** — components live in `src/components/ui/`, added via CLI
- **React Router v7** — client-side routing only
- **Zustand** — global mock state store
- **Recharts** — bundled via shadcn's chart component (`src/components/ui/chart.tsx`)

## Path Alias

`@/` maps to `src/`. Use it for all imports (e.g. `import { Button } from '@/components/ui/button'`).

## Theming

CSS variables are defined in `src/index.css`. shadcn tokens (`--primary`, `--background`, etc.) are in `oklch()`. DEWA brand colors should be applied by overriding these variables. Dark mode is toggled via the `.dark` class (not `prefers-color-scheme`).

## Module Scope

The system covers 13 modules per `planning/initial-plan.md`:
1. Registration & Admission
2. Class Activities
3. Individual Learning Plan (ILP)
4. Whiteboard Interaction
5. Assessments & Exams
6. Student Portal
7. Case Management
8. Medical Module
9. Curriculum & Lesson Planner
10. Reporting Module
11. Student Profile
12. Teacher Profile
13. Academic Calendar

Design reference: Sana Labs (`planning/initial-docs/sana-design-guidelines.md`), DEWA brand (`planning/initial-docs/dewa-brand-guidelines.md`).

## Recharts Chart Standards

Every chart `<Tooltip>` must use these props — no exceptions:

```tsx
contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
itemStyle={{ color: '#cbd5e1' }}
// Bar charts:
cursor={{ fill: 'rgba(255,255,255,0.05)' }}
// Area/Line charts:
cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
```

Axis ticks: `tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false}`

Data fields passed to chart `data` prop must never be named `style` — React will throw a runtime error if a data item property named `style` contains a string (Recharts spreads data item props onto SVG `<path>` elements). Rename to `learningStyle`, `type`, etc.

SVG gradient `id` values must be unique across the entire app — widgets rendered on the same page share one SVG namespace. Use widget-specific prefixes (e.g. `ilpCompletionGrad`, not `completionGrad`).
