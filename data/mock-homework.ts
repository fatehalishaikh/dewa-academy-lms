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

// Helper: map student-facing status to submission status
export function submissionStatus(sub: Submission | undefined): 'not-submitted' | 'submitted' | 'late' | 'graded' {
  return sub?.status ?? 'not-submitted'
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
    dueDate: '2026-04-27',
    createdDate: '2026-04-01',
    status: 'published',
    totalPoints: 20,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Correct working shown', maxPoints: 8 },
      { id: 'r2', label: 'Final answers correct', maxPoints: 8 },
      { id: 'r3', label: 'Presentation & clarity', maxPoints: 4 },
    ],
    questions: [
      {
        id: 'q-hw001-1',
        text: 'Which of the following is the correct quadratic formula?',
        questionType: 'MCQ' as const,
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        difficulty: 'Easy' as const,
        options: [
          'x = (−b ± √(b² − 4ac)) / 2a',
          'x = (b ± √(b² − 4ac)) / 2a',
          'x = (−b ± √(b² + 4ac)) / 2a',
          'x = (−b ± √(b² − 4ac)) / a',
        ],
        correctAnswer: 'x = (−b ± √(b² − 4ac)) / 2a',
        points: 2,
      },
      {
        id: 'q-hw001-2',
        text: 'Solve: x² − 5x + 6 = 0. What are the values of x?',
        questionType: 'MCQ' as const,
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        difficulty: 'Easy' as const,
        options: ['x = 1 or x = 6', 'x = 2 or x = 3', 'x = −2 or x = −3', 'x = 5 or x = 1'],
        correctAnswer: 'x = 2 or x = 3',
        points: 2,
      },
      {
        id: 'q-hw001-3',
        text: 'What is the discriminant of 2x² + 3x − 5 = 0?',
        questionType: 'MCQ' as const,
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        difficulty: 'Medium' as const,
        options: ['9', '49', '−31', '40'],
        correctAnswer: '49',
        points: 3,
      },
      {
        id: 'q-hw001-4',
        text: 'Which of the following equations has NO real solutions?',
        questionType: 'MCQ' as const,
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        difficulty: 'Medium' as const,
        options: ['x² − 4 = 0', 'x² + 4 = 0', 'x² − 4x + 4 = 0', 'x² + 4x − 5 = 0'],
        correctAnswer: 'x² + 4 = 0',
        points: 3,
      },
      {
        id: 'q-hw001-5',
        text: 'Factorise: x² + 7x + 12',
        questionType: 'MCQ' as const,
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        difficulty: 'Easy' as const,
        options: ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x + 6)(x + 2)'],
        correctAnswer: '(x + 3)(x + 4)',
        points: 2,
      },
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
  // Physics (cls-003, tch-002)
  {
    id: 'hw-004',
    title: "Newton's Laws Lab Report",
    description: "Write a formal lab report based on the Newton's Laws experiment conducted in class last week.",
    instructions: `Your lab report must include the following sections:\n\n**1. Title & Date** (1 pt)\n**2. Aim** – State the purpose of the experiment (2 pts)\n**3. Hypothesis** – Predict the outcome before the experiment (3 pts)\n**4. Materials & Method** – List equipment and describe procedure (5 pts)\n**5. Results** – Include your recorded data in a table and at least one graph (8 pts)\n**6. Discussion** – Analyze results, identify sources of error (7 pts)\n**7. Conclusion** – Relate findings to Newton's Laws (4 pts)\n\nWord count: minimum 500 words. Submit as a PDF via the portal.`,
    classId: 'cls-003',
    teacherId: 'tch-002',
    subject: 'Physics',
    dueDate: '2026-04-28',
    createdDate: '2026-04-01',
    status: 'published',
    totalPoints: 30,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Structure & Format', maxPoints: 5 },
      { id: 'r2', label: 'Scientific Accuracy', maxPoints: 10 },
      { id: 'r3', label: 'Data & Graphs', maxPoints: 8 },
      { id: 'r4', label: 'Analysis & Error', maxPoints: 5 },
      { id: 'r5', label: 'Conclusion', maxPoints: 2 },
    ],
    questions: [
      {
        id: 'q-hw004-1',
        text: "Newton's First Law states that an object at rest will remain at rest unless:",
        questionType: 'MCQ' as const,
        subject: 'Physics',
        topic: "Newton's Laws",
        difficulty: 'Easy' as const,
        options: [
          'It has mass',
          'An external force acts on it',
          'It is in a vacuum',
          'Gravity is absent',
        ],
        correctAnswer: 'An external force acts on it',
        points: 3,
      },
      {
        id: 'q-hw004-2',
        text: 'A 10 kg object accelerates at 3 m/s². What is the net force?',
        questionType: 'MCQ' as const,
        subject: 'Physics',
        topic: "Newton's Laws",
        difficulty: 'Easy' as const,
        options: ['3.3 N', '13 N', '30 N', '7 N'],
        correctAnswer: '30 N',
        points: 3,
      },
      {
        id: 'q-hw004-3',
        text: "Newton's Third Law is best described as:",
        questionType: 'MCQ' as const,
        subject: 'Physics',
        topic: "Newton's Laws",
        difficulty: 'Easy' as const,
        options: [
          'F = ma',
          'Every action has an equal and opposite reaction',
          'Objects in motion tend to stay in motion',
          'Force equals mass divided by acceleration',
        ],
        correctAnswer: 'Every action has an equal and opposite reaction',
        points: 3,
      },
      {
        id: 'q-hw004-4',
        text: 'Two forces act on a 5 kg object: 20 N right and 8 N left. What is the acceleration?',
        questionType: 'MCQ' as const,
        subject: 'Physics',
        topic: "Newton's Laws",
        difficulty: 'Medium' as const,
        options: ['2.4 m/s²', '5.6 m/s²', '4 m/s²', '1.6 m/s²'],
        correctAnswer: '2.4 m/s²',
        points: 4,
      },
      {
        id: 'q-hw004-5',
        text: 'Which quantity is NOT a vector?',
        questionType: 'MCQ' as const,
        subject: 'Physics',
        topic: 'Forces',
        difficulty: 'Medium' as const,
        options: ['Velocity', 'Acceleration', 'Mass', 'Force'],
        correctAnswer: 'Mass',
        points: 3,
      },
    ],
  },
  // English Language (cls-005, tch-003)
  {
    id: 'hw-005',
    title: 'Essay: Technology in Society',
    description: 'Write a persuasive essay exploring the impact of artificial intelligence on modern education.',
    instructions: `Write a persuasive essay (600–800 words) arguing FOR or AGAINST the use of AI tools in schools.\n\n**Requirements:**\n- Clear thesis statement in the introduction\n- Minimum 3 body paragraphs, each with a topic sentence, evidence, and analysis\n- Address one counter-argument and refute it\n- Formal academic tone (no slang or contractions)\n- Conclusion that restates thesis and provides a call to action\n- At least 2 cited sources (APA format)\n\n**Formatting:** Double-spaced, 12pt font, 1-inch margins. Submit as a Word document or PDF.`,
    classId: 'cls-005',
    teacherId: 'tch-003',
    subject: 'English Language',
    dueDate: '2026-03-30',
    createdDate: '2026-03-23',
    status: 'published',
    totalPoints: 25,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Thesis & Argument', maxPoints: 8 },
      { id: 'r2', label: 'Evidence & Analysis', maxPoints: 7 },
      { id: 'r3', label: 'Counter-Argument', maxPoints: 4 },
      { id: 'r4', label: 'Language & Style', maxPoints: 4 },
      { id: 'r5', label: 'Citations', maxPoints: 2 },
    ],
  },
  {
    id: 'hw-006',
    title: 'Chapter 6 Reading Summary',
    description: 'Summarize the key themes and events from chapters 6–8 of the assigned novel.',
    instructions: `Write a reading summary covering Chapters 6–8. Your summary should:\n\n1. Briefly describe the key events in chronological order (3–4 sentences per chapter)\n2. Identify the main theme of each chapter\n3. Note any important character developments\n4. Include one quote from the text with page number for each chapter\n\nLength: 300–400 words. Handwritten or typed.`,
    classId: 'cls-005',
    teacherId: 'tch-003',
    subject: 'English Language',
    dueDate: '2026-03-22',
    createdDate: '2026-03-15',
    status: 'closed',
    totalPoints: 15,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Plot Summary', maxPoints: 6 },
      { id: 'r2', label: 'Theme Identification', maxPoints: 5 },
      { id: 'r3', label: 'Quotes', maxPoints: 4 },
    ],
  },
  // Mathematics closed/graded (cls-001, tch-001)
  {
    id: 'hw-007',
    title: 'Algebra Mid-Unit Test',
    description: 'Mid-unit assessment covering all quadratic equation methods.',
    instructions: 'In-class test. No additional submission required.',
    classId: 'cls-001',
    teacherId: 'tch-001',
    subject: 'Mathematics',
    dueDate: '2026-03-18',
    createdDate: '2026-03-11',
    status: 'closed',
    totalPoints: 50,
    aiGenerated: false,
    rubric: [],
  },
  // Statistics (cls-033, tch-001)
  {
    id: 'hw-009',
    title: 'Probability Distributions — Problem Set',
    description: 'Work through problems on discrete and continuous probability distributions including binomial, normal, and Poisson. Interpret results in context.',
    instructions: 'Complete all 18 problems from the worksheet. For each distribution question, state the distribution type and parameters. Show all calculations. Use your GDC for normal distribution questions and record your keystrokes.',
    classId: 'cls-033',
    teacherId: 'tch-001',
    subject: 'Statistics',
    dueDate: '2026-04-25',
    createdDate: '2026-04-10',
    status: 'published',
    totalPoints: 36,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Distribution identification', maxPoints: 8 },
      { id: 'r2', label: 'Calculations & working', maxPoints: 16 },
      { id: 'r3', label: 'Interpretation in context', maxPoints: 8 },
      { id: 'r4', label: 'GDC use documented', maxPoints: 4 },
    ],
  },
  {
    id: 'hw-010',
    title: 'Hypothesis Testing — Intro Task',
    description: 'Introduction to null and alternative hypotheses, p-values, and significance levels. Students will conduct a one-sample z-test and interpret the result.',
    instructions: 'Read the scenario on p. 214. State H0 and H1. Calculate the test statistic. Look up the critical value. Write a conclusion in context (3–4 sentences). Show all working.',
    classId: 'cls-034',
    teacherId: 'tch-001',
    subject: 'Statistics',
    dueDate: '2026-04-30',
    createdDate: '2026-04-12',
    status: 'draft',
    totalPoints: 20,
    aiGenerated: true,
    rubric: [
      { id: 'r1', label: 'Hypotheses stated correctly', maxPoints: 4 },
      { id: 'r2', label: 'Test statistic calculated', maxPoints: 8 },
      { id: 'r3', label: 'Decision & conclusion', maxPoints: 8 },
    ],
  },
  // Biology (cls-035, tch-004)
  {
    id: 'hw-011',
    title: 'Cell Division — Mitosis & Meiosis Comparison',
    description: 'Compare and contrast mitosis and meiosis with annotated diagrams, a comparison table, and an explanation of their biological significance.',
    instructions: 'Draw and annotate the stages of mitosis (4 pts each stage) and meiosis I & II (4 pts each stage). Complete the comparison table. Answer the 5 short-answer questions. Use coloured pencils for your diagrams.',
    classId: 'cls-035',
    teacherId: 'tch-004',
    subject: 'Biology',
    dueDate: '2026-04-26',
    createdDate: '2026-04-08',
    status: 'published',
    totalPoints: 40,
    aiGenerated: false,
    rubric: [
      { id: 'r1', label: 'Mitosis diagrams & annotation', maxPoints: 12 },
      { id: 'r2', label: 'Meiosis diagrams & annotation', maxPoints: 12 },
      { id: 'r3', label: 'Comparison table', maxPoints: 8 },
      { id: 'r4', label: 'Short-answer questions', maxPoints: 8 },
    ],
  },
  {
    id: 'hw-012',
    title: 'Photosynthesis & Respiration Review',
    description: 'Closed assessment covering the light-dependent and light-independent reactions of photosynthesis and aerobic respiration pathways.',
    instructions: 'In-class test. No additional submission required.',
    classId: 'cls-035',
    teacherId: 'tch-004',
    subject: 'Biology',
    dueDate: '2026-03-20',
    createdDate: '2026-03-13',
    status: 'closed',
    totalPoints: 30,
    aiGenerated: false,
    rubric: [],
  },
  // Physics closed/graded (cls-003, tch-002)
  {
    id: 'hw-008',
    title: 'Waves & Optics Problem Set',
    description: 'Problem set covering wave behaviour, reflection, and refraction.',
    instructions: 'In-class assignment. No additional submission required.',
    classId: 'cls-003',
    teacherId: 'tch-002',
    subject: 'Physics',
    dueDate: '2026-03-15',
    createdDate: '2026-03-08',
    status: 'closed',
    totalPoints: 25,
    aiGenerated: false,
    rubric: [],
  },
]

export { initialSubmissions, aiHomeworkTemplates } from '@/data/mock-submissions'
