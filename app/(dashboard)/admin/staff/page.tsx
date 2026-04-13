'use client'
import { useState } from 'react'
import { Search, Users, CheckCircle2, Clock, ArrowRight, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { staff } from '@/data/mock-staff'

const departments = ['All', ...Array.from(new Set(staff.map(s => s.department)))]

export default function AdminStaffPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')

  const filtered = staff
    .filter(s => dept === 'All' || s.department === dept)
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.role.toLowerCase().includes(query.toLowerCase()))

  const activeCount = staff.filter(s => s.status === 'active').length
  const onLeaveCount = staff.filter(s => s.status === 'on-leave').length

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Staff Management</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">All Staff</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{staff.length} staff members across {new Set(staff.map(s => s.department)).size} departments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Staff', value: staff.length, color: '#00B8A9', icon: Users },
          { label: 'Active', value: activeCount, color: '#10B981', icon: CheckCircle2 },
          { label: 'On Leave', value: onLeaveCount, color: '#F59E0B', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search staff…"
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                dept === d
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(member => (
          <Card
            key={member.id}
            className="rounded-2xl border-border hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => router.push(`/admin/staff/${member.id}`)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="text-sm font-semibold text-white" style={{ background: member.avatarColor }}>
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <Badge variant="outline" className="text-[10px] h-5 border-border text-muted-foreground">{member.role}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{member.department} · {member.email}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Badge
                  variant="outline"
                  className={`text-[10px] h-5 ${
                    member.status === 'active'
                      ? 'border-emerald-500/30 text-emerald-400'
                      : 'border-amber-500/30 text-amber-400'
                  }`}
                >
                  {member.status === 'active' ? 'Active' : 'On Leave'}
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{member.yearsExperience}y</p>
                  <p className="text-[10px] text-muted-foreground">Experience</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No staff members found.</div>
        )}
      </div>
    </div>
  )
}
