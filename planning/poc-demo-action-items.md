# POC Demo - Action Items

> Distilled from Sajid/Maziar sync call (2026-04-01). Items ordered by priority.

---

## Status Overview

| # | Use Case | Status | Action Needed |
|---|----------|--------|---------------|
| 1 | Personalized Learning Plan (Student) | Partial | Rework into 5-section course flow |
| 2 | Parent Progress Report | Done (needs tweaks) | Add date filter, remove sign-off |
| 3 | Homework/Assessment Generation | Done (has bugs) | Fix topic field + listing bug |
| 4 | AI Grading & Feedback | Done | None |
| 5 | Student Risk Prediction | Done | None |
| 6 | AI Chatbot (Parent Support) | Done | None |
| 7 | Timetable & Resource Allocation (Principal) | Partial | Add teacher view + AI mock actions |

---

## 1. Personalized Learning Plan - Rework

**Current state:** Student "My Plan" page (`app/(dashboard)/student/my-plan/page.tsx`) generates a weekly learning path with focus areas, resources, and milestones. It's a dense dashboard.

**What Sajid wants:** A simple, linear flow:
1. Student types "I need a course on [topic]" (free text input)
2. LLM generates exactly **5 sections** (like Week 1-5 or Section 1-5)
3. Student clicks **Next** through each section sequentially
4. After section 5, flow is **finished** (no other actions needed)

**Action items:**
- [ ] Create a new simplified "Request a Course" flow on the student side (could be a modal or dedicated page)
- [ ] Update the `/api/ai/learning-path` prompt to always return exactly 5 sections with clear titles and content
- [ ] Build a **stepper/wizard UI** (Section 1 of 5 -> Next -> Section 2 of 5 -> ... -> Finish)
- [ ] Hardcode the section count to 5 (do not make it configurable)
- [ ] Keep existing ILP dashboard pages intact (admin side is fine as-is)

**Files to modify:**
- `app/(dashboard)/student/my-plan/page.tsx` (or new sub-route)
- `app/api/ai/learning-path/route.ts` (prompt update)

---

## 2. Parent Progress Report - Tweaks

**Current state:** Working AI-generated reports at `app/(dashboard)/parent/reports/page.tsx`. Uses a "Report Period" dropdown (This Week / This Month / This Term).

**Action items:**
- [ ] Replace the period dropdown with a **date range picker** (from/to date fields)
- [ ] Pass selected dates to the AI prompt so the report covers that specific period
- [ ] Keep the same mock data approach (just vary the prompt text with dates)
- [ ] Remove any sign-off / "Regards" text at the bottom of the generated report (verify prompt doesn't produce this — Sajid mentioned it, check current output)
- [ ] Ensure assignments and comments from the selected date range appear in the report

**Files to modify:**
- `app/(dashboard)/parent/reports/page.tsx`
- `app/api/ai/parent-report/route.ts` (prompt tweak for date range)

---

## 3. Homework/Assessment Generation - Bug Fixes

**Current state:** AI question generation works (`app/(dashboard)/teacher/homework/create/page.tsx`). Two issues flagged:

**Action items:**
- [ ] **Topic field required for AI questions:** When generating description/instructions from title, ensure the topic field is populated and passed to the question generator. The AI question generator needs the topic to produce relevant questions (without it, questions are nonsensical like "7+5" for trigonometry)
- [ ] **Published homework must appear in listing:** Verify that `createHomework()` in the store correctly adds the new homework and it shows up at `/teacher/homework`. (Store code suggests this works — may be a stale bug, re-test)
- [ ] Test end-to-end: create homework -> generate questions -> save as published -> verify it appears in listing

**Files to check:**
- `app/(dashboard)/teacher/homework/create/page.tsx`
- `stores/homework-store.ts`
- `app/(dashboard)/teacher/homework/page.tsx`

---

## 4. AI Grading & Feedback - DONE

No action needed. Grading works end-to-end:
- AI suggest button populates score + feedback
- Auto-advances to next student after saving
- Sajid confirmed: "This is good. We can close grading."

---

## 5. Student Risk Prediction - DONE

No action needed. Already in student profile with AI-generated reports.

---

## 6. AI Chatbot (Parent Support) - DONE

No action needed. Context-aware chatbot works across pages:
- Can answer questions about specific students from on-screen data
- Accurately pulls data (e.g., chapter scores, grades)
- Sajid confirmed: "This is also done."

---

## 7. Timetable & Resource Allocation (Principal Side)

**Current state:** Class-level timetable exists at `app/(dashboard)/class-activities/timetable/page.tsx` with AI auto-optimize for conflict resolution. No teacher-centric view.

**What Sajid wants:**
1. Principal can see **which teacher is where** (teacher-wise timetable view)
2. Overall timetable + per-teacher filter/view (all mock data)
3. **AI recommendations / AI actions** section: mock comments like "AI agent has auto-scheduled [teacher] this week because [reason]" (e.g., "teacher was unavailable")
4. An **"All Teachers" page** similar to the existing "All Students" page

**Action items:**
- [ ] Add an **"All Teachers"** page at `/admin/teachers` (list of all teachers with department, subjects, classes — similar to `/admin/students`)
- [ ] Add **teacher detail page** at `/admin/teachers/[id]` showing teacher profile + their timetable
- [ ] Add a **teacher filter/view** to the existing timetable page or a new tab — filter the weekly grid by teacher to see one teacher's schedule
- [ ] Add an **"AI Actions / Recommendations"** panel (mock) to the timetable page showing things like:
  - "AI auto-scheduled Ms. Fatima for Grade 10 Physics (Mon Period 3) — Mr. Ahmad marked unavailable"
  - "Recommendation: Move Grade 11 Chemistry to Thu Period 5 to reduce room conflicts"
  - These are all hardcoded/mock — no real AI needed
- [ ] Wire the "All Teachers" link into the admin sidebar (`components/layout/sidebar.tsx`)

**Files to modify/create:**
- `app/(dashboard)/admin/teachers/page.tsx` (new)
- `app/(dashboard)/admin/teachers/[id]/page.tsx` (new)
- `components/layout/sidebar.tsx` (add Teachers nav item)
- `app/(dashboard)/class-activities/timetable/page.tsx` (add teacher filter + AI actions panel)
- `data/mock-teachers.ts` (may need additional mock data)

---

## Priority Order for Completion

1. **Homework bug fixes** (item 3) — quick wins, unblock demo flow
2. **Parent report date filter** (item 2) — small tweak
3. **Personalized Learning Plan rework** (item 1) — medium effort, key use case
4. **Timetable + Teachers pages** (item 7) — largest effort, last remaining use case

> Once all items are done, push live and schedule demo with stakeholder.
