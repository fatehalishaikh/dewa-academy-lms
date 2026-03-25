// ─── Types ───────────────────────────────────────────────────────────────────

export type LearningStyle = 'Visual' | 'Auditory' | 'Reading-Writing' | 'Kinesthetic'
export type PathwayStage = 'Assessment' | 'Foundation' | 'Core' | 'Practice' | 'Mastery' | 'Enrichment' | 'Reflection'
export type RiskLevel = 'high' | 'moderate' | 'low' | 'none'
export type GoalCategory = 'Academic' | 'Career' | 'Personal' | 'Behavioral'
export type ContentType = 'Video' | 'Document' | 'Interactive' | 'Quiz'
export type ContentStatus = 'Published' | 'Draft' | 'Processing' | 'Archived'
export type TriggerStatus = 'active' | 'inactive'
export type RuleStatus = 'Active' | 'Draft' | 'Disabled'

// ─── Dashboard Widget Types ───────────────────────────────────────────────────

export type StyleDistribution = { style: LearningStyle; count: number; pct: number; color: string }

export type RecentAssessment = {
  name: string; initials: string; style: LearningStyle; strengths: string[]
  barriers: string[]; confidence: number; date: string
}

export type StageDistribution = { stage: PathwayStage; count: number }

export type PathwayRecommendation = {
  id: string; student: string; initials: string
  from: PathwayStage; to: PathwayStage; subject: string; reason: string
}

export type RiskTimelinePoint = { date: string; actual: number | null; predicted: number | null }

export type IlpRiskStudent = {
  name: string; initials: string; riskScore: number; riskLevel: RiskLevel
  factors: string[]; trend: 'up' | 'down' | 'flat'
}

export type ProgressTimelinePoint = { week: string; completion: number; engagement: number }

export type NotificationEvent = {
  type: 'milestone' | 'alert' | 'status_change'; text: string; student: string; timeAgo: string
}

export type GoalCompletion = { category: GoalCategory; completed: number; active: number; color: string }

export type StudentGoal = {
  student: string; initials: string; goal: string; category: GoalCategory
  progress: number; nextReflection: string; status: 'on_track' | 'at_risk' | 'completed'
}

// ─── Config Screen Types ──────────────────────────────────────────────────────

export type FieldMapping = {
  source: string; mapsTo: string; status: 'mapped' | 'unmapped' | 'auto'
}

export type DiagnosticAssessment = {
  id: string; name: string; type: 'Diagnostic' | 'Formative' | 'Summative'
  duration: number; enabled: boolean
}

export type ThresholdBand = { label: string; min: number; max: number; color: string }

export type PathwayStageConfig = {
  id: number; name: PathwayStage; description: string
  durationWeeks: number; studentCount: number; criteria: string[]
}

export type AdvancementRule = {
  from: PathwayStage; to: PathwayStage; criteria: string; autoAdvance: boolean
}

export type CurationRule = {
  id: string; name: string; preview: string; status: RuleStatus
  template: string; conditions: Array<{ field: string; operator: string; value: string }>
  affectedStudents: number
}

export type RiskFactor = { name: string; weight: number; description: string }

export type InterventionStep = { text: string; icon: string }

export type InterventionPlaybook = {
  level: 'high' | 'moderate' | 'low'; label: string; steps: InterventionStep[]
}

export type NotificationChannel = {
  name: string; icon: string; enabled: boolean; recipientCount: number
}

export type AutomationTrigger = {
  id: string; event: string; condition: string; action: string
  recipients: string; enabled: boolean
}

export type GoalTemplate = {
  id: string; name: string; category: GoalCategory; targetType: 'Percentage' | 'Count' | 'Boolean' | 'Date'
}

export type ReflectionPrompt = { id: string; text: string }

export type ContentItem = {
  id: string; title: string; type: ContentType; subject: string
  level: PathwayStage; tags: string[]; status: ContentStatus
}

export type ImportRecord = { date: string; records: number; status: 'Success' | 'Partial' | 'Failed' }

// ─── Dashboard Data ───────────────────────────────────────────────────────────

export const styleDistribution: StyleDistribution[] = [
  { style: 'Visual', count: 109, pct: 38, color: '#00B8A9' },
  { style: 'Auditory', count: 69, pct: 24, color: '#3B82F6' },
  { style: 'Reading-Writing', count: 60, pct: 21, color: '#4CAF50' },
  { style: 'Kinesthetic', count: 49, pct: 17, color: '#FFC107' },
]

export const recentAssessments: RecentAssessment[] = [
  {
    name: 'Ahmed Al-Rashid', initials: 'AA', style: 'Visual',
    strengths: ['Geometry', 'Data Analysis'], barriers: ['Algebra'], confidence: 94, date: 'Today'
  },
  {
    name: 'Fatima Hassan', initials: 'FH', style: 'Auditory',
    strengths: ['English Literature', 'Arabic'], barriers: ['Chemistry'], confidence: 88, date: 'Today'
  },
  {
    name: 'Omar Khalil', initials: 'OK', style: 'Kinesthetic',
    strengths: ['Physics Labs'], barriers: ['Essay Writing', 'Algebra'], confidence: 71, date: 'Yesterday'
  },
  {
    name: 'Noor Al-Ali', initials: 'NA', style: 'Reading-Writing',
    strengths: ['History', 'Biology'], barriers: ['Math'], confidence: 83, date: 'Yesterday'
  },
]

export const stageDistribution: StageDistribution[] = [
  { stage: 'Assessment', count: 12 },
  { stage: 'Foundation', count: 38 },
  { stage: 'Core', count: 87 },
  { stage: 'Practice', count: 64 },
  { stage: 'Mastery', count: 51 },
  { stage: 'Enrichment', count: 24 },
  { stage: 'Reflection', count: 11 },
]

export const pathwayRecommendations: PathwayRecommendation[] = [
  {
    id: '1', student: 'Ahmed Al-Rashid', initials: 'AA',
    from: 'Foundation', to: 'Core', subject: 'Mathematics',
    reason: 'Scored 82% on foundation quiz'
  },
  {
    id: '2', student: 'Sara Al-Mansoori', initials: 'SM',
    from: 'Core', to: 'Practice', subject: 'English',
    reason: 'Completed all core modules'
  },
  {
    id: '3', student: 'Omar Khalil', initials: 'OK',
    from: 'Core', to: 'Foundation', subject: 'Chemistry',
    reason: '3 consecutive score drops detected'
  },
  {
    id: '4', student: 'Layla Mahmoud', initials: 'LM',
    from: 'Practice', to: 'Mastery', subject: 'Physics',
    reason: '91% practice set completion'
  },
]

// Risk timeline: 14 actual + 14 predicted (bridge at index 13)
const riskDates = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(2026, 2, 11 + i)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
const riskActuals = [32, 34, 35, 38, 36, 40, 42, 39, 43, 45, 44, 47, 46, 48]
const riskPredicted = [48, 51, 53, 55, 54, 57, 60, 58, 62, 65, 63, 67, 65, 68, 70]

export const riskTimeline: RiskTimelinePoint[] = riskDates.map((date, i) => ({
  date,
  actual: i < 14 ? riskActuals[i] : null,
  predicted: i >= 13 ? riskPredicted[i - 13] : null,
}))

export const ilpRiskStudents: IlpRiskStudent[] = [
  {
    name: 'Omar Khalil', initials: 'OK', riskScore: 78, riskLevel: 'high',
    factors: ['Declining grades', 'Low engagement'], trend: 'down'
  },
  {
    name: 'Tariq Hassan', initials: 'TH', riskScore: 65, riskLevel: 'moderate',
    factors: ['Missing assignments'], trend: 'flat'
  },
  {
    name: 'Reem Al-Zaabi', initials: 'RZ', riskScore: 61, riskLevel: 'moderate',
    factors: ['Attendance: 68%'], trend: 'down'
  },
  {
    name: 'Youssef Nabil', initials: 'YN', riskScore: 38, riskLevel: 'low',
    factors: [], trend: 'up'
  },
  {
    name: 'Noor Al-Ali', initials: 'NA', riskScore: 22, riskLevel: 'none',
    factors: [], trend: 'up'
  },
]

export const progressTimeline: ProgressTimelinePoint[] = [
  { week: 'W1', completion: 42, engagement: 55 },
  { week: 'W2', completion: 48, engagement: 60 },
  { week: 'W3', completion: 53, engagement: 58 },
  { week: 'W4', completion: 59, engagement: 65 },
  { week: 'W5', completion: 61, engagement: 62 },
  { week: 'W6', completion: 65, engagement: 70 },
  { week: 'W7', completion: 68, engagement: 68 },
  { week: 'W8', completion: 72, engagement: 74 },
  { week: 'W9', completion: 74, engagement: 71 },
  { week: 'W10', completion: 78, engagement: 76 },
  { week: 'W11', completion: 76, engagement: 78 },
  { week: 'W12', completion: 81, engagement: 82 },
]

export const recentNotifications: NotificationEvent[] = [
  { type: 'milestone', text: 'Completed Mathematics Core module', student: 'Ahmed Al-Rashid', timeAgo: '10 min ago' },
  { type: 'alert', text: 'Inactive for 4 days — intervention suggested', student: 'Omar Khalil', timeAgo: '2 hrs ago' },
  { type: 'status_change', text: 'Status changed: On Track → At-Risk', student: 'Reem Al-Zaabi', timeAgo: '5 hrs ago' },
  { type: 'milestone', text: 'Achieved Mastery badge in English', student: 'Sara Al-Mansoori', timeAgo: 'Yesterday' },
]

export const goalCompletions: GoalCompletion[] = [
  { category: 'Academic', completed: 58, active: 124, color: '#00B8A9' },
  { category: 'Career', completed: 24, active: 67, color: '#3B82F6' },
  { category: 'Personal', completed: 38, active: 56, color: '#4CAF50' },
  { category: 'Behavioral', completed: 22, active: 40, color: '#FFC107' },
]

export const studentGoals: StudentGoal[] = [
  {
    student: 'Ahmed Al-Rashid', initials: 'AA',
    goal: 'Improve Mathematics grade to 85%', category: 'Academic',
    progress: 72, nextReflection: 'Mar 27', status: 'on_track'
  },
  {
    student: 'Fatima Hassan', initials: 'FH',
    goal: 'Complete engineering career pathway modules', category: 'Career',
    progress: 45, nextReflection: 'Mar 28', status: 'on_track'
  },
  {
    student: 'Omar Khalil', initials: 'OK',
    goal: 'Maintain 80%+ assignment submission rate', category: 'Behavioral',
    progress: 38, nextReflection: 'Mar 26', status: 'at_risk'
  },
  {
    student: 'Noor Al-Ali', initials: 'NA',
    goal: 'Read 5 Arabic literature books this term', category: 'Personal',
    progress: 60, nextReflection: 'Apr 1', status: 'on_track'
  },
  {
    student: 'Sara Al-Mansoori', initials: 'SM',
    goal: 'Earn English Mastery certification', category: 'Academic',
    progress: 100, nextReflection: 'Completed', status: 'completed'
  },
]

// ─── Config Screen Data ───────────────────────────────────────────────────────

export const fieldMappings: FieldMapping[] = [
  { source: 'student_id', mapsTo: 'Student ID', status: 'auto' },
  { source: 'full_name', mapsTo: 'Full Name', status: 'auto' },
  { source: 'grade_level', mapsTo: 'Grade Level', status: 'auto' },
  { source: 'section', mapsTo: 'Class / Section', status: 'auto' },
  { source: 'gpa_current', mapsTo: 'Current GPA', status: 'mapped' },
  { source: 'att_rate', mapsTo: 'Attendance Rate', status: 'mapped' },
  { source: 'eng_score_raw', mapsTo: '', status: 'unmapped' },
]

export const importHistory: ImportRecord[] = [
  { date: 'Mar 24, 2026', records: 248, status: 'Success' },
  { date: 'Mar 10, 2026', records: 245, status: 'Success' },
  { date: 'Feb 24, 2026', records: 241, status: 'Partial' },
]

export const diagnosticAssessments: DiagnosticAssessment[] = [
  { id: '1', name: 'Mathematics Placement', type: 'Diagnostic', duration: 30, enabled: true },
  { id: '2', name: 'Reading Comprehension Level', type: 'Diagnostic', duration: 20, enabled: true },
  { id: '3', name: 'Learning Style Inventory', type: 'Diagnostic', duration: 15, enabled: true },
  { id: '4', name: 'Prior Knowledge Baseline', type: 'Formative', duration: 25, enabled: false },
]

export const thresholdBands: ThresholdBand[] = [
  { label: 'Advanced', min: 85, max: 100, color: '#00B8A9' },
  { label: 'Standard Track', min: 60, max: 84, color: '#3B82F6' },
  { label: 'Support Required', min: 0, max: 59, color: '#EF4444' },
]

export const pathwayStageConfigs: PathwayStageConfig[] = [
  {
    id: 1, name: 'Assessment', description: 'Initial diagnostic to identify gaps and strengths',
    durationWeeks: 1, studentCount: 12,
    criteria: ['Complete diagnostic quiz', 'Submit learning style survey']
  },
  {
    id: 2, name: 'Foundation', description: 'Prerequisite and remedial content for identified gaps',
    durationWeeks: 3, studentCount: 38,
    criteria: ['Score ≥ 70% on foundation quiz', 'Watch all prerequisite videos']
  },
  {
    id: 3, name: 'Core', description: 'Main curriculum content, paced to student ability',
    durationWeeks: 6, studentCount: 87,
    criteria: ['Complete 80% of core modules', 'Score ≥ 65% on core assessment']
  },
  {
    id: 4, name: 'Mastery', description: 'Assessment to confirm deep understanding',
    durationWeeks: 2, studentCount: 51,
    criteria: ['Score ≥ 80% on mastery test', 'Complete practical project']
  },
  {
    id: 5, name: 'Enrichment', description: 'Extension content for students who demonstrate mastery',
    durationWeeks: 4, studentCount: 24,
    criteria: ['Complete 2 enrichment modules', 'Peer mentoring session']
  },
]

export const advancementRules: AdvancementRule[] = [
  { from: 'Assessment', to: 'Foundation', criteria: 'Score < 70% on diagnostic', autoAdvance: true },
  { from: 'Assessment', to: 'Core', criteria: 'Score ≥ 70% on diagnostic', autoAdvance: true },
  { from: 'Foundation', to: 'Core', criteria: 'Score ≥ 70% on foundation quiz', autoAdvance: true },
  { from: 'Core', to: 'Mastery', criteria: '80% module completion + 65% on core assessment', autoAdvance: false },
  { from: 'Mastery', to: 'Enrichment', criteria: 'Score ≥ 80% on mastery test', autoAdvance: true },
]

export const curationRules: CurationRule[] = [
  {
    id: '1', name: 'Visual Learner Persona', status: 'Active',
    preview: 'Prioritize video demonstrations and animated explainers. Minimize text-heavy content...',
    template: 'Learning Style Matching',
    conditions: [{ field: 'learning_style', operator: '=', value: 'Visual' }],
    affectedStudents: 109
  },
  {
    id: '2', name: 'At-Risk Math Intervention', status: 'Active',
    preview: 'If Math grade < 60%, serve foundational arithmetic before new topics. Insert quiz every 3 videos...',
    template: 'Score-based Assignment',
    conditions: [
      { field: 'course_grade.mathematics', operator: '<', value: '60' },
      { field: 'risk_score', operator: '>', value: '60' }
    ],
    affectedStudents: 23
  },
  {
    id: '3', name: 'Excelling Student Enrichment', status: 'Active',
    preview: 'Skip foundational reviews. Offer enrichment content and cross-disciplinary connections...',
    template: 'Score-based Assignment',
    conditions: [{ field: 'course_grade', operator: '>', value: '88' }],
    affectedStudents: 41
  },
  {
    id: '4', name: 'Kinesthetic Lab Boost', status: 'Draft',
    preview: 'Prioritize interactive simulations, lab exercises, and hands-on project videos...',
    template: 'Learning Style Matching',
    conditions: [{ field: 'learning_style', operator: '=', value: 'Kinesthetic' }],
    affectedStudents: 49
  },
  {
    id: '5', name: 'Physics-Math Cross-dep', status: 'Draft',
    preview: 'If struggling in Physics AND Math, prioritize Math foundations first...',
    template: 'Course Dependency',
    conditions: [
      { field: 'course_grade.physics', operator: '<', value: '65' },
      { field: 'course_grade.mathematics', operator: '<', value: '65' }
    ],
    affectedStudents: 8
  },
  {
    id: '6', name: 'Inactivity Re-engagement', status: 'Disabled',
    preview: 'After 3+ days inactive, serve short 2-minute re-engagement videos with motivational content...',
    template: 'Time-based Progression',
    conditions: [{ field: 'days_inactive', operator: '>=', value: '3' }],
    affectedStudents: 0
  },
]

export const riskFactors: RiskFactor[] = [
  { name: 'Assessment Score', weight: 35, description: 'Current and trending grade performance' },
  { name: 'Attendance Rate', weight: 25, description: 'Physical and virtual session attendance' },
  { name: 'Assignment Completion', weight: 25, description: 'Submission rate and timeliness' },
  { name: 'Platform Engagement', weight: 15, description: 'BlinkLink session duration and interaction' },
]

export const interventionPlaybooks: InterventionPlaybook[] = [
  {
    level: 'high', label: 'High Risk Protocol',
    steps: [
      { text: 'Alert counselor and department head immediately', icon: 'Bell' },
      { text: 'Notify parent/guardian via email and SMS', icon: 'Mail' },
      { text: 'Pause content advancement — serve foundational review', icon: 'PauseCircle' },
      { text: 'Schedule 1:1 advisor session within 48 hours', icon: 'Calendar' },
      { text: 'Weekly progress check-in and ILP review', icon: 'ClipboardCheck' },
    ]
  },
  {
    level: 'moderate', label: 'Moderate Risk Protocol',
    steps: [
      { text: 'Notify class teacher with recommended actions', icon: 'Bell' },
      { text: 'Adjust BlinkLink content feed to remedial pathway', icon: 'Route' },
      { text: 'Assign peer study partner or tutor', icon: 'Users' },
    ]
  },
  {
    level: 'low', label: 'Low Risk Protocol',
    steps: [
      { text: 'Monitor weekly — no immediate action required', icon: 'Eye' },
      { text: 'Send motivational in-app notification to student', icon: 'MessageCircle' },
    ]
  },
]

export const notificationChannels: NotificationChannel[] = [
  { name: 'Email', icon: 'Mail', enabled: true, recipientCount: 287 },
  { name: 'SMS', icon: 'MessageSquare', enabled: true, recipientCount: 183 },
  { name: 'In-App', icon: 'Bell', enabled: true, recipientCount: 287 },
  { name: 'Dashboard', icon: 'Monitor', enabled: false, recipientCount: 0 },
]

export const automationTriggers: AutomationTrigger[] = [
  { id: '1', event: 'Risk level changes', condition: 'To High Risk (score > 70)', action: 'Alert counselor + parent', recipients: 'Counselors, Parents', enabled: true },
  { id: '2', event: 'Goal deadline approaching', condition: '3 days before due date', action: 'Email reminder', recipients: 'Student, Parent', enabled: true },
  { id: '3', event: 'Pathway stage completed', condition: 'Any stage', action: 'Celebration notification', recipients: 'Student', enabled: true },
  { id: '4', event: 'Assessment score drops', condition: '< 50% on any quiz', action: 'Flag for teacher review', recipients: 'Teacher', enabled: false },
  { id: '5', event: 'Student inactive', condition: '3+ days without login', action: 'Re-engagement push notification', recipients: 'Student', enabled: true },
  { id: '6', event: 'Monthly ILP review', condition: 'First Monday of month', action: 'Schedule review meeting', recipients: 'Teacher, Student', enabled: true },
]

export const goalTemplates: GoalTemplate[] = [
  { id: '1', name: 'Academic Improvement', category: 'Academic', targetType: 'Percentage' },
  { id: '2', name: 'Attendance Target', category: 'Behavioral', targetType: 'Percentage' },
  { id: '3', name: 'Skills Development', category: 'Career', targetType: 'Count' },
  { id: '4', name: 'Reading Goal', category: 'Personal', targetType: 'Count' },
  { id: '5', name: 'Project Completion', category: 'Academic', targetType: 'Boolean' },
]

export const reflectionPrompts: ReflectionPrompt[] = [
  { id: '1', text: 'What progress have you made toward your goal this week?' },
  { id: '2', text: 'What challenges did you face and how did you address them?' },
  { id: '3', text: 'What support do you need from your teachers or advisors?' },
]

export const contentItems: ContentItem[] = [
  { id: '1', title: 'Algebra Foundations Module', type: 'Video', subject: 'Mathematics', level: 'Foundation', tags: ['remedial', 'basics', 'algebra'], status: 'Published' },
  { id: '2', title: 'Physics Lab Simulation — Forces', type: 'Interactive', subject: 'Physics', level: 'Core', tags: ['lab', 'simulation', 'forces'], status: 'Published' },
  { id: '3', title: 'Essay Writing Structure Guide', type: 'Document', subject: 'English', level: 'Foundation', tags: ['writing', 'structure'], status: 'Published' },
  { id: '4', title: 'Advanced Calculus Problems', type: 'Quiz', subject: 'Mathematics', level: 'Enrichment', tags: ['advanced', 'calculus'], status: 'Published' },
  { id: '5', title: 'Arabic Literature — Modern Poetry', type: 'Video', subject: 'Arabic', level: 'Core', tags: ['poetry', 'literature'], status: 'Draft' },
  { id: '6', title: 'Chemistry Periodic Table Interactive', type: 'Interactive', subject: 'Chemistry', level: 'Core', tags: ['elements', 'periodic'], status: 'Published' },
  { id: '7', title: 'Scientific Method Step-by-Step', type: 'Video', subject: 'Science', level: 'Foundation', tags: ['method', 'experiment'], status: 'Published' },
  { id: '8', title: 'Career Pathways in STEM', type: 'Document', subject: 'Career', level: 'Enrichment', tags: ['careers', 'stem'], status: 'Draft' },
  { id: '9', title: 'Reading Comprehension Strategies', type: 'Video', subject: 'English', level: 'Foundation', tags: ['reading', 'comprehension'], status: 'Processing' },
  { id: '10', title: 'History of UAE — Modern Era', type: 'Document', subject: 'Social Studies', level: 'Core', tags: ['uae', 'history'], status: 'Published' },
]
