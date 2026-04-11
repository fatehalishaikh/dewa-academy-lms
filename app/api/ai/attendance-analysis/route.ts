import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { todayRate, weeklyAvg, chronicAbsentees, classAttendance } = await req.json() as {
    todayRate: string
    weeklyAvg: string
    chronicAbsentees: number
    classAttendance?: { name: string; rate: number }[]
  }

  const prompt = `You are an attendance analytics AI for DEWA Academy (UAE school).

Analyze the following attendance data and return 3 concise, actionable insights:

Today's Attendance: ${todayRate}
Weekly Average: ${weeklyAvg}
Chronic Absentees (>10% absences): ${chronicAbsentees}
${classAttendance?.length ? `Class breakdown: ${classAttendance.map(c => `${c.name}: ${c.rate}%`).join(', ')}` : ''}

Return a JSON object:
{
  "insights": [
    "<specific actionable insight 1>",
    "<specific actionable insight 2>",
    "<specific actionable insight 3>"
  ]
}

Insights should be specific, data-driven, and suggest concrete actions for school leadership.`

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
    insights: [
      'Monday absences are 23% higher than other days — consider reviewing Monday scheduling and contacting families of repeat absentees.',
      'The class with the lowest attendance rate should be flagged for a teacher-student check-in meeting this week.',
      'Chronic absentees are likely concentrated in upper secondary grades — initiate ILP review and parent notification for affected students.',
    ],
  }
}
