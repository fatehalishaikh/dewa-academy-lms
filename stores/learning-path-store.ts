// Shim: re-exports from academy-store for backwards compatibility.
// Migrate callers to import from '@/stores/academy-store' directly.
export type { LearningPathResult, PublishedPath } from '@/stores/academy-store'
export { useAcademyStore as useLearningPathStore } from '@/stores/academy-store'
