import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { messages, pageContext, contexts } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    pageContext?: string
    contexts?: Record<string, { label: string; summary: string }>
  }

  const systemParts = [
    'You are an AI assistant for DEWA Academy, a school management system.',
    'You help administrators, teachers, and staff navigate the system, interpret data, and get insights.',
    'Be concise and direct. Use markdown formatting where appropriate.',
  ]
  if (pageContext) systemParts.push(`The user is currently on: ${pageContext}.`)
  if (contexts && Object.keys(contexts).length > 0) {
    const contextStr = Object.values(contexts).map(c => `${c.label}: ${c.summary}`).join('\n')
    systemParts.push(`Active context:\n${contextStr}`)
  }

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemParts.join('\n'),
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
