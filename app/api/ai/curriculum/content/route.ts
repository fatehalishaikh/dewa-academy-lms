import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { lessonTitle, subject, gradeLevel, objectives, description } = await req.json() as {
    lessonTitle: string
    subject?: string
    gradeLevel?: string
    objectives?: string[]
    description?: string
  }

  const prompt = `You are a curriculum content author for DEWA Academy, a UAE secondary school focused on STEM and critical thinking.

Generate DETAILED instructional content for this lesson:

Lesson: ${lessonTitle}
${subject ? `Subject: ${subject}` : ''}
${gradeLevel ? `Grade Level: ${gradeLevel}` : ''}
${description ? `Description: ${description}` : ''}
${objectives?.length ? `Learning Objectives:\n${objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}` : ''}

Return a JSON object with this exact structure:
{
  "introduction": "<2-3 paragraph introduction explaining the topic, its importance, and real-world connections to UAE/DEWA>",
  "vocabulary": [
    { "term": "<key term>", "definition": "<clear definition with units/symbols where relevant>" }
  ],
  "keyConcepts": [
    {
      "heading": "<concept heading>",
      "body": "<detailed multi-paragraph explanation with examples, formulas, and reasoning. Use \\n for line breaks.>"
    }
  ],
  "workedExamples": [
    {
      "title": "<example title>",
      "problem": "<problem statement>",
      "solution": ["<step 1>", "<step 2>", "<step 3>"]
    }
  ],
  "practiceProblems": [
    {
      "question": "<problem question>",
      "hint": "<optional hint>",
      "answer": "<concise answer>"
    }
  ],
  "teacherNotes": "<practical guidance: timing breakdown, common misconceptions, differentiation strategies for advanced/support/ELL students, cross-curricular links>",
  "studentReadings": ["<reading resource 1>", "<reading resource 2>"],
  "estimatedMinutes": <integer>
}

Requirements:
- Generate 5-7 vocabulary terms
- Generate 3-4 key concepts with SUBSTANTIAL explanations (each 150+ words, include formulas/reasoning)
- Generate 2-3 worked examples with step-by-step solutions
- Generate 5-7 practice problems ranging from basic to challenging, include at least one real-world application
- Make content appropriate for UAE secondary students
- Include connections to DEWA and UAE engineering/energy where relevant
- Teacher notes should be detailed and practical (timing, misconceptions, differentiation)`

  if (provider === 'openai') {
    const openai = new OpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })
    const text = response.choices[0]?.message?.content ?? '{}'
    try { return Response.json(JSON.parse(text)) }
    catch { return Response.json(fallback(lessonTitle)) }
  }

  const client = new Anthropic()
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  try { return Response.json(JSON.parse(jsonMatch?.[0] ?? text)) }
  catch { return Response.json(fallback(lessonTitle)) }
}

function fallback(lessonTitle: string) {
  return {
    introduction: `This lesson covers the fundamental concepts of ${lessonTitle}. Students will develop a strong understanding of the key principles and learn to apply them to real-world scenarios relevant to the UAE and DEWA Academy's STEM focus.\n\nBy the end of this lesson, students should be able to explain the core ideas, solve related problems, and connect the topic to practical applications in engineering and energy.`,
    vocabulary: [
      { term: 'Key Term 1', definition: 'Definition of the first key concept in this topic.' },
      { term: 'Key Term 2', definition: 'Definition of the second key concept in this topic.' },
      { term: 'Key Term 3', definition: 'Definition of the third key concept in this topic.' },
      { term: 'Key Term 4', definition: 'Definition of the fourth key concept in this topic.' },
      { term: 'Key Term 5', definition: 'Definition of the fifth key concept in this topic.' },
    ],
    keyConcepts: [
      {
        heading: 'Core Principles',
        body: `The foundation of ${lessonTitle} rests on several interconnected principles. Understanding these building blocks is essential before progressing to more complex applications.\n\nStudents should pay careful attention to definitions, units, and the relationships between variables. Each concept builds on the previous one, so mastery at each stage is important.`,
      },
      {
        heading: 'Methods and Techniques',
        body: `There are multiple approaches to solving problems in this area. The most common method involves identifying the known quantities, selecting the appropriate formula or technique, and working through the solution systematically.\n\nAlways check your answer by substituting back into the original problem or verifying units.`,
      },
      {
        heading: 'Real-World Applications',
        body: `These concepts appear frequently in engineering, science, and everyday life. At DEWA, engineers apply these principles when designing energy systems, analysing data, and optimising operations.\n\nUnderstanding how classroom concepts connect to real-world problems helps build motivation and deeper comprehension.`,
      },
    ],
    workedExamples: [
      {
        title: 'Basic Application',
        problem: `Apply the core concepts of ${lessonTitle} to solve a straightforward problem.`,
        solution: ['Step 1: Identify the given information and what is being asked.', 'Step 2: Select the appropriate formula or method.', 'Step 3: Substitute values and calculate.', 'Step 4: Check the answer and include units.'],
      },
      {
        title: 'Intermediate Problem',
        problem: 'A more challenging problem requiring multi-step reasoning.',
        solution: ['Step 1: Break the problem into smaller parts.', 'Step 2: Solve each part systematically.', 'Step 3: Combine results to reach the final answer.', 'Step 4: Verify by checking against known constraints.'],
      },
    ],
    practiceProblems: [
      { question: 'Define the key terms from this lesson in your own words.', answer: 'See vocabulary section for reference definitions.' },
      { question: 'Solve a basic problem using the core formula from this lesson.', hint: 'Start by identifying your known and unknown values.', answer: 'Answers will vary based on specific values.' },
      { question: 'Apply the concepts to a real-world scenario involving energy or engineering.', answer: 'Answers should demonstrate correct application of the method.' },
      { question: 'Explain why this topic is important for engineering work at organisations like DEWA.', answer: 'Open-ended — should reference practical applications discussed in class.' },
      { question: 'Challenge: Extend the concept to a more complex scenario requiring multiple steps.', hint: 'Break it down into sub-problems.', answer: 'Multi-step solution required.' },
    ],
    teacherNotes: `Timing: Introduction (10 min) → Key Concepts (20 min) → Worked Examples (15 min) → Practice (15 min) → Plenary (5 min).\n\nCommon misconceptions: Students often confuse related terms or misapply formulas. Address these directly with counter-examples.\n\nDifferentiation:\n• Support: Provide a reference sheet with key formulas and definitions. Use guided practice before independent work.\n• Extension: Challenge advanced students to create their own problems or explore edge cases.\n• ELL: Provide bilingual vocabulary cards and sentence frames for written responses.`,
    studentReadings: [
      'Textbook: Relevant chapter covering this topic',
      'Online: Supplementary video or interactive resource',
      'DEWA Academy Workbook: Practice section for this lesson',
    ],
    estimatedMinutes: 65,
  }
}
