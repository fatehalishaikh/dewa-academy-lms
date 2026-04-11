'use client'
import { useState } from 'react'
import { ShieldAlert, Bell, Mail, PauseCircle, Calendar, ClipboardCheck, Route, Users, Eye, MessageCircle, Plus, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { interventionPlaybooks } from '@/data/mock-ilp'
import { useAcademyStore } from '@/stores/academy-store'

const stepIcons: Record<string, React.ElementType> = {
  Bell, Mail, PauseCircle, Calendar, ClipboardCheck, Route, Users, Eye, MessageCircle,
}

const playlistStyles: Record<string, { header: string; badge: string }> = {
  high: {
    header: 'bg-destructive/5 border-destructive/20',
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  moderate: {
    header: 'bg-chart-5/5 border-chart-5/20',
    badge: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  },
  low: {
    header: 'bg-chart-4/5 border-chart-4/20',
    badge: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  },
}

const thresholds = [
  { label: 'High Risk', range: '> 70', color: '#EF4444' },
  { label: 'Moderate Risk', range: '40 – 70', color: '#FFC107' },
  { label: 'Low Risk', range: '< 40', color: '#4CAF50' },
]

export default function RiskIntervention() {
  const { ilpSettings, updateRiskFactors } = useAcademyStore()
  const riskFactors = ilpSettings.riskFactors
  const [localWeights, setLocalWeights] = useState<Record<string, number>>(
    Object.fromEntries(riskFactors.map(f => [f.name, f.weight]))
  )
  const [saved, setSaved] = useState(false)

  function handleWeightChange(name: string, value: number) {
    setLocalWeights(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  function handleSaveFormula() {
    const updated = riskFactors.map(f => ({ ...f, weight: localWeights[f.name] ?? f.weight }))
    updateRiskFactors(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Risk &amp; Intervention Configuration</h2>
          <p className="text-xs text-muted-foreground">Define the risk formula and intervention playbooks</p>
        </div>
        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ILP 2.3</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk formula */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Risk Score Formula</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Weighted factors summing to 100%</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {riskFactors.map(factor => (
              <div key={factor.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground">{factor.name}</p>
                    <p className="text-[10px] text-muted-foreground">{factor.description}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{localWeights[factor.name] ?? factor.weight}%</span>
                </div>
                <Slider
                  value={[localWeights[factor.name] ?? factor.weight]}
                  onValueChange={(vals) => handleWeightChange(factor.name, (vals as number[])[0])}
                  min={0} max={60} step={5} className="w-full"
                />
              </div>
            ))}

            <Separator />

            {/* Threshold configuration */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-foreground">Risk Thresholds</p>
              {thresholds.map(t => (
                <div key={t.label} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                  <span className="text-xs text-foreground flex-1">{t.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Score</span>
                    <span className="text-xs font-mono font-medium text-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                      {t.range}
                    </span>
                  </div>
                </div>
              ))}
              <Button size="sm" className="rounded-full text-xs w-full mt-1 gap-1.5" onClick={handleSaveFormula}>
                {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                {saved ? 'Formula Saved' : 'Save Formula'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Intervention playbooks */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold">Intervention Playbooks</CardTitle>
            <p className="text-xs text-muted-foreground">Automated actions triggered at each risk level</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Accordion defaultValue={['high']} className="space-y-2">
              {interventionPlaybooks.map(pb => {
                const styles = playlistStyles[pb.level]
                return (
                  <AccordionItem key={pb.level} value={pb.level}
                    className={`rounded-xl border px-4 ${styles.header}`}>
                    <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${styles.badge}`}>
                          {pb.label.split(' ')[0]}
                        </Badge>
                        <span>{pb.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3">
                      <ol className="space-y-2">
                        {pb.steps.map((step, i) => {
                          const Icon = stepIcons[step.icon] ?? Bell
                          return (
                            <li key={i} className="flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              <div className="flex items-center gap-1.5 flex-1">
                                <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-xs text-foreground">{step.text}</span>
                              </div>
                            </li>
                          )
                        })}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
            <Button size="sm" variant="outline" className="rounded-full w-full text-xs gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Playbook
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Prediction settings */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Predictive Model Settings</CardTitle>
          <p className="text-xs text-muted-foreground">Configure risk factors and the AI prediction model</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Prediction Window</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="14" type="number" className="h-8 text-xs rounded-lg w-16" />
                <span className="text-xs text-muted-foreground">days ahead</span>
              </div>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Minimum Confidence</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="70" type="number" className="h-8 text-xs rounded-lg w-16" />
                <span className="text-xs text-muted-foreground">% to flag</span>
              </div>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Review Frequency</Label>
              <div className="flex items-center gap-2">
                <Input defaultValue="7" type="number" className="h-8 text-xs rounded-lg w-16" />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
