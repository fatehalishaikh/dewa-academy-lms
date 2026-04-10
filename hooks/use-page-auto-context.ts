'use client'

import { useMemo } from 'react'
import { useCurrentTeacher, useCurrentStudent, useCurrentParent } from '@/stores/role-store'
import { useAcademyStore } from '@/stores/academy-store'
import { getStudentById } from '@/data/mock-students'
import { getClassById, getClassesByStudent, getClassesByTeacher } from '@/data/mock-classes'

export function usePageAutoContext(pathname: string): string | null {
  const teacher = useCurrentTeacher()
  const student = useCurrentStudent()
  const parent = useCurrentParent()
  const { getHomeworkById, getSubmissionById, getSubmissionsForHomework } = useAcademyStore()

  return useMemo(() => {
    const segments = pathname.split('/')
    // segments[0] is always '' (leading slash)
    const role = segments[1]   // 'teacher', 'admin', 'student', 'parent'
    const resource = segments[2] // 'students', 'classes', 'homework', etc.
    const id = segments[3]       // entity id
    const sub = segments[5]      // submissionId for grade pages

    // --- Teacher: /teacher/homework/[id]/grade/[submissionId] ---
    if (role === 'teacher' && resource === 'homework' && id && segments[4] === 'grade' && sub) {
      const hw = getHomeworkById(id)
      const submission = getSubmissionById(sub)
      if (!hw || !submission) return null
      const s = getStudentById(submission.studentId)
      const studentName = s?.name ?? submission.studentId
      const aiScore = submission.aiScore !== null ? `${submission.aiScore}/${hw.totalPoints}` : 'not scored'
      return `Grading: ${studentName}'s submission for '${hw.title}'. AI score: ${aiScore}. Status: ${submission.status}.`
    }

    // --- Teacher: /teacher/homework/[id] (not /create) ---
    if (role === 'teacher' && resource === 'homework' && id && id !== 'create') {
      const hw = getHomeworkById(id)
      if (!hw) return null
      const cls = getClassById(hw.classId)
      const submissions = getSubmissionsForHomework(id)
      const submitted = submissions.filter(s => s.status !== 'not-submitted').length
      const graded = submissions.filter(s => s.status === 'graded').length
      const className = cls?.name ?? hw.classId
      return `Homework: '${hw.title}' for ${className}. Due: ${hw.dueDate}. Status: ${hw.status}. Submissions: ${submitted}/${submissions.length} (${graded} graded).`
    }

    // --- Admin or Teacher: /[role]/students/[id] ---
    if ((role === 'admin' || role === 'teacher') && resource === 'students' && id) {
      const s = getStudentById(id)
      if (!s) return null
      const classes = getClassesByStudent(s.id)
      const classList = classes.map(c => c.subject).join(', ') || 'none'
      return `Student: ${s.name} (${s.nameAr}), ${s.gradeLevel} ${s.section}. GPA: ${s.gpa}. Attendance: ${s.attendanceRate}%. Status: ${s.status}. Classes: ${classList}.`
    }

    // --- Teacher: /teacher/classes/[id] ---
    if (role === 'teacher' && resource === 'classes' && id) {
      const cls = getClassById(id)
      if (!cls) return null
      return `Class: ${cls.name} — ${cls.subject}. Room: ${cls.room}. Students: ${cls.studentIds.length}. Avg grade: ${cls.averageGrade}%. Attendance: ${cls.attendanceRate}%.`
    }

    // --- Student: /student/assignments/[id] ---
    if (role === 'student' && resource === 'assignments' && id) {
      const hw = getHomeworkById(id)
      if (!hw) return null
      return `Assignment: '${hw.title}'. Status: ${hw.status}. Due: ${hw.dueDate}. Points: ${hw.totalPoints}.`
    }

    // --- Teacher list pages ---
    if (role === 'teacher' && (resource === 'students' || resource === 'classes' || resource === 'homework' || resource === 'gradebook') && !id) {
      if (!teacher) return null
      const classes = getClassesByTeacher(teacher.id)
      const classList = classes.map(c => `${c.subject} (${c.name})`).join(', ') || 'none'
      return `Teacher: ${teacher.name}, ${teacher.department}. Teaching: ${classList}.`
    }

    // --- Student pages (non-detail) ---
    if (role === 'student' && !id) {
      if (!student) return null
      return `Student: ${student.name}, ${student.gradeLevel} ${student.section}. GPA: ${student.gpa}. Attendance: ${student.attendanceRate}%.`
    }

    // --- Parent pages ---
    if (role === 'parent') {
      if (!parent) return null
      const children = parent.childIds.map(cid => {
        const child = getStudentById(cid)
        if (!child) return null
        return `${child.name} (${child.gradeLevel}, GPA ${child.gpa})`
      }).filter(Boolean).join(', ')
      return `Parent: ${parent.name}. Children: ${children}.`
    }

    return null
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, teacher?.id, student?.id, parent?.id])
}
