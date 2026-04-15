'use client'
import { useState } from 'react'
import { Target, Plus, Pencil, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { goalTemplates, reflectionPrompts } from '@/data/mock-ilp'

const categoryStyles: Record<string, string> = {
  Academic: 'bg-primary/10 text-primary border-primary/20',
  Behavioral: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  Career: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  Personal: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
}

export default function GoalSetting() {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Goal Setting &amp; Reflection</h2>
          <p className="text-xs text-muted-foreground">Configure goal templates and the AI-assisted reflection schedule</p>
        </div>
        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ILP 2.5</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Goal templates */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Goal Templates</CardTitle>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Pre-built goal structures used by the AI advisor</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {goalTemplates.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-muted/40">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{t.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-[11px] ${categoryStyles[t.category]}`}>{t.category}</Badge>
                    <span className="text-[11px] text-muted-foreground">Target: {t.targetType}</span>
                  </div>
                </div>
                <Select defaultValue={t.targetType}>
                  <SelectTrigger className="h-7 w-28 text-[11px] rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Count">Count</SelectItem>
                    <SelectItem value="Boolean">Boolean</SelectItem>
                    <SelectItem value="Date">Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" variant="ghost" className="w-7 h-7 shrink-0">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button size="sm" variant="outline" className="rounded-full w-full text-xs gap-1 mt-1">
              <Plus className="w-3.5 h-3.5" /> Add Template
            </Button>
          </CardContent>
        </Card>

        {/* Reflection prompts and schedule */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold">Reflection Prompts &amp; Schedule</CardTitle>
            <p className="text-xs text-muted-foreground">Prompts used by the AI advisor during student reflection sessions</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {reflectionPrompts.map((p, i) => (
              <div key={p.id} className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground uppercase tracking-wide">
                  Prompt {i + 1}
                </Label>
                <Textarea
                  defaultValue={p.text}
                  className="text-xs rounded-xl min-h-[60px] resize-none"
                />
              </div>
            ))}
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Prompt
            </Button>

            <Separator />

            {/* Schedule */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-foreground">Reflection Schedule</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="h-8 text-xs rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Day</Label>
                  <Select defaultValue="thursday">
                    <SelectTrigger className="h-8 text-xs rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                        <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/40">
                <div>
                  <p className="text-xs font-medium text-foreground">Send reminder 1 day before</p>
                  <p className="text-[11px] text-muted-foreground">Notifies student via in-app push</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="sm" className="rounded-full text-xs gap-1.5" onClick={handleSave}>
                {saved && <CheckCircle2 className="w-3.5 h-3.5" />}
                {saved ? 'Settings Saved' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
