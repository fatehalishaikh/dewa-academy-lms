'use client'
import { useState } from 'react'
import { Upload, CheckCircle2, AlertTriangle, RefreshCw, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { importHistory } from '@/data/mock-ilp'
import { useAcademyStore } from '@/stores/academy-store'

const fieldOptions = [
  'Student ID', 'Full Name', 'Grade Level', 'Class / Section',
  'Current GPA', 'Attendance Rate', 'Email', 'Date of Birth', 'Enrolled Courses',
]

const importStatusStyle: Record<string, string> = {
  Success: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Partial: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  Failed: 'bg-destructive/10 text-destructive border-destructive/20',
}

export default function DataConnection() {
  const { ilpSettings, updateFieldMappings } = useAcademyStore()
  const fieldMappings = ilpSettings.fieldMappings
  const [mappingsSaved, setMappingsSaved] = useState(false)

  function handleApplyMapping() {
    updateFieldMappings(fieldMappings)
    setMappingsSaved(true)
    setTimeout(() => setMappingsSaved(false), 2000)
  }

  function handleReset() {
    updateFieldMappings(fieldMappings.map(m => ({ ...m, status: 'unmapped' as const })))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Import card */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-semibold">Import Student Data</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
                248 records
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Connect your SIS export to the AI personalization engine</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload zone */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-3 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Drop CSV file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-0.5">Supports .csv, .xlsx — max 10 MB</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => {
                // Simulate file browse — show confirmation in badge
                setMappingsSaved(false)
              }}>Browse Files</Button>
            </div>

            <Separator />

            {/* Uploaded file row */}
            <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/40">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">students_2026.csv</p>
                <p className="text-[10px] text-muted-foreground">128 KB · Uploaded Mar 24, 2026</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-chart-4 shrink-0" />
              <Button size="sm" variant="ghost" className="text-xs text-muted-foreground h-7 px-2">Remove</Button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Sync frequency</p>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-32 h-8 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Field mapping card */}
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-semibold">Field Mapping</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-chart-5/10 text-chart-5 border-chart-5/20">
                  1 Unmapped
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Map CSV columns to student profile fields</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-[11px] h-8">Source Column</TableHead>
                    <TableHead className="text-[11px] h-8">Maps To</TableHead>
                    <TableHead className="text-[11px] h-8 w-16 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldMappings.map(fm => (
                    <TableRow key={fm.source} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-mono text-muted-foreground py-2">{fm.source}</TableCell>
                      <TableCell className="py-2">
                        {fm.status === 'unmapped' ? (
                          <Select>
                            <SelectTrigger className="h-7 text-xs rounded-lg border-chart-5/30 bg-chart-5/5">
                              <SelectValue placeholder="Select field…" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldOptions.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-xs text-foreground">{fm.mapsTo}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-2">
                        {fm.status === 'unmapped'
                          ? <AlertTriangle className="w-3.5 h-3.5 text-chart-5 mx-auto" />
                          : <CheckCircle2 className="w-3.5 h-3.5 text-chart-4 mx-auto" />
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="rounded-full flex-1 text-xs gap-1.5" onClick={handleApplyMapping}>
                {mappingsSaved && <CheckCircle2 className="w-3.5 h-3.5" />}
                {mappingsSaved ? 'Mapping Applied' : 'Apply Mapping'}
              </Button>
              <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={handleReset}>Reset</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent imports */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Recent Imports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] h-8">Date</TableHead>
                  <TableHead className="text-[11px] h-8">Records</TableHead>
                  <TableHead className="text-[11px] h-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importHistory.map(imp => (
                  <TableRow key={imp.date} className="hover:bg-muted/20">
                    <TableCell className="text-xs py-2">{imp.date}</TableCell>
                    <TableCell className="text-xs py-2">{imp.records.toLocaleString()}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={`text-[10px] ${importStatusStyle[imp.status]}`}>
                        {imp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
