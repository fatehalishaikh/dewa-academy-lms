// Shim: re-exports from academy-store for backwards compatibility.
// Migrate callers to import from '@/stores/academy-store' directly.
export type { GeneratedCourse, CourseSection, CourseMilestone } from '@/stores/academy-store'
export { useAcademyStore as useStudentCourseStore } from '@/stores/academy-store'
