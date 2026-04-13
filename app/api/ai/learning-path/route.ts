import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { studentName, gpa, attendanceRate, learningStyle, subjects, goals, gradeLevel, description, currentGrade } = await req.json() as {
    studentName: string
    gpa: number
    attendanceRate: number
    learningStyle?: string
    subjects?: string[]
    goals?: string[]
    gradeLevel?: string
    description?: string
    currentGrade?: number
  }

  const prompt = `You are a personalized learning path AI for DEWA Academy.

Generate a personalized learning path for the following student:

Student: ${studentName}
Grade Level: ${gradeLevel ?? 'Secondary'}
GPA: ${gpa.toFixed(2)} / 4.0
Attendance Rate: ${attendanceRate}%
Learning Style: ${learningStyle ?? 'Not specified'}
${subjects?.length ? `Requested Subject: ${subjects.join(', ')}` : ''}
${currentGrade !== undefined ? `Current Grade in Subject: ${currentGrade}%` : ''}
${goals?.length ? `Active Goals: ${goals.join('; ')}` : ''}
${description ? `Student's Learning Goal / Context: ${description}` : ''}

IMPORTANT: All recommendations, topics, weekly activities, and resources MUST be directly relevant to the requested subject(s) and the student's described learning goal above. Be specific and concrete — not generic.

Return a JSON object with this exact structure:
{
  "focusAreas": [
    { "subject": "<subject name>", "priority": "high" | "medium" | "low", "currentLevel": "<brief assessment>", "targetLevel": "<target>", "recommendation": "<specific action>" }
  ],
  "weeklyPlan": [
    { "week": 1, "theme": "<focus theme>", "activities": ["<activity 1>", "<activity 2>", "<activity 3>"], "hoursRequired": <number> }
  ],
  "resources": [
    { "title": "<resource name>", "type": "video" | "practice" | "reading" | "tutoring" | "project", "subject": "<subject>", "priority": "high" | "medium" | "low", "estimatedTime": "<e.g. 30 min>" }
  ],
  "milestones": [
    { "title": "<milestone>", "targetWeek": <number 1-4>, "metric": "<measurable outcome>", "subject": "<subject>" }
  ],
  "overallStrategy": "<2-3 sentence personalized strategy summary>"
}

Include 3 focusAreas, 4 weeklyPlan entries, 5 resources, and 4 milestones. Make recommendations specific, actionable, and tailored to the student's profile.`

  if (provider === 'openai') {
    const openai = new OpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })
    const text = response.choices[0]?.message?.content ?? '{}'
    try { return Response.json(JSON.parse(text)) }
    catch { return Response.json(fallback(studentName, gpa)) }
  }

  const client = new Anthropic()
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  try { return Response.json(JSON.parse(jsonMatch?.[0] ?? text)) }
  catch { return Response.json(fallback(studentName, gpa)) }
}

function fallback(studentName: string, gpa: number) {
  const isStruggling = gpa < 3.0
  return {
    focusAreas: [
      { subject: 'Mathematics', priority: isStruggling ? 'high' : 'medium', currentLevel: isStruggling ? 'Needs reinforcement' : 'Developing', targetLevel: 'Proficient', recommendation: 'Complete 3 practice sets per week focusing on problem-solving' },
      { subject: 'English', priority: 'medium', currentLevel: 'Developing', targetLevel: 'Proficient', recommendation: 'Read one article daily and write a short summary' },
      { subject: 'Physics', priority: isStruggling ? 'high' : 'low', currentLevel: 'Foundational', targetLevel: 'Developing', recommendation: 'Review key formulas and attempt past exam questions' },
    ],
    weeklyPlan: [
      { week: 1, theme: 'Foundation Review', activities: ['Complete diagnostic assessment', 'Identify knowledge gaps', 'Set weekly targets with teacher'], hoursRequired: 5 },
      { week: 2, theme: 'Core Skill Building', activities: ['AI Tutor sessions (3×)', 'Practice worksheets', 'Group study session'], hoursRequired: 6 },
      { week: 3, theme: 'Applied Practice', activities: ['Mock assessment attempt', 'Review and correct errors', 'Peer teaching exercise'], hoursRequired: 6 },
      { week: 4, theme: 'Assessment & Reflection', activities: ['Mini assessment', 'Progress review with teacher', 'Update goals for next month'], hoursRequired: 4 },
    ],
    resources: [
      { title: 'AI Tutor — Mathematics', type: 'tutoring', subject: 'Mathematics', priority: 'high', estimatedTime: '30 min/session' },
      { title: 'Khan Academy Practice Sets', type: 'practice', subject: 'Mathematics', priority: 'high', estimatedTime: '20 min' },
      { title: 'English Reading Comprehension Pack', type: 'reading', subject: 'English', priority: 'medium', estimatedTime: '15 min/day' },
      { title: 'Physics Formula Video Series', type: 'video', subject: 'Physics', priority: 'medium', estimatedTime: '10 min each' },
      { title: 'Past Exam Papers', type: 'practice', subject: 'All', priority: 'high', estimatedTime: '45 min each' },
    ],
    milestones: [
      { title: 'Complete Foundation Assessment', targetWeek: 1, metric: 'Score ≥ 60% on diagnostic', subject: 'Mathematics' },
      { title: 'Finish 5 AI Tutor Sessions', targetWeek: 2, metric: '5 sessions completed', subject: 'Mathematics' },
      { title: 'Submit Practice Portfolio', targetWeek: 3, metric: '3 completed worksheets', subject: 'English' },
      { title: 'Achieve Target on Mini Assessment', targetWeek: 4, metric: `Score ≥ ${Math.round(gpa * 25)}%`, subject: 'All' },
    ],
    overallStrategy: `${studentName} benefits from a structured, scaffolded approach with regular check-ins. Focus on reinforcing foundational concepts before advancing to complex applications. Weekly goal-setting and reflection will help maintain motivation and track progress.`,
  }
}
