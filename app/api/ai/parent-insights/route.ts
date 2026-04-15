import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

const FALLBACK = {
  riskLevel: 'on_track' as const,
  riskScore: 20,
  summary: 'Student is performing consistently this semester.',
  recommendations: [
    'Keep encouraging regular study habits at home.',
    'Review upcoming assignments together each week.',
    'Celebrate academic achievements to build confidence.',
  ],
  strengths: ['Good attendance', 'Consistent effort'],
  concerns: [],
}

export async function POST(req: NextRequest) {
  const { studentName, gpa, attendanceRate, status, recentGrades, riskFactors } = await req.json() as {
    studentName: string
    gpa: number
    attendanceRate: number
    status: string
    recentGrades?: { subject: string; grade: number }[]
    riskFactors?: string[]
  }

  try {
    const gradesStr = recentGrades?.length
      ? recentGrades.map(g => `${g.subject}: ${g.grade}%`).join(', ')
      : 'Not available'

    const prompt = `You are a school counselor AI for DEWA Academy providing a parent with insights about their child.

Student: ${studentName}
GPA: ${gpa.toFixed(2)} / 4.0
Attendance Rate: ${attendanceRate}%
Status: ${status}
Recent Grades: ${gradesStr}
${riskFactors?.length ? `Risk Factors: ${riskFactors.join(', ')}` : ''}

Provide a JSON response with this exact structure:
{
  "riskLevel": "on_track" | "monitor" | "at_risk",
  "riskScore": <number 0-100>,
  "summary": "<1-2 sentence overall assessment>",
  "recommendations": [
    "<specific actionable recommendation for parent>",
    "<specific actionable recommendation for parent>",
    "<specific actionable recommendation for parent>"
  ],
  "strengths": ["<strength>", "<strength>"],
  "concerns": ["<concern if any>"]
}

Be encouraging, specific, and actionable. Focus on what parents can do at home to support their child.`

    if (provider === 'openai') {
      const openai = new OpenAI()
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      })
      const text = response.choices[0]?.message?.content ?? '{}'
      try {
        return Response.json(JSON.parse(text))
      } catch {
        return Response.json(FALLBACK)
      }
    }

    const client = new Anthropic()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    try {
      return Response.json(JSON.parse(jsonMatch?.[0] ?? text))
    } catch {
      return Response.json(FALLBACK)
    }
  } catch {
    return Response.json(FALLBACK)
  }
}
