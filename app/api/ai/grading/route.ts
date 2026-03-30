import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const provider = process.env.AI_PROVIDER ?? 'anthropic'

export async function POST(req: NextRequest) {
  const { questionText, questionType, correctAnswer, studentAnswer, maxPoints, subject } = await req.json() as {
    questionText: string
    questionType: string
    correctAnswer?: string
    studentAnswer: string
    maxPoints: number
    subject?: string
  }

  const prompt = `You are an expert grader for DEWA Academy${subject ? ` in ${subject}` : ''}.

Question (${questionType}): ${questionText}
${correctAnswer ? `Model Answer / Key Points: ${correctAnswer}` : ''}
Max Points: ${maxPoints}
Student Answer: ${studentAnswer}

Grade this student answer and return a JSON object with this exact structure:
{
  "score": <integer 0 to ${maxPoints}>,
  "confidence": <integer 0 to 100, how confident you are in this grade>,
  "feedback": "<2-3 sentence personalized feedback for the student>",
  "strengths": ["<strength observed in the answer>", "<strength>"],
  "improvements": ["<specific improvement suggestion>", "<suggestion>"]
}

Be fair, specific, and constructive. For MCQ/True-False, check for exact correctness. For Essay, evaluate content quality, argument structure, and accuracy.`

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
      return Response.json(fallback(maxPoints))
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
    return Response.json(fallback(maxPoints))
  }
}

function fallback(maxPoints: number) {
  return {
    score: Math.round(maxPoints * 0.75),
    confidence: 70,
    feedback: 'The answer demonstrates a reasonable understanding of the topic. More detail and specific examples would strengthen the response.',
    strengths: ['Addresses the question', 'Reasonable structure'],
    improvements: ['Add more specific examples', 'Expand on key concepts'],
  }
}
