# Individual Learning Plan (ILP) System — BlinkLink Integration Context

## Purpose of This Document

This document provides all the context needed to prototype a **configuration UI** that allows educational administrators to set up and manage Individual Learning Plans (ILPs) for students. The ILP system uses **BlinkLink** (blinklink.com) as the delivery and personalization engine. The configuration UI is the "control panel" that feeds BlinkLink the right data so it can generate personalized, adaptive learning experiences for each student.

---

## What Is BlinkLink?

BlinkLink is an AI-native enterprise platform that delivers **personalized short-form video feeds** with agentic AI capabilities. Originally built for commerce and media, its architecture maps directly onto education because it already solves the core problems: personalization at scale, adaptive content recommendation, lifecycle-based journeys, analytics, and real-time adjustment.

### BlinkLink's Three Products

| Product | What It Does | ILP Relevance |
|---------|-------------|---------------|
| **Social** | Embeddable short-form video feeds on any website, personalized per visitor | The student-facing learning feed — each student sees different content |
| **Skills** | Enterprise LMS rebuilt around short-form video: bite-sized courses, AI quizzing, adaptive assessments, AI coaching voice agent, gamification | The actual learning delivery engine — courses, quizzes, certifications |
| **Omni** | Multi-channel deployment (web, mobile, app) | Ensures students can access their ILP anywhere |

### BlinkLink's Key Features (That Map to ILP Requirements)

| Feature | How It Works | ILP Application |
|---------|-------------|-----------------|
| **Curative AI** | Natural-language-coached recommendation engine. You write plain text instructions ("students struggling with algebra should see more foundational arithmetic videos before advancing") and it personalizes per user. | The core ILP brain — we write curation rules that map to learning styles, deficiencies, and intervention strategies |
| **Persona Curation** | Adapts content per visitor persona in real time based on engagement behavior | Map student profiles (learning style, grade level, strengths/weaknesses) as personas |
| **Lifecycle Curation** | Guides users through funnel stages (awareness → conversion), adapting content at each stage | Map to learning stages: Assessment → Foundation → Core → Mastery → Enrichment |
| **Integrate Data Sources** | Connect a user database for premium personalization based on past behavior and preferences | Connect the student information system (SIS) — grades, attendance, assessment scores, course enrollment |
| **Adaptive Quizzes** | AI-generated assessments that adjust difficulty per learner's pace and knowledge gaps | Directly serves ILP requirement 2.1 (AI assessments for learning styles/strengths/barriers) |
| **AI Personas (Voice Agent)** | Specialized AI assistants grounded in your knowledge base — coaches, advisors, compliance experts | Student advisor persona that helps with goal-setting, reflection, and intervention |
| **AI Roleplay** | Practice scenarios with AI that adapts difficulty and gives real-time feedback | Practice exercises that adjust to student level |
| **Signals** | Real-time audience behavior analysis to uncover content needs and opportunities | Identifies which topics students are struggling with across the board |
| **Comprehensive Analytics** | Full funnel tracking — engagement, retention, session duration, completion rates | Progress tracking dashboard for educators |
| **Session Replay** | Watch user journeys with AI commentary | See how a student navigated their learning path, where they dropped off |
| **Ask Anything** | Natural language analytics queries | Educators ask "Which students in Grade 10 haven't completed their math foundations?" and get instant answers |
| **Enterprise Studio** | AI-powered content pipeline: upload PDFs, slides, long-form video, SCORM packages → outputs bite-sized video courses with AI instructors | Convert existing curriculum materials into BlinkLink-ready learning content |
| **Gamification** | Account leveling, trophies, certifications, streak rewards, team challenges | Student motivation and engagement layer |
| **Frontline Feed** | Mobile-first personalized video feed, AI-personalized by role/location/language | The actual student-facing interface — a scrollable, personalized learning feed |

---

## How the ILP Flow Works End-to-End

### Phase 1: Student Data Ingestion (Config UI → BlinkLink Data Sources)

The config UI must collect and push student data into BlinkLink's data source integration. This is the foundation — without it, Curative AI has nothing to personalize against.

**Data the config UI must capture or connect to:**

```
STUDENT PROFILE
├── student_id (unique identifier)
├── name, grade_level, section/class
├── enrolled_courses[] (list of all courses the student is taking)
│
├── ACADEMIC PERFORMANCE (per course)
│   ├── course_id
│   ├── course_name
│   ├── current_grade (numeric or letter)
│   ├── grade_trend (improving / declining / stable)
│   ├── assignments_completed / assignments_total
│   ├── assessment_scores[] (array of quiz/test scores with dates)
│   ├── attendance_rate (percentage)
│   └── status (on_track / at_risk / critical / excelling)
│
├── LEARNING PROFILE (from AI assessment — ILP 2.1)
│   ├── learning_style (visual / auditory / reading_writing / kinesthetic)
│   ├── strengths[] (topics/skills where student excels)
│   ├── barriers[] (topics/skills where student struggles)
│   ├── preferred_content_format (video / interactive / text / mixed)
│   ├── pace_preference (accelerated / standard / supported)
│   └── language_preference
│
├── GOALS (ILP 2.5)
│   ├── short_term_goals[] (this term)
│   ├── long_term_goals[] (this year)
│   ├── goal_progress{} (goal_id → percentage)
│   └── reflection_schedule (weekly / biweekly / monthly)
│
└── RISK INDICATORS (ILP 2.3)
    ├── risk_score (0-100, computed)
    ├── risk_factors[] (low_attendance, declining_grades, missing_assignments, etc.)
    ├── intervention_history[] (past interventions and outcomes)
    └── flagged_date (when system first flagged this student)
```

### Phase 2: Curation Rules Configuration (Config UI → BlinkLink Curative AI)

This is the most critical piece. The config UI must let administrators write/configure the natural-language curation rules that tell BlinkLink's Curative AI how to personalize. Curative AI accepts plain text instructions.

**Categories of curation rules the UI must support:**

#### A. Persona Curations (Learning Style Mapping)
These tell Curative AI how to handle different student types:

```
Example rules (admin writes these in plain text via the config UI):

PERSONA: "Visual Learner"
→ "Prioritize video demonstrations, animated explainers, and diagram-based
   content. Minimize text-heavy lectures. When teaching math concepts, show
   worked examples with visual step-by-step breakdowns."

PERSONA: "At-Risk Student (Math)"  
→ "This student is falling behind in math. Serve foundational prerequisite
   content before any new topic. Break concepts into smaller chunks. After
   every 3 videos, insert a low-stakes adaptive quiz to check understanding.
   If quiz score < 60%, loop back to prerequisite content. If > 80%, advance
   to next topic."

PERSONA: "Excelling Student"
→ "This student is ahead of pace. Offer enrichment content, advanced problems,
   and cross-disciplinary connections. Skip foundational reviews. Suggest
   peer tutoring opportunities."
```

#### B. Lifecycle Curations (Learning Pathway Stages)
These define the journey stages a student moves through:

```
LIFECYCLE STAGES:
1. ASSESSMENT    → Initial diagnostic quiz to identify gaps and strengths
2. FOUNDATION    → Prerequisite/remedial content for identified gaps  
3. CORE          → Main curriculum content, paced to student ability
4. PRACTICE      → Applied exercises, AI roleplay, problem sets
5. MASTERY       → Assessment to confirm understanding  
6. ENRICHMENT    → Extension content for students who demonstrate mastery
7. REFLECTION    → Goal check-in, self-assessment, advisor conversation

Rules:
→ "Students in FOUNDATION stage should not see CORE content until they
   score 70%+ on the foundation assessment."
→ "Students who fail MASTERY assessment should loop back to PRACTICE
   with different content, not the same videos."
→ "After completing a REFLECTION stage, update the student's goals
   and re-evaluate their learning pathway."
```

#### C. Course-Deficiency Curations (Dynamic Adjustment — ILP 2.2)
These handle the specific "falling behind" scenario:

```
COURSE DEFICIENCY RULES:
→ "If a student's grade in [COURSE] drops below [THRESHOLD], automatically
   insert [N] foundational videos for [PREREQUISITE TOPIC] into their feed
   before continuing with new [COURSE] content."

→ "If a student's assessment score trend shows 3 consecutive declining
   scores in [TOPIC AREA], trigger an intervention: pause new content,
   serve a diagnostic mini-assessment, then branch to remedial pathway."

→ "Cross-reference: If a student is struggling in Physics AND Math
   simultaneously, prioritize Math foundations first since Physics
   depends on math skills."

DEFICIENCY → CONTENT MAPPING:
┌─────────────────────────┬──────────────────────────────────┐
│ Deficiency Signal       │ Content Response                 │
├─────────────────────────┼──────────────────────────────────┤
│ Algebra grade < 60%     │ Serve: Pre-Algebra Fundamentals  │
│ Essay scores declining  │ Serve: Writing Structure Basics  │
│ Lab reports incomplete  │ Serve: Scientific Method Guide   │
│ Reading comp < 50%      │ Serve: Active Reading Strategies │
│ 3+ missed assignments   │ Serve: Study Skills + Time Mgmt  │
└─────────────────────────┴──────────────────────────────────┘
```

#### D. Notification & Intervention Rules (ILP 2.3 + 2.4)
```
ALERT RULES:
→ "When risk_score > 70, notify: [advisor_email], [parent_email]"
→ "When a student hasn't logged in for 3+ days, send push notification
   with encouragement message and quick-start video link"
→ "When a student completes a milestone, send celebration notification
   and update gamification score"
→ "Weekly digest to teachers: list of students whose status changed
   from on_track to at_risk, with recommended intervention"

INTERVENTION TRIGGERS:
→ risk_score > 80 AND declining_trend → Schedule 1:1 advisor session
→ attendance_rate < 70% → Flag for counselor review
→ course_failures >= 2 → Trigger comprehensive ILP review meeting
```

### Phase 3: Content Pipeline Configuration (Config UI → BlinkLink Enterprise Studio)

The config UI needs a section where admins map their existing curriculum to BlinkLink's content pipeline:

```
CONTENT SOURCE CONFIGURATION:
├── Curriculum Materials
│   ├── Upload existing: PDFs, slide decks, long-form videos, SCORM packages
│   ├── Map to: course_id, topic, difficulty_level, prerequisite_topics[]
│   └── BlinkLink Studio converts these into bite-sized video courses
│
├── AI Instructor Configuration  
│   ├── Subject-specific AI instructors (Math Coach, Writing Tutor, etc.)
│   ├── Tone/personality settings per grade level
│   └── Language settings
│
├── Assessment Bank
│   ├── Diagnostic assessments (for Phase 1: Assessment stage)
│   ├── Formative quizzes (for Phase 4: Practice stage)
│   ├── Mastery assessments (for Phase 5: Mastery stage)
│   └── Adaptive difficulty settings per assessment
│
└── Reflection Prompts (ILP 2.5)
    ├── Goal-setting templates per grade level
    ├── Self-assessment rubrics
    ├── Reflection question banks
    └── Schedule configuration (weekly/biweekly/monthly)
```

### Phase 4: Analytics & Monitoring Dashboard (BlinkLink Insights → Config UI)

The config UI should surface BlinkLink's analytics in an educator-friendly format:

```
DASHBOARD VIEWS:
├── CLASS OVERVIEW
│   ├── Heatmap: students × courses, color-coded by status
│   ├── At-risk student list with risk scores and trends
│   ├── Completion rates per course/module
│   └── Average engagement metrics
│
├── INDIVIDUAL STUDENT VIEW
│   ├── Current learning pathway position (which lifecycle stage per course)
│   ├── Assessment score history (trend chart)
│   ├── Content engagement metrics (watch time, quiz attempts, completion)
│   ├── Goal progress tracking
│   ├── AI-generated summary: "Student is progressing well in English but
│   │   showing signs of struggle in Chemistry. Recommended: increase
│   │   foundational chemistry content."
│   └── Intervention history and outcomes
│
├── PREDICTIVE ANALYTICS (ILP 2.3)
│   ├── Students predicted to fall behind in next 2 weeks
│   ├── Early warning indicators
│   ├── Intervention effectiveness scores
│   └── Recommended interventions per student
│
└── SYSTEM HEALTH
    ├── Content coverage gaps (topics with no associated content)
    ├── Curation rule effectiveness (are the rules producing good outcomes?)
    └── Student satisfaction / engagement trends
```

---

## What the Configuration UI Must Include (Prototype Spec)

The prototype should have these main sections/screens:

### Screen 1: Student Data Connection
- Connect to SIS (Student Information System) — mock as CSV upload or API config
- Map fields: student_id, courses, grades, attendance, etc.
- Preview imported data
- Set sync frequency (real-time / daily / weekly)

### Screen 2: Learning Profile Assessment Setup (ILP 2.1)
- Configure the initial diagnostic assessment that determines learning style, strengths, barriers
- Select/customize assessment instrument (BlinkLink's adaptive quiz engine)
- Set thresholds: "What score range = visual learner?", "What score = at-risk?"
- Define the learning style taxonomy used by this institution
- Schedule: When do assessments run? (enrollment, start of term, triggered by performance drop)

### Screen 3: Pathway Builder (ILP 2.2)
- Visual builder for learning lifecycle stages (Assessment → Foundation → Core → Practice → Mastery → Enrichment → Reflection)
- Per course: define which content maps to which stage
- Set advancement criteria (e.g., "70% on foundation quiz to advance to core")
- Define branching logic ("If student fails mastery, route back to practice with different content")
- Cross-course dependency mapping ("Math prerequisites for Physics")

### Screen 4: Curation Rules Editor (ILP 2.2 — this is the heart)
- Natural language rule editor (BlinkLink's Curative AI accepts plain text)
- Template library: pre-built rules for common scenarios
  - "Student falling behind in [course]"
  - "Student excelling in [course]"
  - "Student with [learning style]"
  - "Student with [specific barrier]"
- Variable insertion: `{student.grade}`, `{course.current_score}`, `{student.learning_style}`
- Rule testing: "Preview what Student X would see with these rules"
- Deficiency-to-content mapping table (admin defines: "If failing algebra → serve pre-algebra content")

### Screen 5: Risk & Intervention Configuration (ILP 2.3)
- Risk score formula builder: weight different factors
  - Grade decline weight: ___
  - Attendance weight: ___
  - Assignment completion weight: ___
  - Engagement decline weight: ___
- Risk threshold configuration: At what score is a student "at-risk" vs "critical"?
- Intervention playbooks: define what happens at each risk level
  - Low risk: adjust content feed
  - Medium risk: notify teacher + adjust content
  - High risk: notify counselor + parent + pause advancement + schedule review
- Predictive model settings: how far ahead should the system predict? (2 weeks, 1 month)

### Screen 6: Notification & Automation Rules (ILP 2.4)
- Notification recipients per event type (teacher, parent, counselor, student)
- Notification channels (email, push, SMS, in-app)
- Trigger configuration:
  - Performance thresholds
  - Milestone completions
  - Inactivity periods
  - Risk score changes
- Digest/report scheduling (daily teacher summary, weekly parent update, monthly admin report)

### Screen 7: Goal Setting & Reflection (ILP 2.5)
- Goal templates per grade level / subject
- Reflection prompt library (customizable)
- Schedule configuration: when do students do reflection? (end of module, weekly, biweekly)
- AI advisor persona configuration: tone, subject expertise, grade-appropriate language
- Goal tracking visualization settings

### Screen 8: Content Management
- Upload curriculum materials → BlinkLink Enterprise Studio pipeline
- Tag content: course, topic, difficulty, prerequisite topics, stage (foundation/core/enrichment)
- AI instructor configuration per subject
- Assessment bank management
- Preview content as it would appear in student feed

### Screen 9: Analytics Dashboard
- Class-level overview with risk heatmap
- Individual student drill-down
- Predictive analytics view
- Intervention effectiveness tracking
- Natural language query box (powered by BlinkLink's "Ask Anything")
- Export/reporting tools

---

## Technical Integration Points

When building the prototype, these are the key integration surfaces with BlinkLink:

```
YOUR CONFIG UI                          BLINKLINK
─────────────                          ─────────
Student Data ──────── API/CSV ────────→ Data Source Integration
                                        (user database connection)

Curation Rules ────── Plain Text ─────→ Curative AI
                                        (persona, lifecycle, product,
                                         geography, calendar, source)

Content Upload ────── Files/URLs ─────→ Enterprise Studio
                                        (PDFs, videos, SCORM → 
                                         bite-sized video courses)

Assessment Config ─── Quiz Settings ──→ Skills LMS
                                        (adaptive quizzes, AI quizzing)

AI Advisor Setup ──── Persona Config ─→ AI Personas / Voice Agent
                                        (coaching, goal-setting, reflection)

Analytics Pull ────── API/Webhook ←───── Insights
                                        (engagement, completion, risk signals)

Notifications ─────── Rules Config ───→ Skills LMS + External
                                        (push, email, in-app alerts)

Gamification ──────── Config ─────────→ Gamification Module
                                        (levels, trophies, streaks, challenges)
```

---

## Key Constraints & Notes for Prototyping

1. **BlinkLink is enterprise SaaS** — it deploys on private AWS infrastructure and has SOC 2 / ISO 27001 / GDPR compliance. The prototype should assume API-based integration, not direct database access.

2. **Curative AI is natural-language-configured** — this is a major design advantage. The curation rules editor doesn't need to be a complex visual flow builder. It can be a structured text editor with templates and variable insertion. The AI interprets plain English instructions.

3. **"Bring Your Own AI"** — BlinkLink lets you connect your own AI models. The prototype can assume we connect our own LLM for the risk prediction and intervention recommendation engine.

4. **Content format is video-first** — BlinkLink's core delivery is short-form video feeds. The Enterprise Studio converts static materials (PDFs, slides, SCORM) into video. The prototype should account for this conversion pipeline.

5. **Mobile-first delivery** — the student-facing experience is a scrollable, TikTok-style feed of personalized learning videos. The config UI is admin-facing (desktop), but the output is mobile.

6. **Skills LMS completion rates are 60%+** compared to 5-10% for traditional LMS — this is the main selling point. The ILP system should be designed to maximize this engagement advantage.

7. **The config UI is NOT the student-facing app** — BlinkLink handles the student experience. The config UI is purely the admin tool that configures what BlinkLink serves to each student.

---

## ILP Requirements Mapping Summary

| ILP Requirement | Config UI Screen | BlinkLink Feature Used |
|----------------|-----------------|----------------------|
| 2.1 AI assessments for learning styles, strengths, barriers | Screen 2: Learning Profile Assessment Setup | Adaptive Quizzes, AI Personas |
| 2.2 Personalized pathway recommendations & dynamic adjustment | Screens 3 + 4: Pathway Builder + Curation Rules Editor | Curative AI (Persona + Lifecycle Curation), Skills LMS |
| 2.3 Predictive analytics for at-risk identification & intervention | Screen 5: Risk & Intervention Configuration | Insights (Signals, Ask Anything, Comprehensive Analytics) + custom risk model |
| 2.4 Automated progress tracking & notifications | Screen 6: Notification & Automation Rules | Insights + Notification system |
| 2.5 AI-assisted goal setting & reflection prompts | Screen 7: Goal Setting & Reflection | AI Personas / Voice Agent, Gamification |
