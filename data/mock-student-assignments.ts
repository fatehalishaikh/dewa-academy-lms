export type RubricItem = {
  criterion: string
  points: number
  description: string
}

export type StudentAssignment = {
  id: string
  title: string
  subject: string
  due: string
  status: 'pending' | 'in-progress' | 'submitted' | 'graded'
  points: number
  grade?: number
  feedback?: string
  aiFeedback?: string
  description: string
  instructions: string
  rubric: RubricItem[]
  submittedContent?: string
  submittedDate?: string
  teacherName: string
  className: string
}

export const studentAssignments: StudentAssignment[] = [
  {
    id: 'hw-001',
    title: 'Quadratic Equations Problem Set',
    subject: 'Mathematics',
    due: 'Mar 27, 2026',
    status: 'pending',
    points: 20,
    description: 'Practice solving quadratic equations using multiple methods to build fluency and problem-solving skills.',
    instructions: `Complete problems 1–20 from Chapter 5 (Quadratic Equations). For each problem:\n\n1. Show all working clearly, step by step\n2. Identify the method used (factoring, quadratic formula, or completing the square)\n3. Check your answer by substituting back into the original equation\n4. Circle your final answers\n\nHandwritten or typed submissions are both accepted. Submit as a PDF.`,
    rubric: [
      { criterion: 'Correct Solutions', points: 10, description: '0.5 pts per correct answer (20 problems)' },
      { criterion: 'Working Shown', points: 6, description: 'Clear step-by-step working for each problem' },
      { criterion: 'Method Identification', points: 2, description: 'Method labeled for each problem' },
      { criterion: 'Answer Verification', points: 2, description: 'At least 5 answers verified by substitution' },
    ],
    teacherName: 'Ms. Al Mansoori',
    className: 'Grade 10A Mathematics',
  },
  {
    id: 'hw-002',
    title: "Newton's Laws Lab Report",
    subject: 'Physics',
    due: 'Mar 28, 2026',
    status: 'pending',
    points: 30,
    description: "Write a formal lab report based on the Newton's Laws experiment conducted in class last week.",
    instructions: `Your lab report must include the following sections:\n\n**1. Title & Date** (1 pt)\n**2. Aim** – State the purpose of the experiment (2 pts)\n**3. Hypothesis** – Predict the outcome before the experiment (3 pts)\n**4. Materials & Method** – List equipment and describe procedure (5 pts)\n**5. Results** – Include your recorded data in a table and at least one graph (8 pts)\n**6. Discussion** – Analyze results, identify sources of error (7 pts)\n**7. Conclusion** – Relate findings to Newton's Laws (4 pts)\n\nWord count: minimum 500 words. Submit as a PDF via the portal.`,
    rubric: [
      { criterion: 'Structure & Format', points: 5, description: 'All required sections present and clearly labeled' },
      { criterion: 'Scientific Accuracy', points: 10, description: 'Correct application of Newton\'s Laws in discussion' },
      { criterion: 'Data & Graphs', points: 8, description: 'Data table complete, graph correctly labeled with axes' },
      { criterion: 'Analysis & Error', points: 5, description: 'Identifies at least 2 sources of experimental error' },
      { criterion: 'Conclusion', points: 2, description: 'Clear conclusion that references the hypothesis' },
    ],
    teacherName: 'Mr. Hassan',
    className: 'Grade 10A Physics',
  },
  {
    id: 'hw-003',
    title: 'Essay: Technology in Society',
    subject: 'English',
    due: 'Mar 30, 2026',
    status: 'in-progress',
    points: 25,
    description: 'Write a persuasive essay exploring the impact of artificial intelligence on modern education.',
    instructions: `Write a persuasive essay (600–800 words) arguing FOR or AGAINST the use of AI tools in schools.\n\n**Requirements:**\n- Clear thesis statement in the introduction\n- Minimum 3 body paragraphs, each with a topic sentence, evidence, and analysis\n- Address one counter-argument and refute it\n- Formal academic tone (no slang or contractions)\n- Conclusion that restates thesis and provides a call to action\n- At least 2 cited sources (APA format)\n\n**Formatting:** Double-spaced, 12pt font, 1-inch margins. Submit as a Word document or PDF.`,
    rubric: [
      { criterion: 'Thesis & Argument', points: 8, description: 'Clear, arguable thesis with consistent argument throughout' },
      { criterion: 'Evidence & Analysis', points: 7, description: 'Relevant evidence with thoughtful analysis, not just summary' },
      { criterion: 'Counter-Argument', points: 4, description: 'Counter-argument acknowledged and effectively refuted' },
      { criterion: 'Language & Style', points: 4, description: 'Formal tone, varied sentence structure, no grammar errors' },
      { criterion: 'Citations', points: 2, description: 'At least 2 sources cited correctly in APA format' },
    ],
    teacherName: 'Ms. Johnson',
    className: 'Grade 10A English',
  },
  {
    id: 'hw-004',
    title: 'Chapter 6 Reading Summary',
    subject: 'English',
    due: 'Mar 22, 2026',
    status: 'submitted',
    points: 15,
    description: 'Summarize the key themes and events from chapters 6–8 of the assigned novel.',
    instructions: `Write a reading summary covering Chapters 6–8. Your summary should:\n\n1. Briefly describe the key events in chronological order (3–4 sentences per chapter)\n2. Identify the main theme of each chapter\n3. Note any important character developments\n4. Include one quote from the text with page number for each chapter\n\nLength: 300–400 words. Handwritten or typed.`,
    rubric: [
      { criterion: 'Plot Summary', points: 6, description: 'Key events for all 3 chapters accurately described' },
      { criterion: 'Theme Identification', points: 5, description: 'Correct theme identified with supporting reasoning' },
      { criterion: 'Quotes', points: 4, description: 'One relevant quote per chapter with page number' },
    ],
    submittedContent: `Chapter 6 focuses on the protagonist's growing internal conflict as she discovers the truth about her family's past. The key events include her finding the old letters, confronting her mother, and deciding to investigate further. The main theme is the tension between loyalty and truth. A pivotal moment is captured in this quote: "Some doors are better left closed" (p. 89).\n\nChapter 7 shifts the narrative perspective to the antagonist, revealing his motivations for the first time. We learn he was once a friend of the family, which deepens the sense of betrayal. The theme of perspective and bias is central. "Every story has two sides, and neither is entirely true" (p. 104).\n\nChapter 8 brings the two storylines together as the protagonist and antagonist meet unexpectedly at the archive. The tension builds as both characters realize what the other knows. The theme is revelation and consequence. "Knowing changes everything" (p. 121).`,
    submittedDate: 'Mar 21, 2026',
    teacherName: 'Ms. Johnson',
    className: 'Grade 10A English',
  },
  {
    id: 'hw-005',
    title: 'Algebra Mid-Unit Test',
    subject: 'Mathematics',
    due: 'Mar 18, 2026',
    status: 'graded',
    points: 50,
    grade: 92,
    feedback: 'Excellent work! Your working is very clear and you demonstrated strong understanding of factoring. Minor deduction on Q12 — you forgot to check for extraneous solutions. Keep it up!',
    aiFeedback: `**Strengths:**\n- Consistent and accurate use of the quadratic formula across all applicable questions\n- Clear step-by-step working that makes your reasoning easy to follow\n- Strong performance on factoring by grouping (Questions 4–7: full marks)\n\n**Areas for Growth:**\n- When solving equations by square roots (Q11–Q12), remember to check for extraneous solutions by substituting back into the original equation\n- Review completing the square for non-monic quadratics — Q15 showed a small sign error\n\n**Next Steps:** Practice completing the square with coefficient a ≠ 1. Try exercises 5.4 (problems 8–15) in your textbook for targeted practice.`,
    description: 'Mid-unit assessment covering all quadratic equation methods.',
    instructions: 'In-class test. No additional submission required.',
    rubric: [],
    submittedDate: 'Mar 18, 2026',
    teacherName: 'Ms. Al Mansoori',
    className: 'Grade 10A Mathematics',
  },
  {
    id: 'hw-006',
    title: 'Waves & Optics Problem Set',
    subject: 'Physics',
    due: 'Mar 15, 2026',
    status: 'graded',
    points: 25,
    grade: 78,
    feedback: 'Good effort on the wave calculations. Review refraction concepts — snell\'s law application in Q8-10 had errors. Strong work on the reflection section.',
    aiFeedback: `**Strengths:**\n- Excellent understanding of wave properties (frequency, wavelength, speed) — full marks on Q1–5\n- Correct application of the law of reflection in all reflection problems\n- Good use of diagrams in the optics section\n\n**Areas for Growth:**\n- Snell's Law: In Q8–10, you used the formula correctly but mixed up n₁ and n₂ angles. Remember: n₁ sin θ₁ = n₂ sin θ₂, where θ is measured from the *normal*, not the surface\n- Total internal reflection (Q11): the critical angle formula θc = sin⁻¹(n₂/n₁) was not applied\n\n**Next Steps:** Re-read Section 8.3 on refraction and work through the examples. Then attempt the 5 practice problems on the class portal. Focus on drawing accurate ray diagrams.`,
    description: 'Problem set covering wave behaviour, reflection, and refraction.',
    instructions: 'In-class assignment. No additional submission required.',
    rubric: [],
    submittedDate: 'Mar 15, 2026',
    teacherName: 'Mr. Hassan',
    className: 'Grade 10A Physics',
  },
]

export function getAssignmentById(id: string): StudentAssignment | undefined {
  return studentAssignments.find(a => a.id === id)
}
