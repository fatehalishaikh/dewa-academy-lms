'use client'
import { Filter, Search, Plus, Beaker } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { curationRules } from '@/data/mock-ilp'
import type { CurationRule } from '@/data/mock-ilp'

const statusStyles: Record<string, string> = {
  Active: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Draft: 'bg-muted text-muted-foreground border-border',
  Disabled: 'bg-destructive/10 text-destructive border-destructive/20',
}

const fieldOptions = ['learning_style', 'course_grade', 'course_grade.mathematics', 'course_grade.physics',
  'risk_score', 'days_inactive', 'attendance_rate', 'assignments_completion']
const operatorOptions = ['=', '>', '<', '>=', '<=', 'contains']

export default function CurationRules() {
  const [selected, setSelected] = useState<CurationRule>(curationRules[0])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Curation Rules Editor</h2>
          <p className="text-xs text-muted-foreground">Natural-language rules processed by the AI curation engine</p>
        </div>
        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ILP 2.2</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rule list panel */}
        <Card className="rounded-2xl border-border bg-card lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Rule Library</CardTitle>
            </div>
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search rules…" className="pl-8 h-8 text-xs rounded-lg" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {curationRules.map(rule => (
              <button
                key={rule.id}
                onClick={() => setSelected(rule)}
                className={`w-full text-left p-3 rounded-xl border transition-colors space-y-1.5 ${
                  selected.id === rule.id
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-foreground truncate">{rule.name}</p>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${statusStyles[rule.status]}`}>
                    {rule.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{rule.preview}</p>
                <p className="text-[10px] text-muted-foreground/60">{rule.affectedStudents} students affected</p>
              </button>
            ))}
            <Button size="sm" variant="outline" className="rounded-full w-full text-xs gap-1 mt-1">
              <Plus className="w-3.5 h-3.5" /> New Rule
            </Button>
          </CardContent>
        </Card>

        {/* Rule editor panel */}
        <Card className="rounded-2xl border-border bg-card lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Rule Editor — {selected.name}</CardTitle>
              <Badge variant="outline" className={`text-xs ${statusStyles[selected.status]}`}>{selected.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Rule Name</Label>
                <Input defaultValue={selected.name} className="h-8 text-xs rounded-lg" key={`name-${selected.id}`} />
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">Template</Label>
                <Select defaultValue={selected.template} key={`template-${selected.id}`}>
                  <SelectTrigger className="h-8 text-xs rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Learning Style Matching">Learning Style Matching</SelectItem>
                    <SelectItem value="Score-based Assignment">Score-based Assignment</SelectItem>
                    <SelectItem value="Time-based Progression">Time-based Progression</SelectItem>
                    <SelectItem value="Course Dependency">Course Dependency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Natural Language Rule — processed by the AI curation engine
              </Label>
              <Textarea
                key={`rule-${selected.id}`}
                defaultValue={selected.preview}
                className="text-xs rounded-xl min-h-[90px] resize-none font-mono leading-relaxed"
                placeholder="Write a plain-English instruction for Curative AI…"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Use variables: {'{'} student.learning_style {'}'}, {'{'} course.current_score {'}'}, {'{'} student.grade_level {'}'}
              </p>
            </div>

            <Separator />

            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-2 block">Conditions</Label>
              <div className="space-y-2">
                {selected.conditions.map((cond, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Select defaultValue={cond.field} key={`field-${selected.id}-${i}`}>
                      <SelectTrigger className="h-8 text-xs rounded-lg flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map(f => <SelectItem key={f} value={f} className="text-xs font-mono">{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select defaultValue={cond.operator} key={`op-${selected.id}-${i}`}>
                      <SelectTrigger className="h-8 text-xs rounded-lg w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input defaultValue={cond.value} className="h-8 text-xs rounded-lg w-24"
                      key={`val-${selected.id}-${i}`} />
                  </div>
                ))}
                <Button size="sm" variant="ghost" className="text-xs h-7 px-2 gap-1 text-muted-foreground">
                  <Plus className="w-3.5 h-3.5" /> Add Condition
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Beaker className="w-3.5 h-3.5" />
                <span>Would affect <span className="font-semibold text-foreground">{selected.affectedStudents} students</span></span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full text-xs gap-1">
                  <Beaker className="w-3.5 h-3.5" /> Test Rule
                </Button>
                <Button size="sm" className="rounded-full text-xs">Save Rule</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
