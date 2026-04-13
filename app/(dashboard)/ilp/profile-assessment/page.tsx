'use client'
import { useState } from 'react'
import { ClipboardCheck, Plus, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { useAcademyStore } from '@/stores/academy-store'

export default function ProfileAssessment() {
  const { ilpSettings, updateThresholds, toggleDiagnosticAssessment } = useAcademyStore()
  const diagnosticAssessments = ilpSettings.diagnosticAssessments
  const thresholdBands = ilpSettings.thresholdBands
  const [localBands, setLocalBands] = useState(thresholdBands.map(b => ({ ...b })))
  const [saved, setSaved] = useState(false)

  function handleSaveThresholds() {
    updateThresholds(localBands)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Diagnostic Assessments */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-primary" />
              <CardTitle className="text-base font-semibold">Diagnostic Assessments</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              ILP 2.1
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Configure the adaptive quiz engine to identify learning styles, strengths, and barriers</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {diagnosticAssessments.map(a => (
            <div key={a.id} className="flex items-center gap-3 py-3 px-4 rounded-xl bg-muted/40">
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">Name</Label>
                  <Input defaultValue={a.name} className="h-8 text-xs rounded-lg" />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">Type</Label>
                  <Select defaultValue={a.type}>
                    <SelectTrigger className="h-8 text-xs rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                      <SelectItem value="Formative">Formative</SelectItem>
                      <SelectItem value="Summative">Summative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">Duration</Label>
                  <div className="flex items-center gap-2">
                    <Input defaultValue={a.duration} type="number" className="h-8 text-xs rounded-lg w-16" />
                    <span className="text-xs text-muted-foreground">min</span>
                  </div>
                </div>
              </div>
              <Switch
                checked={a.enabled}
                onCheckedChange={() => toggleDiagnosticAssessment(a.id)}
                className="shrink-0"
              />
            </div>
          ))}
          <Button size="sm" variant="outline" className="rounded-full w-full text-xs gap-1">
            <Plus className="w-3.5 h-3.5" />
            Add Assessment
          </Button>
        </CardContent>
      </Card>

      {/* Threshold Configuration */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Threshold Configuration</CardTitle>
            <p className="text-xs text-muted-foreground">Score ranges that determine student placement</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {localBands.map((band, idx) => (
            <div key={band.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: band.color }} />
                  <span className="text-sm font-medium text-foreground">{band.label}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{band.min}% – {band.max}%</span>
              </div>
              <Slider
                value={[band.min, band.max]}
                onValueChange={(vals) => {
                  const [min, max] = vals as number[]
                  setLocalBands(prev => prev.map((b, i) => i === idx ? { ...b, min, max } : b))
                  setSaved(false)
                }}
                min={0} max={100} step={1}
                className="w-full"
              />
            </div>
          ))}

          <Separator />

          {/* Preview bar */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Band Preview</p>
            <div className="flex rounded-lg overflow-hidden h-6 w-full">
              {localBands.slice().reverse().map(band => (
                <div
                  key={band.label}
                  className="flex items-center justify-center"
                  style={{
                    background: band.color,
                    width: `${band.max - band.min}%`,
                    opacity: 0.85,
                  }}
                >
                  <span className="text-[9px] font-semibold text-white truncate px-1">{band.label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm" className="rounded-full text-xs gap-1.5" onClick={handleSaveThresholds}>
              {saved && <CheckCircle2 className="w-3.5 h-3.5" />}
              {saved ? 'Thresholds Saved' : 'Save Thresholds'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
