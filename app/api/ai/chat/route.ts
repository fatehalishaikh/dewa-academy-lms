import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { messages, pageContext, contexts, autoContext } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    pageContext?: string
    contexts?: Record<string, { label: string; summary: string }>
    autoContext?: string
  }

  const systemParts = [
    'You are an AI assistant for DEWA Academy, a school management system.',
    'You help administrators, teachers, and staff navigate the system, interpret data, and get insights.',
    'Be concise and direct. Use markdown formatting where appropriate.',
  ]
  if (pageContext) systemParts.push(`The user is currently on: ${pageContext}.`)
  if (autoContext) systemParts.push(`Current page data: ${autoContext}`)
  if (contexts && Object.keys(contexts).length > 0) {
    const contextStr = Object.values(contexts).map(c => `${c.label}: ${c.summary}`).join('\n')
    systemParts.push(`Active context:\n${contextStr}`)
  }

  const encoder = new TextEncoder()

  if (provider === 'openai') {
    const openai = new OpenAI()
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'system', content: systemParts.join('\n') }, ...messages],
      stream: true,
    })
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })
    return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  const client = new Anthropic()
  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemParts.join('\n'),
    messages,
  })
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
  return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
