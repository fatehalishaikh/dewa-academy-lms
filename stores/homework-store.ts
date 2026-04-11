// Shim: re-exports from academy-store for backwards compatibility.
// Migrate callers to import from '@/stores/academy-store' directly.
export {
  useAcademyStore as useHomeworkStore,
} from '@/stores/academy-store'
export type { Homework, Submission } from '@/stores/academy-store'
