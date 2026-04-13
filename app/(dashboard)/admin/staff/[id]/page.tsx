'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Mail, Phone, Briefcase, Star, Clock, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getStaffById } from '@/data/mock-staff'

export default function AdminStaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const member = getStaffById(id)

  if (!member) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20 space-y-3">
        <p className="text-sm text-muted-foreground">Staff member not found.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => router.push('/admin/staff')}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        All Staff
      </button>

      {/* Identity card */}
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <Avatar className="w-16 h-16 shrink-0">
              <AvatarFallback className="text-xl font-bold text-white" style={{ background: member.avatarColor }}>
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h1 className="text-xl font-bold text-foreground">{member.name}</h1>
                <p className="text-sm text-muted-foreground">{member.qualification}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">{member.role}</Badge>
                <Badge variant="outline" className="text-[10px] h-5 border-border text-muted-foreground">{member.department}</Badge>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Role', value: member.role, color: '#00B8A9', icon: User },
          { label: 'Department', value: member.department.split(' ')[0], color: '#8B5CF6', icon: Briefcase },
          { label: 'Experience', value: `${member.yearsExperience}y`, color: '#10B981', icon: Star },
          { label: 'Status', value: member.status === 'active' ? 'Active' : 'On Leave', color: member.status === 'active' ? '#10B981' : '#F59E0B', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact & details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Information</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Email</p>
                  <p className="text-xs text-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Phone</p>
                  <p className="text-xs text-foreground">{member.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Professional Details</p>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-muted-foreground">Qualification</p>
                <p className="text-xs text-foreground mt-0.5">{member.qualification}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Years of Experience</p>
                <p className="text-xs text-foreground mt-0.5">{member.yearsExperience} years</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
