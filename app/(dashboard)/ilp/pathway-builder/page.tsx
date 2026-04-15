'use client'
import { useState } from 'react'
import { GitBranch, ChevronRight, Plus, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { pathwayStageConfigs, advancementRules } from '@/data/mock-ilp'

const stageColors: Record<string, string> = {
  Assessment: '#8B9BB4',
  Foundation: '#EF4444',
  Core: '#3B82F6',
  Practice: '#FFC107',
  Mastery: '#00B8A9',
  Enrichment: '#4CAF50',
  Reflection: '#A855F7',
}

export default function PathwayBuilder() {
  const [saved, setSaved] = useState(false)

  function handleSavePipeline() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  return (
    <div className="space-y-5">
      {/* Pipeline visual */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-primary" />
              <CardTitle className="text-base font-semibold">Learning Lifecycle Pipeline</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ILP 2.2</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Configure the learning pathway stages students progress through</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex items-stretch gap-0 min-w-max pb-2">
              {pathwayStageConfigs.map((stage, i) => {
                const color = stageColors[stage.name] ?? '#00B8A9'
                return (
                  <div key={stage.id} className="flex items-center">
                    <div className="w-52 rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                      {/* Stage header */}
                      <div className="flex items-center justify-between">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                          style={{ background: color }}>
                          {stage.id}
                        </div>
                        <Badge variant="outline" className="text-[11px]"
                          style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
                          {stage.studentCount} students
                        </Badge>
                      </div>

                      {/* Name */}
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1 block">Stage Name</Label>
                        <Input defaultValue={stage.name} className="h-7 text-xs rounded-lg" />
                      </div>

                      {/* Description */}
                      <div>
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1 block">Description</Label>
                        <Textarea defaultValue={stage.description} className="text-xs rounded-lg min-h-[52px] resize-none" />
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2">
                        <Input defaultValue={stage.durationWeeks} type="number" className="h-7 text-xs rounded-lg w-12" />
                        <span className="text-xs text-muted-foreground">weeks</span>
                      </div>

                      {/* Criteria */}
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5">Criteria</p>
                        <ul className="space-y-1">
                          {stage.criteria.map((c, ci) => (
                            <li key={ci} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary mt-0.5 shrink-0">·</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Arrow connector */}
                    {i < pathwayStageConfigs.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground/40 shrink-0 mx-1" />
                    )}
                  </div>
                )
              })}
              {/* Add stage button */}
              <div className="flex items-center ml-2">
                <button className="w-12 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors flex items-center justify-center text-muted-foreground hover:text-primary">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advancement rules */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Advancement Criteria</CardTitle>
          <p className="text-xs text-muted-foreground">Define when and how students move between stages</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] h-8">From Stage</TableHead>
                  <TableHead className="text-[11px] h-8">To Stage</TableHead>
                  <TableHead className="text-[11px] h-8">Criteria</TableHead>
                  <TableHead className="text-[11px] h-8 text-center w-28">Auto-Advance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advancementRules.map((rule, i) => (
                  <TableRow key={i} className="hover:bg-muted/20">
                    <TableCell className="py-2">
                      <Badge variant="outline" className="text-[11px]"
                        style={{
                          color: stageColors[rule.from] ?? '#8B9BB4',
                          borderColor: `${stageColors[rule.from] ?? '#8B9BB4'}30`,
                          background: `${stageColors[rule.from] ?? '#8B9BB4'}10`,
                        }}>
                        {rule.from}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className="text-[11px]"
                        style={{
                          color: stageColors[rule.to] ?? '#8B9BB4',
                          borderColor: `${stageColors[rule.to] ?? '#8B9BB4'}30`,
                          background: `${stageColors[rule.to] ?? '#8B9BB4'}10`,
                        }}>
                        {rule.to}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-2">{rule.criteria}</TableCell>
                    <TableCell className="text-center py-2">
                      <Switch defaultChecked={rule.autoAdvance} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-3">
            <Button size="sm" className="rounded-full text-xs gap-1.5" onClick={handleSavePipeline}>
              {saved && <CheckCircle2 className="w-3.5 h-3.5" />}
              {saved ? 'Pipeline Saved' : 'Save Pipeline'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
