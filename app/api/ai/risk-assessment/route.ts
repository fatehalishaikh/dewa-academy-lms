import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { studentName, gpa, attendanceRate, status, gradeHistory, recentNotes } = await req.json() as {
    studentName: string
    gpa: number
    attendanceRate: number
    status: string
    gradeHistory?: { month: string; score: number }[]
    recentNotes?: string[]
  }

  const trend = gradeHistory && gradeHistory.length >= 2
    ? gradeHistory[gradeHistory.length - 1].score - gradeHistory[0].score > 0 ? 'improving' : 'declining'
    : 'stable'

  const prompt = `You are an AI risk assessment system for DEWA Academy.

Analyze the following student data and provide a comprehensive risk assessment:

Student: ${studentName}
GPA: ${gpa.toFixed(2)} / 4.0
Attendance Rate: ${attendanceRate}%
Current Status: ${status}
Grade Trend: ${trend}
${gradeHistory ? `Grade History: ${gradeHistory.map(g => `${g.month}: ${g.score}`).join(', ')}` : ''}
${recentNotes?.length ? `Recent Teacher Notes: ${recentNotes.join('; ')}` : ''}

Return a JSON object with this exact structure:
{
  "riskScore": <integer 0-100, where 100 = highest risk>,
  "riskLevel": "high" | "moderate" | "low",
  "summary": "<2-3 sentence risk summary>",
  "factors": [
    { "name": "Academic Performance", "score": <0-100>, "weight": 30, "status": "positive" | "warning" | "critical" },
    { "name": "Attendance Pattern", "score": <0-100>, "weight": 25, "status": "positive" | "warning" | "critical" },
    { "name": "Engagement Level", "score": <0-100>, "weight": 20, "status": "positive" | "warning" | "critical" },
    { "name": "Assignment Completion", "score": <0-100>, "weight": 15, "status": "positive" | "warning" | "critical" },
    { "name": "Behavioral Indicators", "score": <0-100>, "weight": 10, "status": "positive" | "warning" | "critical" }
  ],
  "recommendations": [
    "<specific actionable intervention>",
    "<specific actionable intervention>",
    "<specific actionable intervention>"
  ],
  "interventionPriority": "immediate" | "within-week" | "monitor"
}`

  if (provider === 'openai') {
    const openai = new OpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 768,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })
    const text = response.choices[0]?.message?.content ?? '{}'
    try { return Response.json(JSON.parse(text)) }
    catch { return Response.json(fallback(gpa, attendanceRate)) }
  }

  const client = new Anthropic()
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 768,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  try { return Response.json(JSON.parse(jsonMatch?.[0] ?? text)) }
  catch { return Response.json(fallback(gpa, attendanceRate)) }
}

function fallback(gpa: number, attendanceRate: number) {
  const riskScore = Math.max(0, Math.min(100, Math.round((4.0 - gpa) * 20 + (100 - attendanceRate) * 0.5)))
  return {
    riskScore,
    riskLevel: riskScore > 60 ? 'high' : riskScore > 35 ? 'moderate' : 'low',
    summary: 'Risk assessment based on available academic and attendance data.',
    factors: [
      { name: 'Academic Performance', score: Math.round(gpa * 25), weight: 30, status: gpa >= 3.0 ? 'positive' : gpa >= 2.0 ? 'warning' : 'critical' },
      { name: 'Attendance Pattern', score: attendanceRate, weight: 25, status: attendanceRate >= 90 ? 'positive' : attendanceRate >= 75 ? 'warning' : 'critical' },
      { name: 'Engagement Level', score: 70, weight: 20, status: 'warning' },
      { name: 'Assignment Completion', score: 75, weight: 15, status: 'positive' },
      { name: 'Behavioral Indicators', score: 85, weight: 10, status: 'positive' },
    ],
    recommendations: [
      'Schedule a check-in meeting with the student',
      'Review and adjust learning plan based on current progress',
      'Notify parents of current academic standing',
    ],
    interventionPriority: riskScore > 60 ? 'immediate' : riskScore > 35 ? 'within-week' : 'monitor',
  }
}
