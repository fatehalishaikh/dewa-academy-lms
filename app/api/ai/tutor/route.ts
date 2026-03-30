import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { messages, subject, topic, mode } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    subject: string
    topic: string
    mode: 'chat' | 'practice'
  }

  const system = [
    `You are an AI tutor for DEWA Academy students, specializing in ${subject}.`,
    `The student is currently studying: ${topic}.`,
    'Your goal is to help students understand concepts through clear explanations, worked examples, and encouragement.',
    'Use **bold** for key terms and formulas. Break explanations into numbered steps where helpful.',
    mode === 'practice'
      ? 'The student is in practice mode. Evaluate their answer, give the correct solution with explanation, and encourage them.'
      : 'Answer the student\'s question clearly and ask if they want a practice problem to test their understanding.',
    'Keep responses concise — under 200 words unless a detailed worked example is needed.',
  ].join('\n')

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
