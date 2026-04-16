import type { Submission } from '@/data/mock-homework'

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
    aiFeedback: "**Strengths:**\n- Excellent understanding of wave properties — full marks on Q1–5\n- Correct law of reflection applied throughout\n\n**Areas for Growth:**\n- Snell's Law: mixed up n1 and n2 angles in Q8–10\n- Total internal reflection formula not applied (Q11)\n\n**Next Steps:** Re-read Section 8.3 on refraction and work through the examples.",
    content: null,
  },
  // hw-009 submissions (cls-033: stu-001, stu-004, stu-012)
  {
    id: 'sub-011',
    homeworkId: 'hw-009',
    studentId: 'stu-001',
    submittedDate: '2026-04-23',
    status: 'submitted',
    grade: null,
    feedback: null,
    aiScore: 30,
    aiFeedback: 'Strong identification of distributions throughout. Calculations accurate and well-presented. Context interpretation is clear and concise.',
    content: null,
  },
  {
    id: 'sub-012',
    homeworkId: 'hw-009',
    studentId: 'stu-004',
    submittedDate: null,
    status: 'not-submitted',
    grade: null,
    feedback: null,
    aiScore: null,
    aiFeedback: null,
    content: null,
  },
  {
    id: 'sub-013',
    homeworkId: 'hw-009',
    studentId: 'stu-012',
    submittedDate: '2026-04-22',
    status: 'submitted',
    grade: null,
    feedback: null,
    aiScore: 28,
    aiFeedback: 'Good overall. Binomial section complete. Some errors in Poisson parameter identification.',
    content: null,
  },
  // hw-011 submissions (cls-035: stu-005, stu-008)
  {
    id: 'sub-014',
    homeworkId: 'hw-011',
    studentId: 'stu-005',
    submittedDate: '2026-04-24',
    status: 'submitted',
    grade: null,
    feedback: null,
    aiScore: 35,
    aiFeedback: 'Excellent diagrams — all stages accurately drawn and annotated. Comparison table is thorough. Short-answer question 4 needs more depth.',
    content: null,
  },
  {
    id: 'sub-015',
    homeworkId: 'hw-011',
    studentId: 'stu-008',
    submittedDate: null,
    status: 'not-submitted',
    grade: null,
    feedback: null,
    aiScore: null,
    aiFeedback: null,
    content: null,
  },
  // hw-012 submissions (cls-035: stu-005, stu-008 — graded)
  {
    id: 'sub-016',
    homeworkId: 'hw-012',
    studentId: 'stu-005',
    submittedDate: '2026-03-20',
    status: 'graded',
    grade: 26,
    feedback: 'Very strong on photosynthesis reactions. Review the Krebs cycle steps for respiration — a few intermediates were missed.',
    aiScore: 25,
    aiFeedback: 'High performance overall. Light-dependent reactions fully correct. Minor gaps in aerobic respiration (Krebs cycle intermediates).',
    content: null,
  },
  {
    id: 'sub-017',
    homeworkId: 'hw-012',
    studentId: 'stu-008',
    submittedDate: '2026-03-20',
    status: 'graded',
    grade: 21,
    feedback: 'Good attempt. Photosynthesis section was solid. Work on the electron transport chain — the steps were out of order.',
    aiScore: 20,
    aiFeedback: 'Adequate understanding shown. Photosynthesis equations correct. Electron transport chain sequence needs revision.',
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
