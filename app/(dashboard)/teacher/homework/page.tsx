'use client'
import { Plus, ArrowRight, Clock, CheckCircle2, AlertCircle, FileText, GraduationCap, TrendingUp, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useHomeworkStore } from '@/stores/homework-store'
import { useCurrentTeacher } from '@/stores/role-store'
import { getClassById } from '@/data/mock-classes'
import { useState } from 'react'

const statusConfig = {
  published: { label: 'Published', color: '#007560', bg: 'bg-[#007560]/10', border: 'border-[#007560]/30', text: 'text-[#007560]' },
  draft: { label: 'Draft', color: '#D4AF37', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/30', text: 'text-[#D4AF37]' },
  closed: { label: 'Closed', color: '#6B7280', bg: 'bg-muted/30', border: 'border-border', text: 'text-muted-foreground' },
}

export default function TeacherHomework() {
  const router = useRouter()
  const teacher = useCurrentTeacher()
  const { homework, getSubmissionsForHomework } = useHomeworkStore()
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'closed'>('all')

  const teacherHomework = homework.filter(h => h.teacherId === teacher?.id)
  const filteredHomework = filter === 'all' ? teacherHomework : teacherHomework.filter(h => h.status === filter)

  const pendingGrading = teacherHomework.reduce((sum, hw) => {
    const subs = getSubmissionsForHomework(hw.id)
    return sum + subs.filter(s => s.status === 'submitted' || s.status === 'late').length
  }, 0)

  const totalSubmissions = teacherHomework.reduce((sum, hw) => {
    const subs = getSubmissionsForHomework(hw.id)
    return sum + subs.filter(s => s.status !== 'not-submitted').length
  }, 0)

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#b8962e] to-[#8a7022] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#007560]/20 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white/70 uppercase tracking-wider">Assignment Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Homework</h1>
            <p className="text-white/70">
              {pendingGrading > 0 ? `${pendingGrading} submission${pendingGrading > 1 ? 's' : ''} awaiting grading` : 'All submissions graded'}
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/teacher/homework/create')} 
            className="bg-white text-[#8a7022] hover:bg-white/90 gap-2 self-start md:self-auto shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </div>
        
        {/* Stats inside hero */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total Assignments', value: teacherHomework.length, icon: FileText },
            { label: 'Published', value: teacherHomework.filter(h => h.status === 'published').length, icon: CheckCircle2 },
            { label: 'Pending Grading', value: pendingGrading, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(['all', 'published', 'draft', 'closed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-accent/50 text-muted-foreground hover:bg-accent'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({teacherHomework.filter(h => h.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHomework.map((hw) => {
          const cfg = statusConfig[hw.status]
          const cls = getClassById(hw.classId)
          const subs = getSubmissionsForHomework(hw.id)
          const submittedCount = subs.filter(s => s.status !== 'not-submitted').length
          const pendingCount = subs.filter(s => s.status === 'submitted' || s.status === 'late').length
          const gradedCount = subs.filter(s => s.status === 'graded').length
          const dueFormatted = new Date(hw.dueDate).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })
          const isPastDue = new Date(hw.dueDate) < new Date()

          return (
            <Card
              key={hw.id}
              className="group relative overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(`/teacher/homework/${hw.id}`)}
            >
              {/* Colored top border */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cfg.color }} />
              
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{hw.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{cls?.name ?? hw.classId} · {hw.totalPoints} points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`${cfg.bg} ${cfg.text} ${cfg.border} border`}>
                      {cfg.label}
                    </Badge>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className={`w-4 h-4 ${isPastDue ? 'text-destructive' : 'text-muted-foreground'}`} />
                      <span className={isPastDue ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                        Due {dueFormatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <span className="text-muted-foreground">{submittedCount}/{subs.length} submitted</span>
                    </div>
                    {pendingCount > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-warning font-medium">{pendingCount} to grade</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-success to-success/70 transition-all" 
                        style={{ width: `${subs.length > 0 ? (gradedCount / subs.length) * 100 : 0}%` }} 
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{gradedCount}/{subs.length} graded</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredHomework.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === 'all' ? 'No assignments yet' : `No ${filter} assignments`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' ? 'Create your first assignment to get started.' : `You don't have any ${filter} assignments.`}
              </p>
              <Button onClick={() => router.push('/teacher/homework/create')} className="gap-2">
                <Plus className="w-4 h-4" />
                New Assignment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
