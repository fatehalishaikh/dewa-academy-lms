import { create } from 'zustand'

type SubjectStore = {
  activeSubject: string
  setActiveSubject: (subject: string) => void
}

export const useSubjectStore = create<SubjectStore>((set) => ({
  activeSubject: 'all',
  setActiveSubject: (subject) => set({ activeSubject: subject }),
}))
