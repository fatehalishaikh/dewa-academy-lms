# DEWA Academy LMS: From Dashboards to Actionable Screens

## Context

The prototype currently has 5 modules (Class Activities, Assessments, ILP, Curriculum, Registration) — all dashboard/analytics views. There's a single hardcoded admin persona, no role system, no shared student data model, and no screens for "doing things."

The goal: add role-based experiences (Student, Parent, Teacher, Admin) with actionable screens — homework creation, grading, AI tutoring, student analysis — plus enrich the 3 existing dashboard-only modules (Class Activities, Assessments, Curriculum) with sub-pages and interactive flows.

## Session Breakdown (11 sessions)

---

### Session 0: Foundation — Shared Data + Role System + App Shell

**The critical session everything else depends on.**

**Shared data models** (new files in `src/data/`):
- `mock-students.ts` — canonical `Student` type (id, name, initials, emiratesId, gradeLevel, section, parentId, status). 12-15 students across Grade 9A/9B/10A/10B/11A/11B
- `mock-teachers.ts` — `Teacher` type (id, name, subjects[], classIds[], department). 4-5 teachers including Dr. Sarah Ahmed
- `mock-parents.ts` — `Parent` type (id, name, childIds[]). 8-10 parents linked to students
- `mock-classes.ts` — `AcademyClass` type (id, name, subject, teacherId, studentIds[], schedule). 8-10 classes

**Role store** — `src/stores/role-store.ts`:
- Zustand store: `{ role: 'teacher' | 'admin' | 'student' | 'parent' | null, personId: string | null }`
- Helper hooks: `useCurrentStudent()`, `useCurrentTeacher()`, `useCurrentParent()`

**Role selection landing page** — `src/pages/role-select.tsx`:
- Four cards: Student, Parent, Teacher, Administrator
- Each card shows a persona picker (dropdown/avatar grid of people for that role)
- Sets role store + navigates into that experience

**App shell refactor** — `src/App.tsx` + layout components:
- `role === null` → full-screen role selector (no sidebar)
- `role === 'teacher'` → TeacherLayout with teacher sidebar: My Classes, Homework, Gradebook, Students, Class Activities, Curriculum, Lesson Planner
- `role === 'admin'` → AdminLayout with admin sidebar: all existing modules (Registration, Assessments, ILP, Class Activities, Curriculum, Reports) + Student Roster + Teacher Management
- `role === 'student'` → StudentLayout with student sidebar: Dashboard, My Assignments, My Grades, AI Tutor, Schedule
- `role === 'parent'` → ParentLayout with parent sidebar: Overview, Grades, Attendance, Messages
- "Switch Role" button visible in all layouts

**Key files to modify:** `src/App.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/app-layout.tsx`

**Routes:** `/` becomes role selector; existing module routes remain accessible to admin (and some shared with teacher); student routes under `/student/*`; parent routes under `/parent/*`

---

### Session 1: Teacher — Homework Creation & Assignment Management

**Mock data** — `src/data/mock-homework.ts`:
- `Homework` type (id, title, description, classId, teacherId, dueDate, status: draft/published/closed, totalPoints, aiGenerated)
- `Submission` type (id, homeworkId, studentId, submittedDate, status: submitted/late/graded/not-submitted, grade?, feedback?)
- 8-10 homework items, 30-40 submissions

**Pages** (under `src/pages/teacher/homework/`):
- **List page** (`index.tsx`) — table/card view of assignments for current teacher's classes, filter by class/status, stats row, "Create New" button
- **Create form** (`create.tsx`) — title, description (rich textarea), class selector (from teacher's classes), due date, points, file attachment mock. "AI Generate" button fills description with mock AI content. Save as draft or publish
- **Detail page** (`[id].tsx`) — homework details + submissions table (student, status, date, grade). Links to grading

**Routes:** `/teacher/homework`, `/teacher/homework/create`, `/teacher/homework/:id`

---

### Session 2: Teacher — Grading Interface + Gradebook

**Grading page** — `src/pages/teacher/homework/grade/[submissionId].tsx`:
- Split view: left = student submission content, right = grading form (score, rubric checklist, feedback textarea)
- "AI Suggest Grade" button populates score + feedback
- Prev/next student navigation

**Gradebook page** — `src/pages/teacher/gradebook/index.tsx`:
- Matrix view: rows = students, columns = assignments, cells = color-coded grades
- Filter by class dropdown (teacher's classes only)
- Click cell → jump to grading page
- Summary row (class averages) + summary column (student averages)

**Homework store** — `src/stores/homework-store.ts`:
- Zustand store managing homework + submissions so grading persists within session
- Actions: `gradeSubmission()`, `createHomework()`, `updateHomeworkStatus()`

**Routes:** `/teacher/homework/grade/:submissionId`, `/teacher/gradebook`

---

### Session 3: Teacher — Single Student Analysis + Class View

**My Classes page** — `src/pages/teacher/classes/index.tsx`:
- Grid of teacher's assigned classes
- Each card: class name, subject, student count, next session time, average grade
- Click → class detail

**Class detail page** — `src/pages/teacher/classes/[id].tsx`:
- Class header (subject, schedule, room)
- Student list for that class with grades per assignment
- Attendance overview for the class
- Links to individual student analysis

**Student analysis page** — `src/pages/teacher/students/[id].tsx`:
- Header: avatar, name, grade, section
- Tabbed layout:
  - **Overview** — key stat cards (GPA, attendance, risk level, ILP status)
  - **Grades** — all classes with grades per assignment (Student → Class → Grade drill-down)
  - **Attendance** — calendar heatmap (present/absent/late by day, 30 days)
  - **ILP** — learning style, pathway stage, goals, progress
  - **Notes** — timeline of teacher notes, behavioral incidents

**Mock data** — `src/data/mock-student-profiles.ts`:
- Per-student grade history linked to shared classes
- Daily attendance records (30 days)
- Behavior/notes entries

**Routes:** `/teacher/classes`, `/teacher/classes/:id`, `/teacher/students/:id`

---

### Session 4: Enrich Class Activities Module

**Currently:** Single dashboard page with 4 widgets (timetable, attendance, lesson plans, engagement). Needs actionable sub-pages.

**Convert to multi-page module** (follow ILP/Registration tab-nav pattern):

- **Dashboard tab** — keep existing widgets as the overview/dashboard tab
- **Timetable Management** (`class-activities/timetable`) — full-page timetable grid. Drag-and-drop class blocks (mock). Conflict detection panel. Room/teacher allocation view. "Auto-optimize" AI button (mock rearrangement)
- **Attendance Marking** (`class-activities/attendance`) — select class from dropdown → student list with present/absent/late toggles per student. Date selector. Bulk mark buttons. "AI Verify" button (mock facial recognition result). Save attendance → updates stats
- **Lesson Plan Builder** (`class-activities/lessons`) — list of lesson plans with status (draft/approved/delivered). Click to view/edit. Create new: form with objectives, activities, materials, duration, differentiation notes. "AI Suggest" button generates lesson content. Timeline view of planned vs delivered lessons
- **Engagement Tracking** (`class-activities/engagement`) — per-class student participation log. Add participation notes per student (raised hand, answered question, disruptive). Engagement score auto-calculation. Flag at-risk students with one click
- **Communications** (`class-activities/communications`) — class announcements composer. Send to class/all/individual. Notification history log. Template selector

**Attendance store** — `src/stores/attendance-store.ts`:
- Zustand store for in-session attendance marking persistence

**Key files to modify:** `src/pages/class-activities.tsx` → refactor to `src/pages/class-activities/` directory with layout + sub-pages

**Routes:** `/class-activities/dashboard`, `/class-activities/timetable`, `/class-activities/attendance`, `/class-activities/lessons`, `/class-activities/lessons/create`, `/class-activities/engagement`, `/class-activities/communications`

---

### Session 5: Enrich Assessments Module

**Currently:** Single dashboard page with 5 widgets. Needs exam creation, question bank, and grading flows.

**Convert to multi-page module:**

- **Dashboard tab** — keep existing widgets as overview
- **Question Bank** (`assessments/question-bank`) — searchable/filterable table of questions. Tag by topic, difficulty, type (MCQ/essay/matching). Create new question form. Bulk import mock. "AI Generate Questions" button → generates 5 questions for a topic
- **Create Exam** (`assessments/create-exam`) — multi-step wizard: (1) exam details (title, class, date, duration, type: formative/summative/diagnostic), (2) add questions from bank (search + drag or checkbox), (3) set rules (time limit, attempts, randomization, passing score), (4) review + publish. "Auto-generate Exam" AI button builds entire exam from topic selection
- **Exam Schedule** (`assessments/schedule`) — calendar view of upcoming exams. Conflict detection (room/teacher/student overlaps). Publish schedule with notification mock
- **Grading Queue** (`assessments/grading`) — list of exams pending grading. Click exam → see submissions. Individual grading view with rubric, AI auto-grade for MCQs, manual grade for essays. "AI Suggest" for essay grading
- **Results & Feedback** (`assessments/results`) — per-exam results view. Grade distribution chart. Per-student breakdown. Generate feedback button (AI mock). Export results (mock)

**Key files to modify:** `src/pages/assessments.tsx` → refactor to `src/pages/assessments/` directory

**Routes:** `/assessments/dashboard`, `/assessments/question-bank`, `/assessments/create-exam`, `/assessments/schedule`, `/assessments/grading`, `/assessments/grading/:examId`, `/assessments/results`, `/assessments/results/:examId`

---

### Session 6: Enrich Curriculum Module

**Currently:** Single dashboard page with 5 widgets. Needs lesson plan builder, standards mapping, and resource management.

**Convert to multi-page module:**

- **Dashboard tab** — keep existing widgets as overview
- **Curriculum Builder** (`curriculum/builder`) — tree view of curriculum structure: Program → Course → Unit → Lesson. Click node to expand/edit. Add/reorder nodes. Each node has: title, description, learning objectives, standards alignment, duration. "AI Suggest Structure" button generates unit outline
- **Standards Mapping** (`curriculum/standards`) — two-column mapping view: left = curriculum items, right = standards (KHDA/MOE). Drag to link. Coverage heatmap showing which standards are covered/gaps. Filter by subject/grade
- **Lesson Plan Templates** (`curriculum/templates`) — template library. Create/edit templates with sections: objectives, warm-up, main activity, assessment, differentiation, resources. Clone template to create new lesson plan. "AI Enhance" button adds differentiation strategies
- **Resource Library** (`curriculum/resources`) — upload area (mock drag-and-drop). Resource table: name, type (video/doc/quiz/interactive), subject, grade, upload date. Tag and categorize resources. Link resources to specific lessons/units
- **Review & Approval** (`curriculum/review`) — workflow board (Kanban-style): Draft → Under Review → Approved → Published. Curriculum items with reviewer comments. Approve/reject actions with feedback form

**Key files to modify:** `src/pages/curriculum.tsx` → refactor to `src/pages/curriculum/` directory

**Routes:** `/curriculum/dashboard`, `/curriculum/builder`, `/curriculum/standards`, `/curriculum/templates`, `/curriculum/templates/create`, `/curriculum/resources`, `/curriculum/review`

---

### Session 7: Student Experience — Dashboard + Assignments + Grades

**Student dashboard** — `src/pages/student/dashboard.tsx`:
- Welcome header with name + date
- Stats: upcoming assignments, GPA, attendance streak, ILP progress
- Today's schedule (classes with times/rooms/teachers)
- Upcoming deadlines (next 5 due)
- Recent grades (last 3)

**My Assignments** — `src/pages/student/assignments.tsx`:
- Tabs: Upcoming / Submitted / Graded
- Assignment cards: title, class, due date, status badge, points

**Assignment detail** — `src/pages/student/assignments/[id].tsx`:
- Full description, due date, points
- Submit action: textarea + file upload mock
- If graded: shows grade + feedback + AI feedback
- Status timeline: assigned → submitted → graded

**My Grades** — `src/pages/student/grades.tsx`:
- Per-class accordion with all assignments + grades
- Overall GPA at top
- GPA trend line chart (Recharts)

**Routes:** `/student/dashboard`, `/student/assignments`, `/student/assignments/:id`, `/student/grades`

---

### Session 8: Student — AI-Assisted Learning Screen

**AI Tutor page** — `src/pages/student/ai-tutor.tsx`:
- Split layout: left = subject selector + topic tree, right = learning area
- Full-page chat-style interface (richer than floating chatbot)
- **Explain Mode**: select topic → AI gives explanation with steps, diagrams (mock), examples
- **Practice Mode**: AI generates question → student answers → AI gives feedback with correct answer
- **Progress sidebar**: topics mastered (checkmarks), streak, recommended next, time spent today

**Mock data** — `src/data/mock-ai-tutor.ts`:
- Pre-scripted conversation flows per topic (Math, Physics, English)
- Practice question bank (5-10 per subject)
- Topic mastery data per student

**AI Tutor store** — `src/stores/ai-tutor-store.ts`:
- Conversation history, current topic, mastery state
- Simulated AI response generation with delays

**Routes:** `/student/ai-tutor`, `/student/ai-tutor/:subject`

---

### Session 9: Parent Experience

**Parent dashboard** — `src/pages/parent/dashboard.tsx`:
- Child selector (if multiple children)
- Overview cards: GPA, attendance rate, upcoming assignments, unread messages
- Recent activity timeline: grades received, submissions, attendance events
- Risk indicators / teacher flags

**Child's Grades** — `src/pages/parent/grades.tsx`:
- Read-only version of student grades with parent-friendly language
- Grade trend chart, per-class breakdown

**Attendance** — `src/pages/parent/attendance.tsx`:
- Calendar view with color-coded days (present/absent/late/excused)
- Summary stats: total days, present %, late count

**Messages** — `src/pages/parent/messages.tsx` + `messages/[id].tsx`:
- Inbox (from teachers/admin), read/unread, reply mock, compose new

**Mock data** — `src/data/mock-messages.ts`:
- 8-10 messages (mix of automated attendance alerts + manual teacher messages)

**Routes:** `/parent/dashboard`, `/parent/grades`, `/parent/attendance`, `/parent/messages`, `/parent/messages/:id`

---

### Session 10: Polish + Cross-linking + Integration

- Refactor existing mock data files (class-activities, assessments, ilp, curriculum, registration) to reference shared student/class IDs from Session 0
- Cross-navigation: click student name anywhere → student analysis; click class → class view
- Update chatbot `PAGE_NAMES` map + make it role-aware (different prompts per role)
- Enable disabled sidebar items
- Admin-specific views: admin sees all teachers' classes/homework, admin dashboards show school-wide stats vs teacher sees only their own
- Teacher dashboard landing page with action cards: "X submissions to grade", "Create Homework", upcoming classes today

---

## Role Access Summary

| Feature | Teacher | Admin | Student | Parent |
|---------|---------|-------|---------|--------|
| Homework CRUD | Own classes | View all | View/submit own | View child's |
| Gradebook | Own classes | View all | View own grades | View child's |
| Student Analysis | Own students | All students | — | Own child |
| Class Activities | Own classes (full) | All (dashboard + config) | — | — |
| Assessments | Create/grade own | All + analytics | Take exams | View results |
| Curriculum | View + lesson plans | Full CRUD + approval | — | — |
| Registration | — | Full access | — | — |
| ILP | View own students | Full access | View own | View child's |
| AI Tutor | — | — | Full access | — |
| Messages | Send/receive | Send/receive | — | Send/receive |

---

## Session Dependency Graph

```
Session 0 (Foundation — data model, 4 roles, app shell)
  │
  ├── Session 1 (Teacher Homework) ──► Session 2 (Grading/Gradebook) ──► Session 3 (Student Analysis + Classes)
  │
  ├── Session 4 (Enrich Class Activities)
  ├── Session 5 (Enrich Assessments)
  ├── Session 6 (Enrich Curriculum)
  │
  ├── Session 7 (Student Experience) ──► Session 8 (AI Tutor)
  │
  ├── Session 9 (Parent Experience)
  │
  └── Session 10 (Polish + Integration — after all others)
```

Sessions 1, 4, 5, 6, 7, and 9 can all start after Session 0 (they're independent of each other).

## Verification

After each session:
1. `npm run build` passes (type-check + build)
2. `npm run lint` passes
3. Manual browser testing at localhost:5173
4. Role switching works (correct sidebar per role, routes redirect properly)
5. Interactive elements work: forms submit to local state, grades persist in session, AI responses appear
