import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { subject, difficulty, questionType, topic, count = 5 } = await req.json() as {
    subject: string
    difficulty?: string
    questionType?: string
    topic?: string
    count?: number
  }

  const prompt = [
    `Generate ${count} exam questions for ${subject}${topic ? ` on the topic of ${topic}` : ''}.`,
    difficulty && difficulty !== 'All' ? `Difficulty: ${difficulty}.` : '',
    questionType && questionType !== 'All' ? `Question type: ${questionType}.` : 'Mix MCQ, Essay, and True-False types.',
    'Return a JSON array. Each object must have:',
    '- text: string (the question)',
    '- questionType: "MCQ" | "Essay" | "True-False" | "Matching"',
    '- difficulty: "Easy" | "Medium" | "Hard"',
    '- topic: string',
    '- options: string[] (only for MCQ, 4 options)',
    '- correctAnswer: string',
    '- points: number (2 for Easy, 4 for Medium, 8 for Essay/Hard)',
    'Return ONLY the JSON array, no markdown, no explanation.',
  ].filter(Boolean).join('\n')

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'

  let questions: unknown[]
  try {
    questions = JSON.parse(text)
  } catch {
    const arrayMatch = text.match(/\[[\s\S]*\]/)
    questions = arrayMatch ? JSON.parse(arrayMatch[0]) : []
  }

  const withIds = (questions as Record<string, unknown>[]).map((q, i) => ({
    id: `q-ai-${Date.now()}-${i}`,
    subject,
    ...q,
  }))

  return Response.json(withIds)
}
