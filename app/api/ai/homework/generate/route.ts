import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { subject, className, gradeLevel, topic } = await req.json() as {
    subject: string
    className: string
    gradeLevel?: string
    topic?: string
  }

  const prompt = [
    `Generate a homework assignment for a ${gradeLevel ?? 'high school'} ${subject} class (${className}).`,
    topic ? `Focus on the topic: ${topic}.` : '',
    'Return a JSON object with exactly these fields:',
    '- title: string (short, descriptive)',
    '- description: string (1-2 sentences explaining the assignment)',
    '- instructions: string (step-by-step instructions for students, use \\n for line breaks)',
    'Return ONLY the JSON object, no markdown, no explanation.',
  ].filter(Boolean).join('\n')

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  let parsed: { title: string; description: string; instructions: string }
  try {
    parsed = JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: '', description: '', instructions: '' }
  }

  return Response.json(parsed)
}
