import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { courseTitle, subject, gradeLevel, existingUnits } = await req.json() as {
    courseTitle: string
    subject?: string
    gradeLevel?: string
    existingUnits?: string[]
  }

  const prompt = `You are a curriculum design AI for DEWA Academy (UAE secondary school).

Generate curriculum units and lessons for the following course:

Course: ${courseTitle}
${subject ? `Subject: ${subject}` : ''}
${gradeLevel ? `Grade Level: ${gradeLevel}` : ''}
${existingUnits?.length ? `Existing units (avoid duplicating): ${existingUnits.join(', ')}` : ''}

Return a JSON object with this exact structure:
{
  "units": [
    {
      "title": "<unit title>",
      "description": "<unit description>",
      "objectives": ["<learning objective 1>", "<learning objective 2>", "<learning objective 3>"],
      "duration": <estimated hours as integer>,
      "lessons": [
        {
          "title": "<lesson title>",
          "description": "<lesson description>",
          "objectives": ["<objective 1>", "<objective 2>"],
          "duration": <estimated hours as integer>
        }
      ]
    }
  ]
}

Generate 2 units, each with 2 lessons. Make content relevant to UAE curriculum standards and DEWA Academy's focus on STEM and critical thinking.`

  if (provider === 'openai') {
    const openai = new OpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })
    const text = response.choices[0]?.message?.content ?? '{}'
    try { return Response.json(JSON.parse(text)) }
    catch { return Response.json(fallback(courseTitle)) }
  }

  const client = new Anthropic()
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  try { return Response.json(JSON.parse(jsonMatch?.[0] ?? text)) }
  catch { return Response.json(fallback(courseTitle)) }
}

function fallback(courseTitle: string) {
  return {
    units: [
      {
        title: `Unit: Foundational Concepts in ${courseTitle}`,
        description: 'AI-generated unit covering essential concepts and terminology to build a strong foundation.',
        objectives: ['Identify and define key concepts', 'Apply foundational principles to simple problems', 'Demonstrate understanding through formative assessments'],
        duration: 8,
        lessons: [
          { title: 'Introduction and Core Terminology', description: 'Survey the major themes and vocabulary of the unit.', objectives: ['Define core terms', 'Recall key facts'], duration: 2 },
          { title: 'Applying the Fundamentals', description: 'Practice foundational skills through guided examples and exercises.', objectives: ['Apply concepts to structured problems', 'Check understanding with peer review'], duration: 3 },
        ],
      },
      {
        title: `Unit: Advanced Applications in ${courseTitle}`,
        description: 'AI-generated unit developing higher-order thinking through real-world application and analysis.',
        objectives: ['Analyse complex scenarios using course concepts', 'Evaluate different approaches and solutions', 'Create original work applying course knowledge'],
        duration: 10,
        lessons: [
          { title: 'Problem Solving and Analysis', description: 'Tackle challenging problems requiring multi-step reasoning and analysis.', objectives: ['Analyse multi-step problems', 'Select appropriate strategies'], duration: 3 },
          { title: 'Project and Synthesis', description: 'Culminating project where students synthesise learning into an original product.', objectives: ['Design and execute a project', 'Present findings clearly'], duration: 4 },
        ],
      },
    ],
  }
}
