// ─── Lesson Generator ────────────────────────────────────────────────────────

export type LessonGenStat = {
  subject: string
  khdaAligned: number
  moeAligned: number
  custom: number
}

export const lessonGenStats: LessonGenStat[] = [
  { subject: 'Math',      khdaAligned: 18, moeAligned: 12, custom: 5 },
  { subject: 'Science',   khdaAligned: 15, moeAligned: 10, custom: 8 },
  { subject: 'English',   khdaAligned: 14, moeAligned: 11, custom: 6 },
  { subject: 'Arabic',    khdaAligned: 12, moeAligned: 14, custom: 4 },
  { subject: 'Social St', khdaAligned: 10, moeAligned: 8,  custom: 9 },
]

export type RecentLesson = {
  subject: string
  topic: string
  grade: string
  alignment: number
  timeAgo: string
}

export const recentLessons: RecentLesson[] = [
  { subject: 'Mathematics', topic: 'Quadratic Equations',  grade: 'Grade 10', alignment: 96, timeAgo: '1 hr ago' },
  { subject: 'Science',     topic: 'Photosynthesis',        grade: 'Grade 8',  alignment: 92, timeAgo: '3 hrs ago' },
  { subject: 'Arabic',      topic: 'Poetry Analysis',       grade: 'Grade 11', alignment: 88, timeAgo: 'Yesterday' },
]

// ─── Standards Coverage ───────────────────────────────────────────────────────

export type StandardItem = {
  code: string
  name: string
  status: 'covered' | 'partial' | 'gap' | 'redundant'
  coverage: number
  subject: string
}

export const standardItems: StandardItem[] = [
  { code: 'KHDA-M-4.2', name: 'Algebraic Reasoning',     status: 'covered',   coverage: 95, subject: 'Math' },
  { code: 'MOE-S-3.1',  name: 'Scientific Inquiry',       status: 'partial',   coverage: 62, subject: 'Science' },
  { code: 'KHDA-E-2.3', name: 'Critical Reading',         status: 'gap',       coverage: 28, subject: 'English' },
  { code: 'MOE-A-5.1',  name: 'Classical Arabic Forms',   status: 'redundant', coverage: 100, subject: 'Arabic' },
]

// ─── Pacing & Adaptation ──────────────────────────────────────────────────────

export type PacingPoint = { week: string; planned: number; actual: number }

export const pacingTimeline: PacingPoint[] = [
  { week: 'W1',  planned: 8,   actual: 8  },
  { week: 'W2',  planned: 17,  actual: 15 },
  { week: 'W3',  planned: 25,  actual: 22 },
  { week: 'W4',  planned: 33,  actual: 30 },
  { week: 'W5',  planned: 42,  actual: 37 },
  { week: 'W6',  planned: 50,  actual: 44 },
  { week: 'W7',  planned: 58,  actual: 52 },
  { week: 'W8',  planned: 67,  actual: 61 },
  { week: 'W9',  planned: 75,  actual: 70 },
  { week: 'W10', planned: 83,  actual: 78 },
  { week: 'W11', planned: 92,  actual: 85 },
  { week: 'W12', planned: 100, actual: 91 },
]

export type PacingAdjustment = {
  subject: string
  recommendation: string
  urgency: 'high' | 'moderate' | 'low'
  weeksBehind: number
}

export const pacingAdjustments: PacingAdjustment[] = [
  { subject: 'Science', recommendation: 'Accelerate Unit 5 — combine labs 3 & 4', urgency: 'high',     weeksBehind: 2.5 },
  { subject: 'English', recommendation: 'On track — maintain current pace',         urgency: 'low',      weeksBehind: 0 },
  { subject: 'Math',    recommendation: 'Slow down Unit 7 — low comprehension',     urgency: 'moderate', weeksBehind: -1 },
]

// ─── Resource Recommendations ─────────────────────────────────────────────────

export type ResourceStat = {
  subject: string
  videos: number
  documents: number
  interactive: number
}

export const resourceStats: ResourceStat[] = [
  { subject: 'Math',    videos: 24, documents: 18, interactive: 12 },
  { subject: 'Science', videos: 20, documents: 15, interactive: 18 },
  { subject: 'English', videos: 16, documents: 22, interactive: 8  },
  { subject: 'Arabic',  videos: 12, documents: 20, interactive: 6  },
]

export type ResourceRecommendation = {
  title: string
  resourceType: 'Video' | 'Document' | 'Interactive' | 'Quiz'
  subject: string
  relevance: number
  reason: string
}

export const resourceRecommendations: ResourceRecommendation[] = [
  {
    title: 'Quadratic Functions Visual Guide',
    resourceType: 'Interactive',
    subject: 'Math',
    relevance: 98,
    reason: 'Addresses Grade 10 gap in algebraic reasoning',
  },
  {
    title: 'Scientific Method Lab Series',
    resourceType: 'Video',
    subject: 'Science',
    relevance: 94,
    reason: 'Supports MOE-S-3.1 inquiry standard',
  },
  {
    title: 'Arabic Poetry Anthology',
    resourceType: 'Document',
    subject: 'Arabic',
    relevance: 91,
    reason: 'Aligns with KHDA classical forms requirement',
  },
]

// ─── Curriculum Analytics ─────────────────────────────────────────────────────

export type CurriculumHealthPoint = { week: string; healthScore: number; benchmark: number }

export const curriculumHealthTimeline: CurriculumHealthPoint[] = [
  { week: 'W1',  healthScore: 72, benchmark: 85 },
  { week: 'W2',  healthScore: 75, benchmark: 85 },
  { week: 'W3',  healthScore: 78, benchmark: 85 },
  { week: 'W4',  healthScore: 80, benchmark: 85 },
  { week: 'W5',  healthScore: 82, benchmark: 85 },
  { week: 'W6',  healthScore: 79, benchmark: 85 },
  { week: 'W7',  healthScore: 84, benchmark: 85 },
  { week: 'W8',  healthScore: 86, benchmark: 85 },
  { week: 'W9',  healthScore: 88, benchmark: 85 },
  { week: 'W10', healthScore: 85, benchmark: 85 },
  { week: 'W11', healthScore: 90, benchmark: 85 },
  { week: 'W12', healthScore: 87, benchmark: 85 },
  { week: 'W13', healthScore: 91, benchmark: 85 },
  { week: 'W14', healthScore: 92, benchmark: 85 },
]

export type CurriculumInsight = {
  subject: string
  healthScore: number
  lessonsDelivered: number
  standardsCovered: number
  trend: 'up' | 'down' | 'flat'
}

export const curriculumInsights: CurriculumInsight[] = [
  { subject: 'Mathematics',     healthScore: 92, lessonsDelivered: 38, standardsCovered: 95, trend: 'up' },
  { subject: 'Science',         healthScore: 78, lessonsDelivered: 32, standardsCovered: 72, trend: 'down' },
  { subject: 'English Language',healthScore: 85, lessonsDelivered: 35, standardsCovered: 84, trend: 'flat' },
  { subject: 'Arabic Language', healthScore: 88, lessonsDelivered: 34, standardsCovered: 90, trend: 'up' },
  { subject: 'Social Studies',  healthScore: 74, lessonsDelivered: 28, standardsCovered: 68, trend: 'down' },
]

// ─── Curriculum Builder ────────────────────────────────────────────────────────

export type NodeType = 'program' | 'course' | 'unit' | 'lesson'
export type NodeStatus = 'draft' | 'under-review' | 'approved' | 'published'

export type CurriculumNode = {
  id: string
  parentId: string | null
  nodeType: NodeType
  title: string
  description: string
  objectives: string[]
  standardIds: string[]
  duration?: number // hours
  status: NodeStatus
  version?: number
  updatedAt?: string
  updatedBy?: string
  competencies?: string[]
  assessmentIds?: string[]
}

// ─── Version History ──────────────────────────────────────────────────────────

export type VersionHistoryEntry = {
  nodeId: string
  version: number
  changedBy: string
  changedAt: string
  changeNote: string
}

export const versionHistory: VersionHistoryEntry[] = [
  { nodeId: 'les-001', version: 3, changedBy: 'Sarah Al-Ahmad', changedAt: '2026-03-20', changeNote: 'Added quadratic formula worked example and updated objectives.' },
  { nodeId: 'les-001', version: 2, changedBy: 'Mohammed Khalid', changedAt: '2026-02-14', changeNote: 'Aligned objectives to KHDA-M-4.2 standard.' },
  { nodeId: 'les-001', version: 1, changedBy: 'Sarah Al-Ahmad', changedAt: '2026-01-10', changeNote: 'Initial draft created.' },
  { nodeId: 'les-003', version: 2, changedBy: 'Sarah Al-Ahmad', changedAt: '2026-03-15', changeNote: 'Revised discriminant examples for clarity.' },
  { nodeId: 'les-003', version: 1, changedBy: 'Mohammed Khalid', changedAt: '2026-02-01', changeNote: 'Initial draft created.' },
  { nodeId: 'unt-002', version: 2, changedBy: 'Layla Hassan', changedAt: '2026-03-10', changeNote: 'Added coordinate geometry section per curriculum review feedback.' },
  { nodeId: 'unt-002', version: 1, changedBy: 'Sarah Al-Ahmad', changedAt: '2026-01-25', changeNote: 'Initial unit structure defined.' },
  { nodeId: 'les-004', version: 2, changedBy: 'Omar Yusuf', changedAt: '2026-03-18', changeNote: 'Incorporated real-world engineering applications for each law.' },
  { nodeId: 'les-004', version: 1, changedBy: 'Omar Yusuf', changedAt: '2026-02-05', changeNote: 'Initial lesson draft.' },
]

// ─── Assessment Links ─────────────────────────────────────────────────────────

export type AssessmentLink = {
  id: string
  title: string
  type: 'formative' | 'summative'
  standardIds: string[]
  lessonIds: string[]
}

export const assessmentLinks: AssessmentLink[] = [
  { id: 'asmnt-001', title: 'Quadratic Equations Exit Ticket', type: 'formative', standardIds: ['std-001'], lessonIds: ['les-001'] },
  { id: 'asmnt-002', title: 'Algebra Unit Summative Exam',     type: 'summative', standardIds: ['std-001', 'std-002'], lessonIds: ['les-001', 'les-002', 'les-003'] },
  { id: 'asmnt-003', title: 'Parabola Sketching Quiz',         type: 'formative', standardIds: ['std-001'], lessonIds: ['les-002'] },
  { id: 'asmnt-004', title: "Newton's Laws Lab Report",         type: 'summative', standardIds: ['std-003'], lessonIds: ['les-004'] },
  { id: 'asmnt-005', title: 'Kinematics Problem Set',           type: 'formative', standardIds: ['std-003'], lessonIds: ['les-005'] },
]

// ─── Collaborators ────────────────────────────────────────────────────────────

export type Collaborator = {
  nodeId: string
  name: string
  initials: string
  color: string
  role: string
}

export const collaborators: Collaborator[] = [
  { nodeId: 'les-001', name: 'Sarah Al-Ahmad',  initials: 'SA', color: '#0EA5E9', role: 'Author' },
  { nodeId: 'les-001', name: 'Mohammed Khalid', initials: 'MK', color: '#10B981', role: 'Reviewer' },
  { nodeId: 'les-002', name: 'Sarah Al-Ahmad',  initials: 'SA', color: '#0EA5E9', role: 'Author' },
  { nodeId: 'les-003', name: 'Sarah Al-Ahmad',  initials: 'SA', color: '#0EA5E9', role: 'Author' },
  { nodeId: 'les-003', name: 'Layla Hassan',    initials: 'LH', color: '#F59E0B', role: 'Reviewer' },
  { nodeId: 'les-004', name: 'Omar Yusuf',      initials: 'OY', color: '#8B5CF6', role: 'Author' },
  { nodeId: 'les-004', name: 'Mohammed Khalid', initials: 'MK', color: '#10B981', role: 'Reviewer' },
  { nodeId: 'unt-001', name: 'Sarah Al-Ahmad',  initials: 'SA', color: '#0EA5E9', role: 'Lead' },
  { nodeId: 'unt-001', name: 'Mohammed Khalid', initials: 'MK', color: '#10B981', role: 'Contributor' },
  { nodeId: 'unt-001', name: 'Layla Hassan',    initials: 'LH', color: '#F59E0B', role: 'Reviewer' },
]

// ─── Activity Items ───────────────────────────────────────────────────────────

export type ActivityItem = {
  id: string
  lessonId: string
  title: string
  activityType: 'discussion' | 'lab' | 'exercise' | 'quiz' | 'project'
  standardIds: string[]
}

export const activityItems: ActivityItem[] = [
  { id: 'act-001', lessonId: 'les-001', title: 'Factoring Race — pair activity',           activityType: 'exercise',   standardIds: ['std-001'] },
  { id: 'act-002', lessonId: 'les-001', title: 'Quadratic Formula Derivation Discussion',  activityType: 'discussion', standardIds: ['std-001'] },
  { id: 'act-003', lessonId: 'les-002', title: 'Parabola Sketching on GeoGebra',           activityType: 'lab',        standardIds: ['std-001'] },
  { id: 'act-004', lessonId: 'les-002', title: 'Real-world Parabola Exit Quiz',            activityType: 'quiz',       standardIds: ['std-001'] },
  { id: 'act-005', lessonId: 'les-004', title: "Newton's Laws Station Rotation",           activityType: 'lab',        standardIds: ['std-003'] },
  { id: 'act-006', lessonId: 'les-004', title: 'Free Body Diagram Worksheet',              activityType: 'exercise',   standardIds: ['std-003'] },
  { id: 'act-007', lessonId: 'les-005', title: 'Motion Graph Analysis Project',            activityType: 'project',    standardIds: ['std-003'] },
]

// ─── Competency Tags ──────────────────────────────────────────────────────────

export const competencyTags: string[] = [
  'Algebraic Thinking',
  'Problem Solving',
  'Scientific Inquiry',
  'Data Analysis',
  'Critical Thinking',
  'Engineering Design',
  'UAE Labor Market: Renewable Energy',
  'UAE Labor Market: STEM Workforce',
  'Communication & Collaboration',
  'Digital Literacy',
]

// ─── Lesson Content ───────────────────────────────────────────────────────────
// Rich instructional content for each lesson — the actual "textbook" material

export type ContentSection = {
  heading: string
  body: string
}

export type WorkedExample = {
  title: string
  problem: string
  solution: string[]
}

export type PracticeProblem = {
  question: string
  hint?: string
  answer: string
}

export type LessonContent = {
  lessonId: string
  introduction: string
  vocabulary: { term: string; definition: string }[]
  keyConcepts: ContentSection[]
  workedExamples: WorkedExample[]
  practiceProblems: PracticeProblem[]
  teacherNotes: string
  studentReadings: string[]
  estimatedMinutes: number
}

export const lessonContents: LessonContent[] = [
  {
    lessonId: 'les-001',
    introduction: 'A quadratic equation is a polynomial equation of degree two, written in the standard form ax² + bx + c = 0, where a ≠ 0. Quadratic equations appear throughout science and engineering — from calculating projectile trajectories to modelling the cross-sectional area of solar panels at DEWA\'s Innovation Centre. In this lesson, we will learn to recognise, form, and solve quadratic equations using two core techniques: factoring and the quadratic formula.',
    vocabulary: [
      { term: 'Quadratic equation', definition: 'A polynomial equation of degree 2, in the form ax² + bx + c = 0, where a ≠ 0.' },
      { term: 'Standard form', definition: 'The arrangement ax² + bx + c = 0, where terms are ordered by descending degree.' },
      { term: 'Coefficient', definition: 'The numerical factor in a term (e.g., in 3x², the coefficient is 3).' },
      { term: 'Factoring', definition: 'Rewriting an expression as a product of simpler expressions that multiply to give the original.' },
      { term: 'Quadratic formula', definition: 'x = (-b ± √(b² - 4ac)) / 2a — a formula that gives the solutions of any quadratic equation.' },
      { term: 'Root / Solution', definition: 'A value of x that satisfies the equation (makes it equal to zero).' },
      { term: 'Discriminant', definition: 'The expression b² - 4ac inside the square root of the quadratic formula; determines the nature of roots.' },
    ],
    keyConcepts: [
      {
        heading: 'What Makes an Equation Quadratic?',
        body: 'A quadratic equation always contains a term with x² (the "squared" term) and no higher powers of x. The general form is ax² + bx + c = 0. The coefficient "a" must not be zero — if it were, the x² term would vanish and the equation would become linear.\n\nExamples of quadratic equations:\n• 2x² + 5x - 3 = 0 (a=2, b=5, c=-3)\n• x² - 9 = 0 (a=1, b=0, c=-9)\n• -x² + 4x = 0 (a=-1, b=4, c=0)\n\nNon-examples:\n• 3x + 2 = 0 (linear — no x² term)\n• x³ - x = 0 (cubic — highest power is 3)',
      },
      {
        heading: 'Solving by Factoring',
        body: 'Factoring works when you can rewrite ax² + bx + c as a product of two linear factors: (px + q)(rx + s) = 0. The zero-product property tells us that if a product equals zero, at least one factor must be zero.\n\nSteps:\n1. Write the equation in standard form (= 0 on one side).\n2. Find two numbers that multiply to give a·c and add to give b.\n3. Use these numbers to split the middle term and factor by grouping.\n4. Set each factor equal to zero and solve.\n\nThis method is fast when the numbers work out neatly, but it does not always yield rational factors — that is when we need the quadratic formula.',
      },
      {
        heading: 'The Quadratic Formula',
        body: 'For any quadratic equation ax² + bx + c = 0, the solutions are given by:\n\n    x = (-b ± √(b² - 4ac)) / (2a)\n\nThis formula works for every quadratic equation — whether the roots are rational, irrational, or complex. The expression under the square root, b² - 4ac, is called the discriminant (Δ).\n\n• If Δ > 0: two distinct real roots\n• If Δ = 0: one repeated real root\n• If Δ < 0: no real roots (two complex conjugate roots)\n\nDerivation (for advanced students): The formula is obtained by completing the square on the general equation. Starting with ax² + bx + c = 0, divide by a, move c/a to the other side, add (b/2a)² to both sides, and take the square root.',
      },
      {
        heading: 'Connecting to Real-World Applications',
        body: 'Quadratic equations model many physical situations:\n\n• Projectile motion: The height h of an object thrown upward is h(t) = -½gt² + v₀t + h₀, a quadratic in time t.\n• Area problems: If a rectangle has a perimeter of 40 m and we want to find dimensions giving an area of 96 m², we solve x(20-x) = 96, which simplifies to x² - 20x + 96 = 0.\n• Engineering at DEWA: Parabolic solar collectors use quadratic curves to focus sunlight. The cross-section of a parabolic trough follows y = ax², and engineers solve quadratic equations to determine focal points and reflector widths.\n\nIn the UAE, DEWA\'s Mohammed bin Rashid Al Maktoum Solar Park uses parabolic concentrating solar power — the math behind those collectors is quadratic.',
      },
    ],
    workedExamples: [
      {
        title: 'Solving by Factoring',
        problem: 'Solve x² - 5x + 6 = 0',
        solution: [
          'We need two numbers that multiply to 6 and add to -5.',
          'Those numbers are -2 and -3, since (-2)(-3) = 6 and (-2) + (-3) = -5.',
          'Factor: (x - 2)(x - 3) = 0',
          'Set each factor to zero: x - 2 = 0 → x = 2, or x - 3 = 0 → x = 3.',
          'Solutions: x = 2 or x = 3.',
          'Check: 2² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓ and 3² - 5(3) + 6 = 9 - 15 + 6 = 0 ✓',
        ],
      },
      {
        title: 'Using the Quadratic Formula',
        problem: 'Solve 2x² + 3x - 2 = 0',
        solution: [
          'Identify: a = 2, b = 3, c = -2.',
          'Calculate the discriminant: Δ = b² - 4ac = 9 - 4(2)(-2) = 9 + 16 = 25.',
          'Since Δ > 0, there are two distinct real roots.',
          'Apply the formula: x = (-3 ± √25) / (2·2) = (-3 ± 5) / 4.',
          'x = (-3 + 5)/4 = 2/4 = 1/2, or x = (-3 - 5)/4 = -8/4 = -2.',
          'Solutions: x = 0.5 or x = -2.',
        ],
      },
      {
        title: 'Real-World Application — Solar Panel Area',
        problem: 'A rectangular solar panel has a length 3 m more than its width. Its area is 28 m². Find the dimensions.',
        solution: [
          'Let the width = w metres. Then the length = (w + 3) metres.',
          'Area = width × length: w(w + 3) = 28.',
          'Expand: w² + 3w = 28 → w² + 3w - 28 = 0.',
          'Factor: We need two numbers that multiply to -28 and add to 3. Those are 7 and -4.',
          '(w + 7)(w - 4) = 0 → w = -7 (reject, width must be positive) or w = 4.',
          'Width = 4 m, Length = 7 m.',
          'Check: 4 × 7 = 28 ✓',
        ],
      },
    ],
    practiceProblems: [
      { question: 'Solve by factoring: x² + 7x + 12 = 0', hint: 'Find two numbers that multiply to 12 and add to 7.', answer: 'x = -3 or x = -4' },
      { question: 'Solve by factoring: x² - 9 = 0', hint: 'This is a difference of squares.', answer: 'x = 3 or x = -3' },
      { question: 'Use the quadratic formula to solve: x² + 2x - 8 = 0', answer: 'x = 2 or x = -4' },
      { question: 'Use the quadratic formula to solve: 3x² - x - 4 = 0', answer: 'x = 4/3 or x = -1' },
      { question: 'A garden is 2 m longer than it is wide. Its area is 63 m². Find its dimensions.', hint: 'Set up w(w+2) = 63.', answer: 'Width = 7 m, Length = 9 m' },
      { question: 'The height of a ball is h(t) = -5t² + 20t + 1. When does it reach a height of 16 m?', hint: 'Set -5t² + 20t + 1 = 16 and solve for t.', answer: 't = 1 s or t = 3 s' },
      { question: 'Determine the discriminant and the nature of the roots: 4x² - 12x + 9 = 0', answer: 'Δ = 0 → one repeated root, x = 3/2' },
    ],
    teacherNotes: 'Start with the warm-up factoring activity (10 min) to assess students\' comfort with factoring from Grade 9. Common misconceptions: students often forget that a ≠ 0, or they drop the ± when using the quadratic formula. Emphasise the ± and the need to check both roots.\n\nDifferentiation:\n• Support: Provide a factoring "cheat sheet" with factor pairs for common numbers. Let students use a calculator for discriminant calculations.\n• Extension: Challenge students to derive the quadratic formula by completing the square on ax² + bx + c = 0. Connect to the upcoming lesson on discriminants.\n\nTiming: Key Concepts (20 min) → Worked Examples (15 min) → Guided Practice (15 min) → Independent Practice (10 min) → Plenary / Exit Ticket (5 min).\n\nCross-curricular link: Coordinate with the Physics teacher (Mr. Yusuf) — projectile motion in Unit 1 Mechanics uses these same equations. Consider a joint problem set.',
    studentReadings: [
      'Textbook Chapter 4.1: Introduction to Quadratic Equations (pp. 112–124)',
      'DEWA Academy Algebra Workbook: Section 7 — Quadratics (pp. 45–58)',
      'Online: Khan Academy — "Solving Quadratics by Factoring" video series',
      'Supplementary: "The History of Algebra — from al-Khwarizmi to Modern Mathematics" (reading pack, 4 pages)',
    ],
    estimatedMinutes: 65,
  },
  {
    lessonId: 'les-004',
    introduction: 'Sir Isaac Newton\'s three laws of motion form the foundation of classical mechanics — the branch of physics that describes how and why objects move. Published in 1687 in the Principia Mathematica, these laws remain essential for engineering, space exploration, and everyday life. At DEWA, engineers apply Newton\'s laws when designing turbine systems, calculating structural loads on transmission towers, and planning the mechanics of robotic maintenance drones.\n\nIn this lesson, we will state each law, explore its meaning through real-world examples, learn to draw free body diagrams, and solve quantitative force problems.',
    vocabulary: [
      { term: 'Force', definition: 'A push or pull that can change an object\'s velocity. Measured in newtons (N). 1 N = 1 kg·m/s².' },
      { term: 'Net force (ΣF)', definition: 'The vector sum of all forces acting on an object.' },
      { term: 'Inertia', definition: 'The tendency of an object to resist changes to its state of motion. Directly proportional to mass.' },
      { term: 'Mass', definition: 'A measure of the amount of matter in an object and its resistance to acceleration. SI unit: kilogram (kg).' },
      { term: 'Acceleration', definition: 'The rate of change of velocity. SI unit: m/s². a = ΔV / Δt.' },
      { term: 'Free body diagram (FBD)', definition: 'A diagram showing all forces acting on a single object, represented as arrows from the object\'s centre of mass.' },
      { term: 'Normal force (N)', definition: 'The perpendicular contact force exerted by a surface on an object resting on it.' },
      { term: 'Friction (f)', definition: 'A force that opposes the relative motion between two surfaces in contact. f = μN.' },
      { term: 'Weight (W)', definition: 'The gravitational force on an object. W = mg, where g ≈ 9.81 m/s² on Earth.' },
      { term: 'Equilibrium', definition: 'A state where the net force on an object is zero, so its velocity remains constant.' },
    ],
    keyConcepts: [
      {
        heading: 'Newton\'s First Law — The Law of Inertia',
        body: '"An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force."\n\nThis law defines inertia: every object resists changes to its motion. A book on a desk stays still because gravity pulling it down is balanced by the normal force pushing it up — the net force is zero.\n\nDaily example: When a bus brakes suddenly, passengers lurch forward. Their bodies tend to continue moving at the bus\'s original speed (inertia), even though the bus decelerates.\n\nEngineering example: In DEWA\'s solar panel cleaning robots, the robot must overcome the inertia of its own mass plus the cleaning equipment. Engineers calculate the minimum motor torque needed to accelerate the system from rest.',
      },
      {
        heading: 'Newton\'s Second Law — F = ma',
        body: '"The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass."\n\n    ΣF = ma    (vector equation)\n\nThis is the workhorse equation of mechanics. It tells us:\n• More force → more acceleration (for the same mass).\n• More mass → less acceleration (for the same force).\n\nThe equation is a vector equation — we apply it separately in each direction:\n• Horizontal: ΣFₓ = maₓ\n• Vertical: ΣFᵧ = maᵧ\n\nUnits: Force is measured in newtons (N). 1 N is the force needed to accelerate a 1 kg mass at 1 m/s².\n\nEngineering example: When designing a wind turbine blade, DEWA engineers use F = ma to calculate the forces on the blade due to wind pressure and rotational acceleration. The blade must be strong enough to withstand these forces without deforming.',
      },
      {
        heading: 'Newton\'s Third Law — Action and Reaction',
        body: '"For every action, there is an equal and opposite reaction."\n\nWhen object A exerts a force on object B, object B simultaneously exerts an equal force in the opposite direction on object A. These are called an action-reaction pair.\n\nCritical detail: Action-reaction forces act on DIFFERENT objects. They do not cancel each other out because they are applied to different bodies.\n\nExamples:\n• You push on a wall → the wall pushes back on your hand with equal force.\n• A rocket expels exhaust gas downward → the gas pushes the rocket upward.\n• A swimmer pushes water backward → the water pushes the swimmer forward.\n\nCommon misconception: Students often think that if action = reaction, nothing can ever accelerate. The key is that the two forces act on different objects. The horse pulls the cart forward; the cart pulls the horse backward; but the horse accelerates because the ground pushes the horse forward (friction) more than the cart pulls it back.',
      },
      {
        heading: 'Free Body Diagrams',
        body: 'A free body diagram (FBD) isolates one object and shows all the forces acting on it as arrows. Steps to draw:\n\n1. Identify the object of interest. Draw it as a simple shape (dot or box).\n2. Identify all forces: weight (always down), normal force (perpendicular to surface), friction (parallel to surface, opposing motion), tension, applied forces, air resistance.\n3. Draw each force as an arrow starting from the object\'s centre. Arrow length represents magnitude.\n4. Label each arrow (W, N, f, T, Fₐ, etc.) with its magnitude if known.\n5. Choose a coordinate system (usually x horizontal, y vertical; for inclined planes, x along the slope).\n\nFBDs are essential for applying Newton\'s second law — you cannot write ΣF = ma until you know what forces are in the sum.',
      },
    ],
    workedExamples: [
      {
        title: 'Applying F = ma — Horizontal Surface',
        problem: 'A 15 kg crate is pushed across a frictionless floor with a horizontal force of 45 N. Find its acceleration.',
        solution: [
          'Draw FBD: The crate has weight W = mg = 15(9.81) = 147.15 N downward, normal force N = 147.15 N upward, and applied force Fₐ = 45 N horizontally.',
          'Vertical: ΣFᵧ = N - W = 0 (no vertical acceleration). ✓',
          'Horizontal: ΣFₓ = Fₐ = ma',
          '45 = 15 × a',
          'a = 45/15 = 3 m/s²',
          'The crate accelerates at 3 m/s² in the direction of the push.',
        ],
      },
      {
        title: 'Two Forces with Friction',
        problem: 'A 20 kg box is pulled with a horizontal force of 80 N. The coefficient of kinetic friction is μₖ = 0.3. Find the acceleration.',
        solution: [
          'Weight: W = mg = 20 × 9.81 = 196.2 N',
          'Normal force (flat surface): N = W = 196.2 N',
          'Friction: f = μₖN = 0.3 × 196.2 = 58.86 N (opposing motion)',
          'Net horizontal force: ΣFₓ = 80 - 58.86 = 21.14 N',
          'Apply F = ma: 21.14 = 20 × a → a = 1.057 m/s²',
          'The box accelerates at approximately 1.06 m/s².',
        ],
      },
      {
        title: 'Identifying Action-Reaction Pairs',
        problem: 'A book (2 kg) rests on a table. Identify all forces on the book and name each action-reaction pair.',
        solution: [
          'Forces on the book: Weight W = 2 × 9.81 = 19.62 N downward (Earth pulls book), Normal force N = 19.62 N upward (table pushes book).',
          'Note: W and N are NOT an action-reaction pair — they both act on the same object (the book).',
          'Action-reaction pair 1: Earth pulls book downward (gravity) ↔ Book pulls Earth upward (gravitational attraction of the book on Earth — tiny but real).',
          'Action-reaction pair 2: Table pushes book upward (normal force) ↔ Book pushes table downward (the book compresses the table surface).',
          'Each pair involves TWO different objects and forces in opposite directions.',
        ],
      },
    ],
    practiceProblems: [
      { question: 'A 5 kg object experiences a net force of 20 N. What is its acceleration?', answer: 'a = F/m = 20/5 = 4 m/s²' },
      { question: 'A car of mass 1200 kg accelerates from rest to 20 m/s in 10 s. What net force is required?', hint: 'First find acceleration: a = Δv/Δt.', answer: 'a = 2 m/s², F = 1200 × 2 = 2400 N' },
      { question: 'A 10 kg box sits on a surface with μₖ = 0.4. What horizontal force is needed to keep it moving at constant velocity?', hint: 'Constant velocity means a = 0, so applied force = friction.', answer: 'F = μₖmg = 0.4 × 10 × 9.81 = 39.24 N' },
      { question: 'Draw a free body diagram for a 3 kg lamp hanging from a ceiling by a cord. List all forces and their magnitudes.', answer: 'Weight W = 29.43 N downward, Tension T = 29.43 N upward. ΣF = 0 (static equilibrium).' },
      { question: 'A rocket of mass 5000 kg produces a thrust of 75 000 N. Its weight is 49 050 N. Find its initial acceleration.', answer: 'ΣF = 75000 - 49050 = 25950 N upward. a = 25950/5000 = 5.19 m/s²' },
      { question: 'When you walk, what force propels you forward? Explain using Newton\'s third law.', answer: 'Your foot pushes backward on the ground (action). The ground pushes your foot forward (reaction). This forward friction force from the ground accelerates you.' },
    ],
    teacherNotes: 'Begin with the station rotation activity (15 min) — students experience each law physically before formalising. Station 1: Pull a tablecloth from under a plate (First Law). Station 2: Push different-mass carts with the same force, measure distance (Second Law). Station 3: Stand on a skateboard and push against a wall (Third Law).\n\nCommon misconceptions to address directly:\n1. "Heavier objects fall faster" — address with Galileo\'s thought experiment.\n2. "Force is needed to maintain motion" — directly contradicts the First Law; use air hockey table example.\n3. "Action-reaction forces cancel out" — emphasise DIFFERENT OBJECTS.\n\nDifferentiation:\n• Support: Provide a forces reference card listing common forces with symbols. Use colour-coding on FBDs (red = weight, blue = normal, green = friction).\n• Extension: Introduce inclined plane problems — decompose weight into components parallel and perpendicular to the slope.\n\nTiming: Warm-up stations (15 min) → First Law + discussion (10 min) → Second Law + worked example (15 min) → Third Law + misconception activity (10 min) → FBD practice (10 min) → Exit problems (5 min).\n\nSafety: Station rotation requires clear instructions. Ensure the skateboard station has a spotter. No running.',
    studentReadings: [
      'Textbook Chapter 3.1–3.4: Newton\'s Laws of Motion (pp. 67–98)',
      'DEWA Academy Physics Workbook: Section 2 — Forces and Motion (pp. 22–41)',
      'Online: PhET Simulation — "Forces and Motion: Basics" (interactive)',
      'Supplementary: "From the Principia to the Power Grid — How Newton\'s Laws Shape DEWA\'s Engineering" (reading pack, 6 pages)',
      'Reference: Free Body Diagram drawing guide (laminated handout)',
    ],
    estimatedMinutes: 65,
  },
]

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return lessonContents.find(c => c.lessonId === lessonId)
}

export const curriculumNodes: CurriculumNode[] = [
  // Program
  {
    id: 'prog-001', parentId: null, nodeType: 'program',
    title: 'DEWA Academy Academic Programme 2025–2026',
    description: 'Full academic year programme covering all subjects and grades aligned to KHDA and MOE standards.',
    objectives: ['Achieve 90%+ KHDA alignment', 'Deliver 156+ AI-generated lessons', 'Maintain 85+ health score'],
    standardIds: [], status: 'published',
  },
  // Courses
  {
    id: 'crs-001', parentId: 'prog-001', nodeType: 'course',
    title: 'Mathematics – Grade 10',
    description: 'Full-year mathematics course covering algebra, geometry, statistics, and calculus foundations.',
    objectives: ['Master quadratic functions', 'Apply geometric reasoning', 'Interpret statistical data'],
    standardIds: ['std-001', 'std-002'], duration: 120, status: 'published',
  },
  {
    id: 'crs-002', parentId: 'prog-001', nodeType: 'course',
    title: 'Physics – Grade 11',
    description: 'Advanced physics covering mechanics, thermodynamics, electromagnetism, and modern physics.',
    objectives: ['Understand Newtonian mechanics', 'Apply thermodynamic principles', 'Explore electromagnetic fields'],
    standardIds: ['std-003', 'std-004'], duration: 110, status: 'approved',
  },
  // Units – Math
  {
    id: 'unt-001', parentId: 'crs-001', nodeType: 'unit',
    title: 'Unit 1: Algebraic Reasoning',
    description: 'Covers linear and quadratic equations, inequalities, and function analysis.',
    objectives: ['Solve quadratic equations', 'Graph functions', 'Apply algebraic proofs'],
    standardIds: ['std-001'], duration: 30, status: 'published',
    version: 1, updatedAt: '2026-01-25', updatedBy: 'Sarah Al-Ahmad',
    competencies: ['Algebraic Thinking', 'Problem Solving'],
  },
  {
    id: 'unt-002', parentId: 'crs-001', nodeType: 'unit',
    title: 'Unit 2: Geometry & Measurement',
    description: 'Plane and solid geometry, coordinate geometry, and measurement applications.',
    objectives: ['Apply Pythagorean theorem', 'Calculate areas and volumes', 'Use coordinate geometry'],
    standardIds: ['std-002'], duration: 28, status: 'approved',
    version: 2, updatedAt: '2026-03-10', updatedBy: 'Layla Hassan',
    competencies: ['Problem Solving', 'Engineering Design'],
  },
  // Units – Physics
  {
    id: 'unt-003', parentId: 'crs-002', nodeType: 'unit',
    title: 'Unit 1: Mechanics',
    description: 'Kinematics, dynamics, work-energy theorem, and momentum.',
    objectives: ["Apply Newton's laws", 'Solve kinematics problems', 'Analyse energy transformations'],
    standardIds: ['std-003'], duration: 32, status: 'published',
    version: 1, updatedAt: '2026-02-01', updatedBy: 'Omar Yusuf',
    competencies: ['Scientific Inquiry', 'UAE Labor Market: STEM Workforce'],
  },
  {
    id: 'unt-004', parentId: 'crs-002', nodeType: 'unit',
    title: 'Unit 2: Thermodynamics',
    description: 'Heat transfer, gas laws, and thermodynamic cycles.',
    objectives: ['Apply gas laws', 'Understand entropy', 'Analyse thermodynamic cycles'],
    standardIds: ['std-004'], duration: 26, status: 'under-review',
    version: 1, updatedAt: '2026-02-20', updatedBy: 'Omar Yusuf',
    competencies: ['Scientific Inquiry', 'UAE Labor Market: Renewable Energy'],
  },
  // Lessons – Unit 1 Math
  {
    id: 'les-001', parentId: 'unt-001', nodeType: 'lesson',
    title: 'Introduction to Quadratic Equations',
    description: 'Identify, form, and solve quadratic equations using factoring and the quadratic formula.',
    objectives: ['Define quadratic equations', 'Factor simple quadratics', 'Use the quadratic formula'],
    standardIds: ['std-001'], duration: 3, status: 'published',
    version: 3, updatedAt: '2026-03-20', updatedBy: 'Sarah Al-Ahmad',
    competencies: ['Algebraic Thinking', 'Problem Solving'],
    assessmentIds: ['asmnt-001', 'asmnt-002'],
  },
  {
    id: 'les-002', parentId: 'unt-001', nodeType: 'lesson',
    title: 'Graphing Parabolas',
    description: 'Sketch and analyse parabolas using vertex form, axis of symmetry, and key features.',
    objectives: ['Identify vertex and axis', 'Sketch parabolas', 'Interpret real-world graphs'],
    standardIds: ['std-001'], duration: 3, status: 'published',
    version: 1, updatedAt: '2026-02-10', updatedBy: 'Sarah Al-Ahmad',
    competencies: ['Algebraic Thinking', 'Digital Literacy'],
    assessmentIds: ['asmnt-002', 'asmnt-003'],
  },
  {
    id: 'les-003', parentId: 'unt-001', nodeType: 'lesson',
    title: 'Discriminant and Nature of Roots',
    description: 'Use the discriminant to determine the number and type of roots of a quadratic.',
    objectives: ['Calculate the discriminant', 'Classify root types', 'Link to graph intersections'],
    standardIds: ['std-001'], duration: 2, status: 'approved',
    version: 2, updatedAt: '2026-03-15', updatedBy: 'Sarah Al-Ahmad',
    competencies: ['Algebraic Thinking', 'Critical Thinking'],
    assessmentIds: ['asmnt-002'],
  },
  // Lessons – Unit 3 Physics
  {
    id: 'les-004', parentId: 'unt-003', nodeType: 'lesson',
    title: "Newton's Laws of Motion",
    description: "Explore all three of Newton's laws with real-world applications and problem solving.",
    objectives: ["State Newton's three laws", 'Apply free body diagrams', 'Solve force problems'],
    standardIds: ['std-003'], duration: 3, status: 'published',
    version: 2, updatedAt: '2026-03-18', updatedBy: 'Omar Yusuf',
    competencies: ['Scientific Inquiry', 'Engineering Design', 'UAE Labor Market: STEM Workforce'],
    assessmentIds: ['asmnt-004'],
  },
  {
    id: 'les-005', parentId: 'unt-003', nodeType: 'lesson',
    title: 'Kinematics: Motion in a Straight Line',
    description: 'Describe and calculate uniform and non-uniform motion using equations of motion.',
    objectives: ['Use SUVAT equations', 'Draw motion graphs', 'Solve projectile problems'],
    standardIds: ['std-003'], duration: 4, status: 'draft',
    version: 1, updatedAt: '2026-03-05', updatedBy: 'Omar Yusuf',
    competencies: ['Scientific Inquiry', 'Data Analysis'],
    assessmentIds: ['asmnt-005'],
  },
]

export function getNodeById(id: string): CurriculumNode | undefined {
  return curriculumNodes.find(n => n.id === id)
}

export function getChildNodes(parentId: string | null): CurriculumNode[] {
  return curriculumNodes.filter(n => n.parentId === parentId)
}

// ─── Standards ────────────────────────────────────────────────────────────────

export type Framework = 'KHDA' | 'MOE'

export type Standard = {
  id: string
  code: string
  description: string
  framework: Framework
  subject: string
  gradeLevel: string
}

export const standards: Standard[] = [
  { id: 'std-001', code: 'KHDA-M-4.2', description: 'Algebraic Reasoning: Solve and graph quadratic equations and inequalities', framework: 'KHDA', subject: 'Mathematics', gradeLevel: 'Grade 10' },
  { id: 'std-002', code: 'KHDA-M-5.1', description: 'Geometric Measurement: Apply coordinate geometry and trigonometric ratios', framework: 'KHDA', subject: 'Mathematics', gradeLevel: 'Grade 10' },
  { id: 'std-003', code: 'MOE-P-3.1',  description: 'Mechanics: Apply Newton\'s laws and energy conservation principles', framework: 'MOE',  subject: 'Physics',      gradeLevel: 'Grade 11' },
  { id: 'std-004', code: 'MOE-P-4.2',  description: 'Thermodynamics: Analyse heat transfer and gas law applications', framework: 'MOE',  subject: 'Physics',      gradeLevel: 'Grade 11' },
  { id: 'std-005', code: 'KHDA-E-2.3', description: 'Critical Reading: Analyse literary devices, tone, and authorial intent', framework: 'KHDA', subject: 'English',     gradeLevel: 'Grade 10' },
  { id: 'std-006', code: 'MOE-E-3.4',  description: 'Writing Proficiency: Construct structured persuasive and analytical essays', framework: 'MOE',  subject: 'English',     gradeLevel: 'Grade 10' },
  { id: 'std-007', code: 'KHDA-A-1.1', description: 'Arabic Grammar: Master advanced morphological and syntactical structures', framework: 'KHDA', subject: 'Arabic',      gradeLevel: 'Grade 11' },
  { id: 'std-008', code: 'MOE-A-5.1',  description: 'Classical Arabic: Identify and interpret classical poetic forms', framework: 'MOE',  subject: 'Arabic',      gradeLevel: 'Grade 11' },
  { id: 'std-009', code: 'KHDA-S-2.2', description: 'Scientific Inquiry: Design and evaluate experimental investigations', framework: 'KHDA', subject: 'Science',     gradeLevel: 'Grade 8' },
  { id: 'std-010', code: 'MOE-S-3.1',  description: 'Life Sciences: Understand cellular biology and photosynthesis processes', framework: 'MOE',  subject: 'Science',     gradeLevel: 'Grade 8' },
]

export const standardMappings: { nodeId: string; standardId: string }[] = [
  { nodeId: 'crs-001', standardId: 'std-001' },
  { nodeId: 'crs-001', standardId: 'std-002' },
  { nodeId: 'crs-002', standardId: 'std-003' },
  { nodeId: 'crs-002', standardId: 'std-004' },
  { nodeId: 'unt-001', standardId: 'std-001' },
  { nodeId: 'unt-002', standardId: 'std-002' },
  { nodeId: 'les-001', standardId: 'std-001' },
  { nodeId: 'les-002', standardId: 'std-001' },
]

export function getStandardById(id: string): Standard | undefined {
  return standards.find(s => s.id === id)
}

// ─── Lesson Templates ─────────────────────────────────────────────────────────

export type LessonTemplateSections = {
  objectives: string
  warmUp: string
  mainActivity: string
  assessment: string
  differentiation: string
  resources: string
}

export type LessonTemplate = {
  id: string
  title: string
  subject: string
  createdDate: string
  sections: LessonTemplateSections
}

export const lessonTemplates: LessonTemplate[] = [
  {
    id: 'tmpl-001',
    title: 'Inquiry-Based Science Lesson',
    subject: 'Science',
    createdDate: '2026-01-15',
    sections: {
      objectives: 'Students will formulate a hypothesis, design a controlled experiment, and draw data-supported conclusions.',
      warmUp: '5 min: Show a surprising phenomenon video and ask students to explain what they observe.',
      mainActivity: '30 min: Students work in groups to design and run a simple experiment using provided materials.',
      assessment: 'Exit ticket: written hypothesis + one conclusion based on results.',
      differentiation: 'Advanced: add a variable; Support: provide guided question scaffold.',
      resources: 'Lab materials list, safety guidelines poster, observation worksheet.',
    },
  },
  {
    id: 'tmpl-002',
    title: 'Socratic Seminar – Literature',
    subject: 'English',
    createdDate: '2026-01-22',
    sections: {
      objectives: 'Students will analyse a text passage and engage in structured evidence-based discussion.',
      warmUp: '5 min: Independent annotation of a short excerpt.',
      mainActivity: '35 min: Inner/outer circle Socratic seminar. Inner circle discusses while outer circle observes and takes notes.',
      assessment: 'Self-assessment rubric: quality of contributions, use of evidence.',
      differentiation: 'Provide sentence starters for ELL students; challenge advanced students with counterargument roles.',
      resources: 'Discussion norms anchor chart, annotation guide, self-assessment rubric.',
    },
  },
  {
    id: 'tmpl-003',
    title: 'Problem-Based Maths Lesson',
    subject: 'Mathematics',
    createdDate: '2026-02-03',
    sections: {
      objectives: 'Students will apply mathematical reasoning to solve a real-world problem using multiple strategies.',
      warmUp: '5 min: Number talk — mental maths problem to activate prior knowledge.',
      mainActivity: '30 min: Groups work through a real-world scenario requiring multi-step problem solving.',
      assessment: 'Gallery walk: groups present solutions; peer feedback using sticky notes.',
      differentiation: 'Provide formula sheet for struggling students; ask advanced students to generalise the solution.',
      resources: 'Problem scenario cards, manipulatives, graph paper.',
    },
  },
  {
    id: 'tmpl-004',
    title: 'Arabic Poetry Analysis',
    subject: 'Arabic',
    createdDate: '2026-02-18',
    sections: {
      objectives: 'Students will identify poetic devices, analyse tone and imagery, and write a critical response.',
      warmUp: '5 min: Read aloud a famous Arabic couplet; students share immediate reactions.',
      mainActivity: '25 min: Guided annotation of a full poem followed by small group discussion.',
      assessment: 'Short written response: identify two literary devices with textual evidence.',
      differentiation: 'Heritage speakers: write a comparative response; beginners: complete a guided annotation sheet.',
      resources: 'Annotated poem handout, literary devices reference card, response template.',
    },
  },
  {
    id: 'tmpl-005',
    title: 'Flipped Classroom – Physics Concept',
    subject: 'Physics',
    createdDate: '2026-03-05',
    sections: {
      objectives: 'Students will demonstrate understanding of a pre-watched concept video through collaborative application.',
      warmUp: '5 min: Quiz on key concepts from the homework video (3 questions).',
      mainActivity: '30 min: Peer instruction + problem-solving stations applying the concept.',
      assessment: 'Think-pair-share: each pair explains the concept in their own words.',
      differentiation: 'Provide concept summary cards; advanced students design their own example problem.',
      resources: 'Pre-watch video link, concept summary card, station worksheets.',
    },
  },
]

// ─── Curriculum Resources ─────────────────────────────────────────────────────

export type ResourceType = 'video' | 'document' | 'quiz' | 'interactive'

export type CurriculumResource = {
  id: string
  name: string
  resourceType: ResourceType
  subject: string
  gradeLevel: string
  uploadDate: string
  linkedLessonIds: string[]
}

export const curriculumResources: CurriculumResource[] = [
  { id: 'res-001', name: 'Quadratic Functions Visual Guide', resourceType: 'interactive', subject: 'Mathematics', gradeLevel: 'Grade 10', uploadDate: '2026-01-10', linkedLessonIds: ['les-001', 'les-002'] },
  { id: 'res-002', name: 'Parabola Sketching Tutorial', resourceType: 'video', subject: 'Mathematics', gradeLevel: 'Grade 10', uploadDate: '2026-01-14', linkedLessonIds: ['les-002'] },
  { id: 'res-003', name: 'Algebra Practice Worksheet', resourceType: 'document', subject: 'Mathematics', gradeLevel: 'Grade 10', uploadDate: '2026-01-20', linkedLessonIds: ['les-001', 'les-003'] },
  { id: 'res-004', name: 'Newton\'s Laws Quiz', resourceType: 'quiz', subject: 'Physics', gradeLevel: 'Grade 11', uploadDate: '2026-02-05', linkedLessonIds: ['les-004'] },
  { id: 'res-005', name: 'Forces & Motion Simulation', resourceType: 'interactive', subject: 'Physics', gradeLevel: 'Grade 11', uploadDate: '2026-02-08', linkedLessonIds: ['les-004', 'les-005'] },
  { id: 'res-006', name: 'Kinematics Equations Reference', resourceType: 'document', subject: 'Physics', gradeLevel: 'Grade 11', uploadDate: '2026-02-12', linkedLessonIds: ['les-005'] },
  { id: 'res-007', name: 'Arabic Poetry Anthology – Vol 1', resourceType: 'document', subject: 'Arabic', gradeLevel: 'Grade 11', uploadDate: '2026-02-20', linkedLessonIds: [] },
  { id: 'res-008', name: 'Scientific Method Lab Series', resourceType: 'video', subject: 'Science', gradeLevel: 'Grade 8', uploadDate: '2026-03-01', linkedLessonIds: [] },
]
