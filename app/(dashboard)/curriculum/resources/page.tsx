'use client'
import { useState } from 'react'
import { Upload, Video, FileText, HelpCircle, Zap, Link2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { curriculumResources, curriculumNodes, type CurriculumResource, type ResourceType } from '@/data/mock-curriculum'

const TYPE_COLORS: Record<ResourceType, string> = {
  video:       'border-blue-500/30 text-blue-400 bg-blue-500/10',
  document:    'border-amber-500/30 text-amber-400 bg-amber-500/10',
  quiz:        'border-purple-500/30 text-purple-400 bg-purple-500/10',
  interactive: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
}

const TYPE_ICONS: Record<ResourceType, React.ElementType> = {
  video:       Video,
  document:    FileText,
  quiz:        HelpCircle,
  interactive: Zap,
}

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'English', 'Arabic', 'Science']
const TYPES: (ResourceType | 'All')[] = ['All', 'video', 'document', 'quiz', 'interactive']

export default function CurriculumResources() {
  const [resources, setResources] = useState<CurriculumResource[]>(curriculumResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'All'>('All')
  const [uploadingState, setUploadingState] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [linkingId, setLinkingId] = useState<string | null>(null)
  const [linkLesson, setLinkLesson] = useState('')
  const [linkFeedback, setLinkFeedback] = useState<string | null>(null)

  const lessons = curriculumNodes.filter(n => n.nodeType === 'lesson')

  const filtered = resources.filter(r => {
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (subjectFilter !== 'All' && r.subject !== subjectFilter) return false
    if (typeFilter !== 'All' && r.resourceType !== typeFilter) return false
    return true
  })

  function handleUploadDrop() {
    setUploadingState('uploading')
    setTimeout(() => {
      const newRes: CurriculumResource = {
        id: `res-${Date.now()}`,
        name: 'New Uploaded Resource',
        resourceType: 'document',
        subject: 'Mathematics',
        gradeLevel: 'Grade 10',
        uploadDate: new Date().toISOString().split('T')[0],
        linkedLessonIds: [],
      }
      setResources(prev => [...prev, newRes])
      setUploadingState('done')
      setTimeout(() => setUploadingState('idle'), 2000)
    }, 1500)
  }

  function handleLink(resourceId: string, lessonId: string) {
    setResources(prev => prev.map(r =>
      r.id === resourceId && !r.linkedLessonIds.includes(lessonId)
        ? { ...r, linkedLessonIds: [...r.linkedLessonIds, lessonId] }
        : r
    ))
    setLinkFeedback(resourceId)
    setLinkingId(null)
    setLinkLesson('')
    setTimeout(() => setLinkFeedback(null), 2000)
  }

  const countByType = (t: ResourceType) => resources.filter(r => r.resourceType === t).length

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {(['video', 'document', 'quiz', 'interactive'] as ResourceType[]).map(t => {
          const Icon = TYPE_ICONS[t]
          return (
            <Card key={t} className="rounded-2xl border-border">
              <CardContent className="p-3 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLORS[t]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{countByType(t)}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{t}s</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Upload area */}
      <Card
        className="rounded-2xl border-border border-dashed cursor-pointer hover:bg-muted/10 transition-colors"
        onClick={uploadingState === 'idle' ? handleUploadDrop : undefined}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
          {uploadingState === 'idle' && (
            <>
              <Upload className="w-6 h-6 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Click or drag to upload a resource</p>
              <p className="text-[10px] text-muted-foreground">PDF, DOCX, MP4, PPTX supported</p>
            </>
          )}
          {uploadingState === 'uploading' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Uploading…
            </div>
          )}
          {uploadingState === 'done' && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Upload complete!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search resources…"
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50 w-48"
        />
        <select
          value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
        >
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as ResourceType | 'All')}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
        >
          {TYPES.map(t => <option key={t} className="capitalize">{t}</option>)}
        </select>
        <span className="text-[10px] text-muted-foreground ml-1">{filtered.length} resources</span>
      </div>

      {/* Resource table */}
      <Card className="rounded-2xl border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Resource</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Subject</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Grade</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Uploaded</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Links</th>
                <th className="w-28" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(resource => {
                const Icon = TYPE_ICONS[resource.resourceType]
                const isLinking = linkingId === resource.id
                return (
                  <tr key={resource.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${TYPE_COLORS[resource.resourceType]}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{resource.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant="outline" className={`text-[9px] capitalize ${TYPE_COLORS[resource.resourceType]}`}>
                        {resource.resourceType}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs text-muted-foreground">{resource.subject}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs text-muted-foreground">{resource.gradeLevel}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(resource.uploadDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs font-medium text-foreground">{resource.linkedLessonIds.length}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {linkFeedback === resource.id ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-center">
                          <CheckCircle2 className="w-3 h-3" /> Linked
                        </span>
                      ) : isLinking ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={linkLesson}
                            onChange={e => setLinkLesson(e.target.value)}
                            className="bg-background border border-border rounded-lg px-1.5 py-1 text-[10px] focus:outline-none focus:border-primary/50 max-w-[100px]"
                          >
                            <option value="">Pick lesson…</option>
                            {lessons.map(l => <option key={l.id} value={l.id}>{l.title.slice(0, 25)}…</option>)}
                          </select>
                          <Button
                            size="sm"
                            className="h-5 text-[9px] px-2"
                            onClick={() => linkLesson && handleLink(resource.id, linkLesson)}
                            disabled={!linkLesson}
                          >Go</Button>
                          <Button size="sm" variant="outline" className="h-5 text-[9px] px-2" onClick={() => setLinkingId(null)}>✕</Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLinkingId(resource.id)}
                          className="h-6 text-[10px] gap-1"
                        >
                          <Link2 className="w-2.5 h-2.5" /> Link
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">No resources match filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
