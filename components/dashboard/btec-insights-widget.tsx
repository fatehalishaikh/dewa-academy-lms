import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScanText, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { btecDocuments, btecInsights } from '@/data/mock-assessments'
import { AddContextButton } from './add-context-button'

const docStatusStyles: Record<string, string> = {
  processed: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  processing: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
}

const docStatusLabels: Record<string, string> = {
  processed: 'Processed',
  processing: 'Processing…',
  failed: 'Failed',
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-chart-4" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-destructive" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

function completionColor(rate: number) {
  if (rate >= 80) return '#00B8A9'
  if (rate >= 65) return '#FFC107'
  return '#EF4444'
}

export function BTECInsightsWidget() {
  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ScanText className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">BTEC Document Insights</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              OCR Active
            </Badge>
            <AddContextButton
              id="btec-insights"
              entry={{ label: 'BTEC Insights', summary: '14 BTEC documents processed this week. OCR accuracy: 97.3%. Unit 4 completion rate 78% (above cohort avg). Unit 7 at 65% (below avg — may need intervention). 1 document currently processing.' }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Document processing &amp; extracted assessment data</p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="uploads">
          <TabsList className="w-full mb-4 bg-muted/40 rounded-xl h-8">
            <TabsTrigger value="uploads" className="flex-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Recent Uploads</TabsTrigger>
            <TabsTrigger value="insights" className="flex-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="space-y-2 mt-0">
            {btecDocuments.map(doc => (
              <div key={doc.filename} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate max-w-[150px]">{doc.filename.replace('.pdf', '')}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {doc.uploadDate}
                      {doc.fieldsExtracted > 0 && ` · ${doc.fieldsExtracted} fields extracted`}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[11px] ${docStatusStyles[doc.status]}`}>
                  {docStatusLabels[doc.status]}
                </Badge>
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground pt-1 px-1">
              OCR accuracy: <span className="text-primary font-semibold">97.3%</span> · 14 documents processed this week
            </p>
          </TabsContent>

          <TabsContent value="insights" className="space-y-3 mt-0">
            {btecInsights.map(insight => {
              const color = completionColor(insight.completionRate)
              return (
                <div key={insight.unit} className="p-3 rounded-xl bg-muted/40 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-foreground leading-tight">{insight.unit}</p>
                    <TrendIcon trend={insight.trend} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={insight.completionRate} className="h-1.5 flex-1" style={{ '--progress-color': color } as React.CSSProperties} />
                    <span className="text-[11px] font-semibold shrink-0" style={{ color }}>{insight.completionRate}%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Cohort avg: {insight.cohortAvg}%</p>
                </div>
              )
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
