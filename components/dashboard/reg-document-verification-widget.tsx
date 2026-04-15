import { ScanSearch, Sparkles } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddContextButton } from './add-context-button'
import { docVerificationStats, recentDocScans } from '@/data/mock-registration'

export function RegDocumentVerificationWidget() {
  const total = docVerificationStats.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="col-span-1 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ScanSearch className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Document Verification</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">OCR AI</Badge>
            <AddContextButton
              id="reg-doc-verification"
              entry={{ label: 'Document Verification', summary: '268 total documents: 186 verified (69%), 64 pending OCR (24%), 18 flagged for manual review (7%).' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          OCR + AI cross-verification engine
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Donut chart */}
        <div className="relative h-[100px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 320, height: 200 }}>
            <PieChart>
              <Pie
                data={docVerificationStats}
                dataKey="count"
                nameKey="verificationLabel"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={2}
              >
                {docVerificationStats.map((d) => (
                  <Cell key={d.verificationLabel} fill={d.fill} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                itemStyle={{ color: '#cbd5e1' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{total}</p>
              <p className="text-[11px] text-muted-foreground">docs</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4">
          {docVerificationStats.map(({ verificationLabel, count, fill }) => (
            <div key={verificationLabel} className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ background: fill }} />
              <span className="text-muted-foreground">{verificationLabel}</span>
              <span className="font-semibold text-foreground">{count}</span>
            </div>
          ))}
        </div>

        {/* Recent scans */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent Scans</p>
          {recentDocScans.map(({ name, confidence, docStatus, time }) => (
            <div key={name} className="flex items-center gap-2 bg-muted/30 rounded-lg px-2.5 py-2">
              <span className="text-[11px] text-foreground flex-1 truncate">{name}</span>
              <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
              <Badge
                variant="outline"
                className={`text-[11px] shrink-0 ${
                  docStatus === 'Verified'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : docStatus === 'Flagged'
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {docStatus}
              </Badge>
              <span className="text-[11px] font-semibold text-muted-foreground shrink-0">{confidence}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
