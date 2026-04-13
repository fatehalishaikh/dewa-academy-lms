import {
  adaptiveStudents, examQuestions, examSubmissions,
  type ExamQuestion, type DifficultyLevel, type Exam,
} from '@/data/mock-assessments'
import { students } from '@/data/mock-students'

export type DifficultyProfile = {
  level: DifficultyLevel
  accuracy: number
  source: 'adaptive-roster' | 'submissions' | 'gpa'
  rationale: string
}

export type DifficultyMix = { easy: number; medium: number; hard: number }

export function getStudentDifficultyProfile(studentId: string): DifficultyProfile {
  // 1. Adaptive roster (most precise)
  const adaptive = adaptiveStudents.find(a => a.studentId === studentId)
  if (adaptive) {
    return {
      level: adaptive.difficulty,
      accuracy: adaptive.accuracy,
      source: 'adaptive-roster',
      rationale: `${adaptive.questionsAnswered} questions answered · ${adaptive.accuracy}% accuracy · ${adaptive.trend} trend`,
    }
  }

  // 2. Past exam submission scores
  const graded = examSubmissions.filter(s => s.studentId === studentId && s.score !== null && s.submissionStatus === 'graded')
  if (graded.length > 0) {
    const avgScore = graded.reduce((sum, s) => sum + (s.score ?? 0), 0) / graded.length
    // exam-003 has totalPoints 30 as reference
    const avgPct = Math.min(100, Math.round((avgScore / 30) * 100))
    const level: DifficultyLevel = avgPct >= 80 ? 'Hard' : avgPct >= 60 ? 'Medium' : 'Easy'
    return {
      level,
      accuracy: avgPct,
      source: 'submissions',
      rationale: `Average exam score ${avgScore.toFixed(0)}/30 across ${graded.length} past exam${graded.length > 1 ? 's' : ''}`,
    }
  }

  // 3. GPA / status fallback
  const student = students.find(s => s.id === studentId)
  const gpa = student?.gpa ?? 2.5
  const status = student?.status ?? 'active'
  const level: DifficultyLevel = status === 'active' && gpa >= 3.5 ? 'Hard' : gpa >= 2.8 || status === 'active' ? 'Medium' : 'Easy'
  return {
    level,
    accuracy: Math.round((gpa / 4.0) * 100),
    source: 'gpa',
    rationale: `GPA ${gpa.toFixed(1)} · status: ${status}`,
  }
}

/** Distribute `total` questions across difficulty buckets. */
export function buildDifficultyMix(level: DifficultyLevel, total: number): DifficultyMix {
  const ratios: Record<DifficultyLevel, [number, number, number]> = {
    Hard:   [0.15, 0.30, 0.55],
    Medium: [0.30, 0.50, 0.20],
    Easy:   [0.55, 0.35, 0.10],
  }
  const [er, mr, hr] = ratios[level]
  const easy   = Math.round(total * er)
  const medium = Math.round(total * mr)
  const hard   = total - easy - medium
  return { easy, medium: medium < 0 ? 0 : medium, hard: hard < 0 ? 0 : hard }
}

/** Deterministic shuffle keyed on a seed string. */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  for (let i = result.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash) + i
    hash |= 0
    const j = Math.abs(hash) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Build a per-student question set for an adaptive exam.
 * Pulls from the bank first; tops up from the AI API if needed.
 */
export async function selectAdaptiveQuestions(exam: Exam, studentId: string): Promise<ExamQuestion[]> {
  const subject    = exam.adaptive?.subject ?? exam.title
  const topic      = exam.adaptive?.topic
  const total      = exam.adaptive?.totalQuestions ?? 8
  const seed       = `${exam.id}:${studentId}`
  const profile    = getStudentDifficultyProfile(studentId)
  const mix        = buildDifficultyMix(profile.level, total)

  const selected: ExamQuestion[] = []

  const buckets: Array<{ level: DifficultyLevel; count: number }> = [
    { level: 'Easy',   count: mix.easy   },
    { level: 'Medium', count: mix.medium },
    { level: 'Hard',   count: mix.hard   },
  ]

  for (const { level, count } of buckets) {
    if (count <= 0) continue

    // Pick from question bank (filter by subject, then topic if provided)
    let pool = examQuestions.filter(q => {
      if (q.difficulty !== level) return false
      if (!q.subject.toLowerCase().includes(subject.toLowerCase())) return false
      if (topic) {
        const topicRoot = topic.toLowerCase().split("'")[0].split(' ')[0]
        if (!q.topic.toLowerCase().includes(topicRoot)) return false
      }
      return true
    })

    // Relax topic filter if empty
    if (pool.length === 0 && topic) {
      pool = examQuestions.filter(q =>
        q.difficulty === level && q.subject.toLowerCase().includes(subject.toLowerCase())
      )
    }

    pool = seededShuffle(pool, seed + level)
    const fromBank = pool.slice(0, count)
    selected.push(...fromBank)

    const deficit = count - fromBank.length
    if (deficit > 0) {
      try {
        const res = await fetch('/api/ai/questions/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, topic: topic ?? undefined, difficulty: level, count: deficit }),
        })
        if (res.ok) {
          const aiQs: ExamQuestion[] = await res.json()
          selected.push(...aiQs.slice(0, deficit))
        } else {
          throw new Error('AI generate failed')
        }
      } catch {
        // Fallback: any questions of this level from the whole bank
        const fallback = seededShuffle(
          examQuestions.filter(q => q.difficulty === level),
          seed + level + 'fallback'
        ).slice(0, deficit)
        selected.push(...fallback)
      }
    }
  }

  // Interleave all selected questions
  return seededShuffle(selected, seed + 'final')
}
