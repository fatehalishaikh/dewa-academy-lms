import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'
import { format } from 'date-fns'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { studentName, gpa, attendanceRate, status, dateFrom, dateTo, gradeLevel, recentGrades, riskFactors, goals } = await req.json() as {
    studentName: string
    gpa: number
    attendanceRate: number
    status: string
    dateFrom?: string
    dateTo?: string
    gradeLevel?: string
    recentGrades?: { subject: string; grade: number }[]
    riskFactors?: string[]
    goals?: string[]
  }

  const periodLabel = dateFrom && dateTo
    ? `${format(new Date(dateFrom), 'MMM d, yyyy')} – ${format(new Date(dateTo), 'MMM d, yyyy')}`
    : dateFrom
      ? `From ${format(new Date(dateFrom), 'MMM d, yyyy')}`
      : 'Recent period'

  const gradesStr = recentGrades?.length
    ? recentGrades.map(g => `${g.subject}: ${g.grade}%`).join(', ')
    : 'Data not available'

  const systemPrompt = `You are an expert school counselor and report writer for DEWA Academy.
Generate professional, warm, and actionable progress reports for parents.
Use markdown formatting with clear headings. Be specific, encouraging, and honest.
IMPORTANT: Never use placeholder text such as "[your name]", "[student name]", "[parent name]", "[insert name]", or any bracketed placeholders. Always use the actual student name provided in the prompt. Write the report as a finished, ready-to-read document addressed directly to the parent.`

  const userPrompt = `Generate a comprehensive progress report for the parent of ${studentName}.

Student Information:
- Name: ${studentName}
- Grade Level: ${gradeLevel ?? 'Grade 10'}
- GPA: ${gpa.toFixed(2)} / 4.0
- Attendance Rate: ${attendanceRate}%
- Overall Status: ${status}
- Report Period: ${periodLabel}
- Recent Grades: ${gradesStr}
${riskFactors?.length ? `- Areas of Concern: ${riskFactors.join(', ')}` : ''}
${goals?.length ? `- Current Learning Goals: ${goals.join(', ')}` : ''}

Write a structured progress report with these sections:

## Academic Overview
Summarize academic performance with specific subject mentions and trends.

## Attendance & Punctuality
Comment on attendance patterns and any notable observations.

## Strengths & Achievements
Highlight 2-3 specific strengths or achievements this period.

## Areas for Growth
Identify 1-2 areas needing attention with specific, actionable suggestions.

## Recommended Actions for Parents
Provide 3-4 specific, practical things parents can do at home to support their child.

## Looking Ahead
Brief encouraging note about the next period with goals to focus on.

Keep the tone warm, professional, and parent-friendly. Avoid overly technical jargon. Address the parent directly and use ${studentName}'s name throughout.`

  const encoder = new TextEncoder()

  function streamText(text: string): Response {
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      },
    })
    return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  try {
    if (provider === 'openai') {
      const openai = new OpenAI()
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
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
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
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
  } catch {
    return streamText(
      `## Progress Report — ${studentName}\n\n` +
      `**Report Period:** ${periodLabel}\n\n` +
      `---\n\n` +
      `We were unable to generate the AI report at this time. This may be a temporary issue.\n\n` +
      `**Please try again** by clicking the Generate Report button. If the issue persists, contact school support.\n\n` +
      `*Student: ${studentName} · GPA: ${gpa.toFixed(2)} · Attendance: ${attendanceRate}%*`
    )
  }
}
