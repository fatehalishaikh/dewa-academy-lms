'use client'
import { useState, useMemo } from 'react'
import { FolderOpen, Search, Upload, MoreHorizontal, CheckCircle2, X } from 'lucide-react'
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

type ContentItem = typeof contentItems[0]

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

const PAGE_SIZE = 5

export default function ContentManagement() {
  const [items, setItems] = useState<ContentItem[]>(contentItems)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all-subjects')
  const [typeFilter, setTypeFilter] = useState('all-types')
  const [levelFilter, setLevelFilter] = useState('all-levels')
  const [page, setPage] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null)

  const filtered = useMemo(() => items.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    if (subjectFilter !== 'all-subjects' && item.subject.toLowerCase() !== subjectFilter) return false
    if (typeFilter !== 'all-types' && item.type !== typeFilter) return false
    if (levelFilter !== 'all-levels' && item.level !== levelFilter) return false
    return true
  }), [items, search, subjectFilter, typeFilter, levelFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleFilterChange(setter: (v: string) => void) {
    return (v: string | null) => { if (v) { setter(v); setPage(0) } }
  }

  function handleUpload() {
    setUploadSuccess(true)
    const newItem: ContentItem = {
      id: String(items.length + 1),
      title: 'Uploaded Content — ' + new Date().toLocaleDateString(),
      type: 'Document',
      subject: 'General',
      level: 'Core',
      tags: ['uploaded'],
      status: 'Processing',
    }
    setItems(prev => [newItem, ...prev])
    setTimeout(() => setUploadSuccess(false), 2500)
  }

  function handleArchive(id: string) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'Archived' as const } : item
    ))
  }

  function handlePublish(id: string) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'Published' as const } : item
    ))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Content Management</h2>
          <p className="text-xs text-muted-foreground">Upload curriculum materials to the AI content pipeline</p>
        </div>
        <Button size="sm" className="rounded-full text-xs gap-1.5" onClick={handleUpload}>
          {uploadSuccess ? <><CheckCircle2 className="w-3.5 h-3.5" />Uploaded!</> : <><Upload className="w-3.5 h-3.5" />Upload Content</>}
        </Button>
      </div>

      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:border-primary/40 transition-colors cursor-pointer bg-card"
        onClick={handleUpload}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Drop files here to upload curriculum materials</p>
          <p className="text-xs text-muted-foreground mt-0.5">Supports PDF, DOCX, PPTX, MP4, SCORM packages</p>
          <p className="text-[11px] text-primary mt-1">AI will automatically convert materials into bite-sized learning modules</p>
        </div>
        {uploadSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-chart-4 bg-chart-4/10 border border-chart-4/20 rounded-lg px-3 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />File queued for AI processing
          </div>
        )}
      </div>

      {/* Content table */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0) }}
                placeholder="Search content…"
                className="pl-8 h-8 text-xs rounded-lg"
              />
            </div>
            <Select value={subjectFilter} onValueChange={handleFilterChange(setSubjectFilter)}>
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
            <Select value={typeFilter} onValueChange={handleFilterChange(setTypeFilter)}>
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
            <Select value={levelFilter} onValueChange={handleFilterChange(setLevelFilter)}>
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
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-8">
                      No content matches the current filters
                    </TableCell>
                  </TableRow>
                ) : paged.map(item => {
                  const levelColor = stageColors[item.level] ?? '#8B9BB4'
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium py-2.5 max-w-48 truncate">{item.title}</TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className={`text-[11px] ${typeStyles[item.type]}`}>{item.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-2.5">{item.subject}</TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className="text-[11px]"
                          style={{ color: levelColor, borderColor: `${levelColor}30`, background: `${levelColor}10` }}>
                          {item.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="text-[11px] text-muted-foreground">+{item.tags.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className={`text-[11px] ${statusStyles[item.status]}`}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="text-xs" onClick={() => setPreviewItem(item)}>Preview</DropdownMenuItem>
                            {item.status === 'Draft' && (
                              <DropdownMenuItem className="text-xs" onClick={() => handlePublish(item.id)}>Publish</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs text-destructive" onClick={() => handleArchive(item.id)}>Archive</DropdownMenuItem>
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
            <p className="text-xs text-muted-foreground">
              {filtered.length === 0 ? 'No items' : `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length} items`}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full text-xs h-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button size="sm" variant="outline" className="rounded-full text-xs h-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPreviewItem(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md mx-4 p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Content Preview</h3>
              <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => setPreviewItem(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <div className="h-32 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">{previewItem.title}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={`text-[11px] ${typeStyles[previewItem.type]}`}>{previewItem.type}</Badge>
                  <Badge variant="outline" className={`text-[11px] ${statusStyles[previewItem.status]}`}>{previewItem.status}</Badge>
                  <Badge variant="outline" className="text-[11px]">{previewItem.subject}</Badge>
                  <Badge variant="outline" className="text-[11px]">{previewItem.level}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {previewItem.tags.map(tag => (
                    <span key={tag} className="text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-full text-xs rounded-full" onClick={() => setPreviewItem(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
