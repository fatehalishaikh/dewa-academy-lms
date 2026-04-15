import { ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddContextButton } from './add-context-button'
import { mockApplications } from '@/data/mock-registration'

const flagged = mockApplications.filter(a => a.flagged).slice(0, 5)

function severityColor(reasons: string[]) {
  if (reasons.includes('Suspicious Data')) return { bg: 'bg-red-500/10', text: 'text-red-400', dot: '#EF4444', label: 'High' }
  if (reasons.includes('Low Score') || reasons.includes('GPA Mismatch')) return { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: '#FFC107', label: 'Medium' }
  return { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: '#3B82F6', label: 'Low' }
}

export function RegFlaggedWidget() {
  return (
    <Card className="col-span-1 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            <CardTitle className="text-base font-semibold">Flagged Applications</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">{flagged.length} Active</Badge>
            <AddContextButton
              id="reg-flagged"
              entry={{ label: 'Flagged Applications', summary: '18 flagged applications need manual review. Reasons: incomplete documents (6), suspicious data (3), low score (4), expired ID (2), GPA mismatch (3). Assign reviewers to clear queue.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Requires manual review before advancing</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {flagged.map(app => {
          const severity = severityColor(app.flagReasons)
          return (
            <div key={app.id} className="bg-muted/30 rounded-lg px-3 py-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">{app.initials}</div>
                  <span className="text-xs font-medium text-foreground truncate">{app.nameEn}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: severity.dot }} />
                  <span className={`text-[11px] font-semibold ${severity.text}`}>{severity.label}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {app.flagReasons.map(r => (
                  <Badge key={r} variant="outline" className={`text-[11px] ${severity.bg} ${severity.text} border-current/20`}>{r}</Badge>
                ))}
                {app.assignedReviewer && (
                  <span className="text-[11px] text-muted-foreground ml-auto">→ {app.assignedReviewer.split(' ').slice(-1)[0]}</span>
                )}
              </div>
            </div>
          )
        })}
        <p className="text-[11px] text-muted-foreground text-center pt-1">+ 13 more flagged applications</p>
      </CardContent>
    </Card>
  )
}
