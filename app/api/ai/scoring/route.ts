import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { applications, weights } = await req.json() as {
    applications: {
      id: string
      applicantName: string
      scores: { academic: number; qudurat: number; attendance: number; extracurricular: number; interview: number }
    }[]
    weights: { academic: number; qudurat: number; attendance: number; extracurricular: number; interview: number }
  }

  const prompt = [
    'You are an AI scoring engine for DEWA Academy admissions.',
    'Calculate weighted composite scores for each applicant and provide a short recommendation.',
    `Scoring weights: Academic=${weights.academic}%, Qudurat=${weights.qudurat}%, Attendance=${weights.attendance}%, Extracurricular=${weights.extracurricular}%, Interview=${weights.interview}%.`,
    '',
    'Applicants:',
    ...applications.map(a =>
      `- ${a.applicantName} (id: ${a.id}): Academic=${a.scores.academic}, Qudurat=${a.scores.qudurat}, Attendance=${a.scores.attendance}, Extracurricular=${a.scores.extracurricular}, Interview=${a.scores.interview}`
    ),
    '',
    'Return a JSON array. Each object must have:',
    '- id: string (same as input)',
    '- compositeScore: number (0-100, weighted calculation)',
    '- recommendation: "Accept" | "Waitlist" | "Review" | "Reject"',
    '- summary: string (1 sentence rationale)',
    'Return ONLY the JSON array.',
  ].join('\n')

  let text: string

  if (provider === 'openai') {
    const openai = new OpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    text = completion.choices[0]?.message?.content ?? '[]'
  } else {
    const client = new Anthropic()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    text = message.content[0].type === 'text' ? message.content[0].text : '[]'
  }

  let results: unknown[]
  try {
    results = JSON.parse(text)
  } catch {
    const arrayMatch = text.match(/\[[\s\S]*\]/)
    results = arrayMatch ? JSON.parse(arrayMatch[0]) : []
  }

  return Response.json(results)
}
