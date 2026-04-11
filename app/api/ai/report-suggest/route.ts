import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

const AVAILABLE_FIELD_IDS = ['gpa', 'attendance', 'engagement', 'exam_avg', 'pass_rate', 'honor_roll', 'student_name', 'grade_level', 'section', 'subject', 'at_risk', 'date_range']

export async function POST(req: NextRequest) {
  const { context } = await req.json() as { context?: string }

  const prompt = `You are a school report configuration AI for DEWA Academy.

Suggest an optimal report configuration for a school administrator. The report should be useful for monitoring student welfare and academic performance.

Available field IDs: ${AVAILABLE_FIELD_IDS.join(', ')}

Return a JSON object:
{
  "reportName": "<descriptive report name>",
  "fields": ["<field_id_1>", "<field_id_2>", "<field_id_3>", "<field_id_4>", "<field_id_5>"],
  "datePreset": "Last 7 days" | "Last 30 days" | "Current Term" | "Full Year",
  "gradeFilter": "All" | "Grade 9" | "Grade 10" | "Grade 11",
  "rationale": "<1-2 sentence explanation of why these fields were chosen>"
}

${context ? `Context: ${context}` : 'Suggest a report focused on identifying at-risk students.'}

Only use field IDs from the available list.`

  if (provider === 'openai') {
    const openai = new OpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })
    const text = response.choices[0]?.message?.content ?? '{}'
    try { return Response.json(JSON.parse(text)) }
    catch { return Response.json(fallback()) }
  }

  const client = new Anthropic()
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  try { return Response.json(JSON.parse(jsonMatch?.[0] ?? text)) }
  catch { return Response.json(fallback()) }
}

function fallback() {
  return {
    reportName: 'At-Risk Early Warning Report',
    fields: ['student_name', 'grade_level', 'attendance', 'engagement', 'gpa', 'at_risk'],
    datePreset: 'Current Term',
    gradeFilter: 'All',
    rationale: 'Combines attendance, engagement, and GPA data to identify students at risk of academic failure, enabling timely intervention.',
  }
}
