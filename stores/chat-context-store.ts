import { create } from 'zustand'

export type ContextEntry = { label: string; summary: string }

type ChatContextStore = {
  contexts: Record<string, ContextEntry>
  addContext: (id: string, entry: ContextEntry) => void
  removeContext: (id: string) => void
  clearContexts: () => void
}

export const useChatContext = create<ChatContextStore>((set) => ({
  contexts: {},
  addContext: (id, entry) =>
    set((s) => ({ contexts: { ...s.contexts, [id]: entry } })),
  removeContext: (id) =>
    set((s) => {
      const next = { ...s.contexts }
      delete next[id]
      return { contexts: next }
    }),
  clearContexts: () => set({ contexts: {} }),
}))
