import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

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

  let text: string

  if (provider === 'openai') {
    const openai = new OpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    text = completion.choices[0]?.message?.content ?? ''
  } else {
    const client = new Anthropic()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    text = message.content[0].type === 'text' ? message.content[0].text : ''
  }

  let parsed: { title: string; description: string; instructions: string }
  try {
    parsed = JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: '', description: '', instructions: '' }
  }

  return Response.json(parsed)
}
