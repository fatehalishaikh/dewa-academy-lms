# CLAUDE.md

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
