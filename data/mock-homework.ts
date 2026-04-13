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
  // hw-004 submissions (cls-003: stu-001, stu-004, stu-012)
  {
    id: 'sub-006',
    homeworkId: 'hw-004',
    studentId: 'stu-001',
    submittedDate: null,
    status: 'not-submitted',
    grade: null,
    feedback: null,
    aiScore: null,
    aiFeedback: null,
    content: null,
  },
  // hw-005 submission (cls-005: stu-001 in-progress)
  {
    id: 'sub-007',
    homeworkId: 'hw-005',
    studentId: 'stu-001',
    submittedDate: null,
    status: 'not-submitted',
    grade: null,
    feedback: null,
    aiScore: null,
    aiFeedback: null,
    content: null,
  },
  // hw-006 submission (cls-005: stu-001 submitted)
  {
    id: 'sub-008',
    homeworkId: 'hw-006',
    studentId: 'stu-001',
    submittedDate: '2026-03-21',
    status: 'submitted',
    grade: null,
    feedback: null,
    aiScore: 13,
    aiFeedback: 'Strong summary across all three chapters. Quotes well-chosen and properly cited. Theme identification for Chapter 7 could be more specific — "perspective" is broad; consider "unreliable narration" or "moral ambiguity".',
    content: `Chapter 6 focuses on the protagonist's growing internal conflict as she discovers the truth about her family's past. The key events include her finding the old letters, confronting her mother, and deciding to investigate further. The main theme is the tension between loyalty and truth. A pivotal moment is captured in this quote: "Some doors are better left closed" (p. 89).

Chapter 7 shifts the narrative perspective to the antagonist, revealing his motivations for the first time. We learn he was once a friend of the family, which deepens the sense of betrayal. The theme of perspective and bias is central. "Every story has two sides, and neither is entirely true" (p. 104).

Chapter 8 brings the two storylines together as the protagonist and antagonist meet unexpectedly at the archive. The tension builds as both characters realize what the other knows. The theme is revelation and consequence. "Knowing changes everything" (p. 121).`,
  },
  // hw-007 submission (cls-001: stu-001 graded)
  {
    id: 'sub-009',
    homeworkId: 'hw-007',
    studentId: 'stu-001',
    submittedDate: '2026-03-18',
    status: 'graded',
    grade: 92,
    feedback: 'Excellent work! Your working is very clear and you demonstrated strong understanding of factoring. Minor deduction on Q12 — you forgot to check for extraneous solutions. Keep it up!',
    aiScore: 91,
    aiFeedback: '**Strengths:**\n- Consistent and accurate use of the quadratic formula\n- Clear step-by-step working\n- Strong performance on factoring (full marks)\n\n**Areas for Growth:**\n- Check for extraneous solutions when solving by square roots (Q12)\n\n**Next Steps:** Practice completing the square with coefficient a ≠ 1.',
    content: null,
  },
  // hw-008 submission (cls-003: stu-001 graded)
  {
    id: 'sub-010',
    homeworkId: 'hw-008',
    studentId: 'stu-001',
    submittedDate: '2026-03-15',
    status: 'graded',
    grade: 78,
    feedback: "Good effort on the wave calculations. Review refraction concepts — Snell's law application in Q8-10 had errors. Strong work on the reflection section.",
    aiScore: 78,
    aiFeedback: "**Strengths:**\n- Excellent understanding of wave properties — full marks on Q1–5\n- Correct law of reflection applied throughout\n\n**Areas for Growth:**\n- Snell's Law: mixed up n₁ and n₂ angles in Q8–10\n- Total internal reflection formula not applied (Q11)\n\n**Next Steps:** Re-read Section 8.3 on refraction and work through the examples.",
    content: null,
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
