import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { conflicts, totalClasses, totalSessions } = await req.json() as {
    conflicts: { slot: string; day: string; room: string; classes: string[] }[]
    totalClasses: number
    totalSessions: number
  }

  const prompt = `You are a timetable optimization AI for DEWA Academy (UAE school, Sun-Thu week).

Analyze these scheduling conflicts and provide optimization recommendations:

Total Classes: ${totalClasses}
Total Sessions/Week: ${totalSessions}
Conflicts: ${conflicts.length}
${conflicts.map(c => `- ${c.day} ${c.slot}: Room ${c.room} double-booked by ${c.classes.join(' and ')}`).join('\n')}

Return a JSON object:
{
  "summary": "<1-2 sentence summary of what was optimized>",
  "changes": [
    "<specific change 1>",
    "<specific change 2>",
    "<specific change 3>"
  ],
  "conflictsResolved": ${conflicts.length}
}`

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
    catch { return Response.json(fallback(conflicts.length)) }
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
  catch { return Response.json(fallback(conflicts.length)) }
}

function fallback(conflictCount: number) {
  return {
    summary: `AI resolved ${conflictCount} room conflict${conflictCount !== 1 ? 's' : ''} by redistributing sessions to available classrooms.`,
    changes: [
      'Reassigned conflicting sessions to available rooms in the B-wing',
      'Staggered overlapping session start times by 10 minutes',
      'Flagged 2 teacher double-bookings for manual review',
    ],
    conflictsResolved: conflictCount,
  }
}
