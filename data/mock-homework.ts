import type { ExamQuestion } from '@/data/mock-assessments'

export type { ExamQuestion }

export type RubricItem = {
  id: string
  label: string
  maxPoints: number
}

export type Homework = {
  id: string
  title: string
  description: string
  instructions: string
  classId: string
  teacherId: string
  subject: string
  dueDate: string
  createdDate: string
  status: 'draft' | 'published' | 'closed'
  totalPoints: number
  aiGenerated: boolean
  rubric: RubricItem[]
  questions?: ExamQuestion[]
}

export type Submission = {
  id: string
  homeworkId: string
  studentId: string
  submittedDate: string | null
  status: 'not-submitted' | 'submitted' | 'late' | 'graded'
  grade: number | null
  feedback: string | null
  aiScore: number | null
  aiFeedback: string | null
  content: string | null
}

export const initialHomework: Homework[] = [
  {
    id: 'hw-001',
    title: 'Quadratic Equations Problem Set',
    description: 'Solve a series of quadratic equations using the quadratic formula and factorisation methods. Show all working clearly.',
    instructions: 'Complete problems 1–20 from Chapter 5. Show all steps. Box your final answers. Use the quadratic formula for at least 5 problems.',
    classId: 'cls-001',
    teacherId: 'tch-001',
    subject: 'Mathematics',
    dueDate: '2026-03-27',
    createdDate: '2026-03-20',
    status: 'published',
    totalPoints: 20,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Correct working shown', maxPoints: 8 },
      { id: 'r2', label: 'Final answers correct', maxPoints: 8 },
      { id: 'r3', label: 'Presentation & clarity', maxPoints: 4 },
    ],
  },
  {
    id: 'hw-002',
    title: 'Statistics: Data Collection & Analysis',
    description: 'Collect data from your household and analyse it using mean, median, mode and range. Present findings as a report.',
    instructions: 'Collect at least 20 data points (e.g., daily temperatures, expenses). Calculate all measures of central tendency. Draw at least one appropriate graph.',
    classId: 'cls-002',
    teacherId: 'tch-001',
    subject: 'Mathematics',
    dueDate: '2026-03-29',
    createdDate: '2026-03-22',
    status: 'published',
    totalPoints: 30,
    aiGenerated: true,
    rubric: [
      { id: 'r1', label: 'Data collection quality', maxPoints: 6 },
      { id: 'r2', label: 'Calculations accurate', maxPoints: 12 },
      { id: 'r3', label: 'Graph appropriate & labelled', maxPoints: 8 },
      { id: 'r4', label: 'Written analysis', maxPoints: 4 },
    ],
  },
  {
    id: 'hw-003',
    title: 'Algebra Mid-Unit Review',
    description: 'Comprehensive review covering linear equations, simultaneous equations, and inequalities from Units 3 and 4.',
    instructions: 'Answer all 25 questions. Show all working. Time yourself — this should take no more than 60 minutes.',
    classId: 'cls-001',
    teacherId: 'tch-001',
    subject: 'Mathematics',
    dueDate: '2026-04-03',
    createdDate: '2026-03-25',
    status: 'draft',
    totalPoints: 50,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Linear equations (Q1–8)', maxPoints: 16 },
      { id: 'r2', label: 'Simultaneous equations (Q9–16)', maxPoints: 16 },
      { id: 'r3', label: 'Inequalities (Q17–25)', maxPoints: 18 },
    ],
  },
]

export const initialSubmissions: Submission[] = [
  // hw-001 submissions (cls-001: stu-001, stu-004, stu-012)
  {
    id: 'sub-001',
    homeworkId: 'hw-001',
    studentId: 'stu-001',
    submittedDate: '2026-03-26',
    status: 'submitted',
    grade: null,
    feedback: null,
    aiScore: 17,
    aiFeedback: 'Strong working shown throughout. Minor arithmetic error in Q14. Excellent use of the quadratic formula. Presentation is clear and professional.',
    content: `Problem Set Solutions — Ahmed Al-Rashid

Q1: x² - 5x + 6 = 0
Using factorisation: (x-2)(x-3) = 0
Therefore x = 2 or x = 3 ✓

Q2: 2x² + 7x + 3 = 0
Using quadratic formula: x = (-7 ± √(49-24)) / 4 = (-7 ± 5) / 4
x = -0.5 or x = -3 ✓

Q3: x² - 4x - 12 = 0
(x-6)(x+2) = 0
x = 6 or x = -2 ✓

[... continued for all 20 problems with full working shown]

Summary: All 20 problems attempted. Used quadratic formula for Q6, Q9, Q12, Q15, Q18 as required.`,
  },
  {
    id: 'sub-002',
    homeworkId: 'hw-001',
    studentId: 'stu-004',
    submittedDate: '2026-03-26',
    status: 'submitted',
    grade: null,
    feedback: null,
    aiScore: 14,
    aiFeedback: 'Good attempt overall. Working shown for most problems but some answers lack the required steps. Q7-Q11 answers are correct but working is incomplete. Q16 has an error in the discriminant calculation.',
    content: `Sara Al-Zaabi — Chapter 5 Assignment

Q1: x² - 5x + 6 = 0 → x = 2 or x = 3

Q2: 2x² + 7x + 3 = 0
Quadratic formula: a=2, b=7, c=3
x = (-7 ± √(49-24)) / 4 = (-7 ± 5) / 4
x₁ = -0.5, x₂ = -3 ✓

Q3: (x-6)(x+2) = 0 → x = 6 or x = -2

[Problems 4-15 with answers but limited working shown]

Q16: 3x² - 2x - 8 = 0
Discriminant = 4 + 96 = 100 (note: minor error in original)
x = (2 ± 10) / 6
x = 2 or x = -4/3`,
  },
  {
    id: 'sub-003',
    homeworkId: 'hw-001',
    studentId: 'stu-012',
    submittedDate: null,
    status: 'not-submitted',
    grade: null,
    feedback: null,
    aiScore: null,
    aiFeedback: null,
    content: null,
  },
  // hw-002 submissions (cls-002: stu-002, stu-011)
  {
    id: 'sub-004',
    homeworkId: 'hw-002',
    studentId: 'stu-002',
    submittedDate: '2026-03-28',
    status: 'graded',
    grade: 27,
    feedback: 'Excellent data collection and analysis. Your graphs are well-labelled and the written analysis shows real insight. Minor deduction for not including the range in your summary table.',
    aiScore: 26,
    aiFeedback: 'High-quality submission. Data set is relevant and sufficiently large. All central tendency measures calculated correctly. Box plot is an excellent choice of graph. Written analysis is articulate.',
    content: `Fatima Hassan — Statistics Report

Data Collection: Daily electricity usage (kWh) over 30 days at home.
Dataset: [4.2, 3.8, 5.1, 4.7, 3.9, 6.2, 5.8, 4.1, 3.7, 4.9, ...]

Mean = 4.65 kWh
Median = 4.55 kWh
Mode = 4.2 kWh (appears 4 times)
Range = 2.8 kWh

Graph: Box plot showing spread of data with Q1=3.9, Q2=4.55, Q3=5.3

Analysis: The data shows that electricity usage is slightly higher on weekends (mean 5.1 kWh vs 4.3 kWh weekdays). The distribution is slightly right-skewed, suggesting occasional high-usage days likely due to air conditioning in extreme heat.`,
  },
  {
    id: 'sub-005',
    homeworkId: 'hw-002',
    studentId: 'stu-011',
    submittedDate: '2026-03-29',
    status: 'late',
    grade: null,
    feedback: null,
    aiScore: 21,
    aiFeedback: 'Submitted late (-5% penalty applies). The data collection is adequate but the sample size is borderline (20 points). Calculations are correct. The bar chart is appropriate. Written analysis could be expanded.',
    content: `Abdullah Al-Nuaimi — Statistics Assignment

I collected data about the number of steps walked each day for 20 days.
Steps data: [8500, 6200, 9100, 7800, 5400, ...]

Mean = 7,340 steps
Median = 7,600 steps
Mode = No clear mode
Range = 5,800 steps

Bar chart: [attached]

Analysis: My step count varies significantly day to day. School days I walk more due to PE class.`,
  },
]

// AI-generated content for the "Generate" button
export const aiHomeworkTemplates: Record<string, { title: string; description: string; instructions: string }[]> = {
  Mathematics: [
    {
      title: 'Trigonometric Functions Practice',
      description: 'A comprehensive set of problems covering sine, cosine, and tangent functions including graph sketching and real-world applications. Students will apply the SOH-CAH-TOA rule and use the unit circle to solve problems.',
      instructions: 'Complete all 15 problems. For graph-sketching questions, use graph paper and label all key points (maxima, minima, intercepts). Show all working. Calculators are permitted for decimal answers.',
    },
    {
      title: 'Probability and Statistics Investigation',
      description: 'An investigative task exploring probability through a real-world scenario. Students will calculate theoretical and experimental probabilities, then compare and analyse the differences.',
      instructions: 'Part A: Complete the theoretical probability calculations (Q1–8). Part B: Conduct the experiment described (minimum 50 trials) and record results. Part C: Write a 150-word comparison of your theoretical vs experimental results.',
    },
  ],
  Physics: [
    {
      title: "Newton's Laws Application Problems",
      description: "A problem set requiring application of Newton's three laws of motion to real-world scenarios. Students will calculate net forces, accelerations, and analyse action-reaction pairs.",
      instructions: 'Solve all problems using F=ma. Draw free body diagrams for all questions marked with ★. Include units in all answers. Show all substitutions into formulae.',
    },
  ],
  'English Language': [
    {
      title: 'Analytical Essay: Technology and Society',
      description: 'An essay exploring the impact of artificial intelligence on modern education. Students will analyse perspectives, evaluate evidence, and construct a balanced argument.',
      instructions: 'Write 600–800 words. Use PEEL paragraph structure throughout. Include at least 3 pieces of evidence (statistics, expert quotes, or examples). Your introduction must include a clear thesis statement.',
    },
  ],
}
