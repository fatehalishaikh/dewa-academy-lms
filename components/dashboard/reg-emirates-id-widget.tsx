import { CreditCard, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddContextButton } from './add-context-button'

const recentExtractions = [
  { initials: 'MH', name: 'Mohammed Al Hamdan', confidence: 98, time: '2 min ago' },
  { initials: 'LK', name: 'Layla Al Kindi', confidence: 96, time: '18 min ago' },
  { initials: 'NB', name: 'Noura Binsaeed', confidence: 94, time: '1 hr ago' },
]

export function RegEmiratesIdWidget() {
  return (
    <Card className="col-span-1 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Emirates ID Extraction</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ICP UAE</Badge>
            <AddContextButton
              id="reg-emirates-id"
              entry={{ label: 'Emirates ID Extraction', summary: 'AI OCR extracting Emirates IDs with avg 97% confidence. 3 recent extractions completed. All fields auto-verified against ICP UAE.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          AI-powered OCR with UAE PASS verification
        </p>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Recent extractions */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</p>
          {recentExtractions.map(({ initials, name, confidence, time }) => (
            <div key={name} className="flex items-center gap-2 bg-muted/30 rounded-lg px-2.5 py-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">{initials}</div>
              <span className="text-xs text-foreground flex-1 truncate">{name}</span>
              <span className="text-[11px] text-muted-foreground">{time}</span>
              <span className="text-[11px] font-semibold text-green-400">{confidence}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
