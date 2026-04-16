export const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':      '#00B8A9',
  'Statistics':       '#06B6D4',
  'Physics':          '#0EA5E9',
  'Chemistry':        '#F59E0B',
  'Biology':          '#10B981',
  'English Language': '#8B5CF6',
  'Literature':       '#8B5CF6',
  'Arabic':           '#EF4444',
  'Social Studies':   '#EC4899',
}

export function subjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] ?? '#6B7280'
}
