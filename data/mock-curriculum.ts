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
  },
  {
    id: 'unt-002', parentId: 'crs-001', nodeType: 'unit',
    title: 'Unit 2: Geometry & Measurement',
    description: 'Plane and solid geometry, coordinate geometry, and measurement applications.',
    objectives: ['Apply Pythagorean theorem', 'Calculate areas and volumes', 'Use coordinate geometry'],
    standardIds: ['std-002'], duration: 28, status: 'approved',
  },
  // Units – Physics
  {
    id: 'unt-003', parentId: 'crs-002', nodeType: 'unit',
    title: 'Unit 1: Mechanics',
    description: 'Kinematics, dynamics, work-energy theorem, and momentum.',
    objectives: ["Apply Newton's laws", 'Solve kinematics problems', 'Analyse energy transformations'],
    standardIds: ['std-003'], duration: 32, status: 'published',
  },
  {
    id: 'unt-004', parentId: 'crs-002', nodeType: 'unit',
    title: 'Unit 2: Thermodynamics',
    description: 'Heat transfer, gas laws, and thermodynamic cycles.',
    objectives: ['Apply gas laws', 'Understand entropy', 'Analyse thermodynamic cycles'],
    standardIds: ['std-004'], duration: 26, status: 'under-review',
  },
  // Lessons – Unit 1 Math
  {
    id: 'les-001', parentId: 'unt-001', nodeType: 'lesson',
    title: 'Introduction to Quadratic Equations',
    description: 'Identify, form, and solve quadratic equations using factoring and the quadratic formula.',
    objectives: ['Define quadratic equations', 'Factor simple quadratics', 'Use the quadratic formula'],
    standardIds: ['std-001'], duration: 3, status: 'published',
  },
  {
    id: 'les-002', parentId: 'unt-001', nodeType: 'lesson',
    title: 'Graphing Parabolas',
    description: 'Sketch and analyse parabolas using vertex form, axis of symmetry, and key features.',
    objectives: ['Identify vertex and axis', 'Sketch parabolas', 'Interpret real-world graphs'],
    standardIds: ['std-001'], duration: 3, status: 'published',
  },
  {
    id: 'les-003', parentId: 'unt-001', nodeType: 'lesson',
    title: 'Discriminant and Nature of Roots',
    description: 'Use the discriminant to determine the number and type of roots of a quadratic.',
    objectives: ['Calculate the discriminant', 'Classify root types', 'Link to graph intersections'],
    standardIds: ['std-001'], duration: 2, status: 'approved',
  },
  // Lessons – Unit 3 Physics
  {
    id: 'les-004', parentId: 'unt-003', nodeType: 'lesson',
    title: "Newton's Laws of Motion",
    description: "Explore all three of Newton's laws with real-world applications and problem solving.",
    objectives: ["State Newton's three laws", 'Apply free body diagrams', 'Solve force problems'],
    standardIds: ['std-003'], duration: 3, status: 'published',
  },
  {
    id: 'les-005', parentId: 'unt-003', nodeType: 'lesson',
    title: 'Kinematics: Motion in a Straight Line',
    description: 'Describe and calculate uniform and non-uniform motion using equations of motion.',
    objectives: ['Use SUVAT equations', 'Draw motion graphs', 'Solve projectile problems'],
    standardIds: ['std-003'], duration: 4, status: 'draft',
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
