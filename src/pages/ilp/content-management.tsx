import { FolderOpen, Search, Upload, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { contentItems } from '@/data/mock-ilp'

const typeStyles: Record<string, string> = {
  Video: 'bg-primary/10 text-primary border-primary/20',
  Document: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  Interactive: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  Quiz: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
}

const statusStyles: Record<string, string> = {
  Published: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Draft: 'bg-muted text-muted-foreground border-border',
  Processing: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  Archived: 'bg-destructive/10 text-destructive border-destructive/20',
}

const stageColors: Record<string, string> = {
  Assessment: '#8B9BB4',
  Foundation: '#EF4444',
  Core: '#3B82F6',
  Practice: '#FFC107',
  Mastery: '#00B8A9',
  Enrichment: '#4CAF50',
  Reflection: '#A855F7',
}

export function ContentManagement() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Content Management</h2>
          <p className="text-xs text-muted-foreground">Upload curriculum materials to the AI content pipeline</p>
        </div>
        <Button size="sm" className="rounded-full text-xs gap-1.5">
          <Upload className="w-3.5 h-3.5" /> Upload Content
        </Button>
      </div>

      {/* Upload zone */}
      <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:border-primary/40 transition-colors cursor-pointer bg-card">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Drop files here to upload curriculum materials</p>
          <p className="text-xs text-muted-foreground mt-0.5">Supports PDF, DOCX, PPTX, MP4, SCORM packages</p>
          <p className="text-[11px] text-primary mt-1">AI will automatically convert materials into bite-sized learning modules</p>
        </div>
      </div>

      {/* Content table */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search content…" className="pl-8 h-8 text-xs rounded-lg" />
            </div>
            <Select defaultValue="all-subjects">
              <SelectTrigger className="h-8 text-xs rounded-lg w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-subjects">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-types">
              <SelectTrigger className="h-8 text-xs rounded-lg w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="Interactive">Interactive</SelectItem>
                <SelectItem value="Quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-levels">
              <SelectTrigger className="h-8 text-xs rounded-lg w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-levels">All Levels</SelectItem>
                <SelectItem value="Foundation">Foundation</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="Mastery">Mastery</SelectItem>
                <SelectItem value="Enrichment">Enrichment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] h-8">Title</TableHead>
                  <TableHead className="text-[11px] h-8">Type</TableHead>
                  <TableHead className="text-[11px] h-8">Subject</TableHead>
                  <TableHead className="text-[11px] h-8">Level</TableHead>
                  <TableHead className="text-[11px] h-8">Tags</TableHead>
                  <TableHead className="text-[11px] h-8">Status</TableHead>
                  <TableHead className="text-[11px] h-8 w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentItems.map(item => {
                  const levelColor = stageColors[item.level] ?? '#8B9BB4'
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium py-2.5 max-w-48 truncate">{item.title}</TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className={`text-[10px] ${typeStyles[item.type]}`}>{item.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-2.5">{item.subject}</TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className="text-[10px]"
                          style={{ color: levelColor, borderColor: `${levelColor}30`, background: `${levelColor}10` }}>
                          {item.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{item.tags.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className={`text-[10px] ${statusStyles[item.status]}`}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="text-xs">Preview</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">Edit Tags</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs text-destructive">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-muted-foreground">Showing 1–10 of 47 items</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full text-xs h-7" disabled>Previous</Button>
              <Button size="sm" variant="outline" className="rounded-full text-xs h-7">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
