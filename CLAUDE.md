# CLAUDE.md

Don't add yourself to the commit authors.
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

UI/UX prototype for **DEWA Academy School Management System** with LLM-powered features. Mock data is used for the UI layer (in-memory / static JSON). Real AI responses come from the `/api/ai/` Next.js API routes using Anthropic Claude or OpenAI. Do not add real authentication or non-AI persistence.

## Commands

```bash
npm run dev       # start dev server (Turbopack) — already running at port 3000
npm run build     # type-check + build
npm run lint      # eslint
```

Adding shadcn components:
```bash
npx shadcn@latest add <component>
```

## Stack

- **React 19 + Next.js 16 (App Router, Turbopack) + TypeScript**
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss` (no `tailwind.config.js`; all theme tokens are CSS custom properties in `app/globals.css`)
- **shadcn/ui** — components live in `src/components/ui/`, added via CLI
- **Zustand** — global state (role store, mock data stores)
- **Recharts** — bundled via shadcn's chart component (`src/components/ui/chart.tsx`)
- **`@anthropic-ai/sdk`** + **`openai`** — LLM providers for API routes

## Routing

Next.js App Router with file-based routing in `app/`:

- `src/app/page.tsx` — role select (unauthenticated root)
- `src/app/(dashboard)/layout.tsx` — reads Zustand role, renders appropriate layout (AdminLayout / TeacherLayout / StudentLayout / ParentLayout), redirects to `/` if no role
- `src/app/(dashboard)/[module]/layout.tsx` — module tab nav layouts (ClassActivitiesLayout, etc.)
- `src/app/(dashboard)/[module]/[tab]/page.tsx` — thin `'use client'` re-export wrappers pointing to `src/views/`
- `src/app/api/ai/` — LLM API routes (server-side, use `@anthropic-ai/sdk` or `openai`)

All `src/app/` page files use the thin wrapper pattern:
```tsx
'use client'
export { ComponentName as default } from '@/views/module/file'
```

**Note:** Page components live in `src/views/` (not `src/pages/` — that name is reserved by Next.js Pages Router).

## Path Alias

`@/` maps to `src/`. Use it for all imports (e.g. `import { Button } from '@/components/ui/button'`).

## Theming

CSS variables are defined in `app/globals.css`. shadcn tokens (`--primary`, `--background`, etc.) are in `oklch()`. DEWA brand colors override these variables. Dark mode is toggled via the `.dark` class (not `prefers-color-scheme`).

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

## General

Do not take screenshots to investigate UI issues. Read source files directly with Grep/Read, or use snapshots. Only use screenshots when all other avenues are tried and failed.
