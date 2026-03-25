import { Link, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Play, Settings } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { integrations } from '@/data/mock-registration'

function StatusIcon({ status }: { status: 'Healthy' | 'Warning' | 'Error' }) {
  if (status === 'Healthy') return <CheckCircle2 className="w-4 h-4 text-green-400" />
  if (status === 'Warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />
  return <XCircle className="w-4 h-4 text-red-400" />
}

function statusBadge(status: 'Healthy' | 'Warning' | 'Error') {
  if (status === 'Healthy') return 'bg-green-500/10 text-green-400 border-green-500/20'
  if (status === 'Warning') return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  return 'bg-red-500/10 text-red-400 border-red-500/20'
}

function syncStatusColor(s: string) {
  if (s === 'Success') return 'text-green-400'
  if (s === 'Partial') return 'text-amber-400'
  return 'text-red-400'
}

function mappingBadge(status: string) {
  if (status === 'mapped') return 'bg-green-500/10 text-green-400 border-green-500/20'
  if (status === 'auto') return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  return 'bg-red-500/10 text-red-400 border-red-500/20'
}

// Sync volume chart data
const syncVolumeData = Array.from({ length: 14 }, (_, i) => ({
  day: `Mar ${12 + i}`,
  records: Math.floor(Math.random() * 40) + 5,
}))

export function Integrations() {
  return (
    <div className="space-y-6">
      {/* Integration status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map(intg => (
          <Card key={intg.system} className={`border ${intg.connectionStatus === 'Healthy' ? 'border-green-500/20' : intg.connectionStatus === 'Warning' ? 'border-amber-500/20' : 'border-red-500/20'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon status={intg.connectionStatus} />
                  <CardTitle className="text-base font-bold">{intg.system}</CardTitle>
                </div>
                <Badge variant="outline" className={`text-[9px] ${statusBadge(intg.connectionStatus)}`}>{intg.connectionStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 rounded-lg px-2.5 py-2 text-center">
                  <p className="text-lg font-bold text-foreground">{intg.recordsSynced.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">Records Synced</p>
                </div>
                <div className="bg-muted/30 rounded-lg px-2.5 py-2 text-center">
                  <p className="text-xs font-medium text-foreground truncate">{intg.lastSync.split(' ')[1]}</p>
                  <p className="text-[9px] text-muted-foreground">Last Sync</p>
                  <p className="text-[9px] text-muted-foreground">{intg.lastSync.split(' ')[0]}</p>
                </div>
              </div>

              {/* Sync history mini bar */}
              <div>
                <p className="text-[10px] text-muted-foreground mb-1.5">Recent Syncs (5 days)</p>
                <div className="flex gap-1">
                  {intg.syncHistory.map((h, i) => (
                    <div key={i} className="flex-1 space-y-1">
                      <div
                        className="rounded-sm flex items-center justify-center"
                        style={{
                          height: 24,
                          background: h.syncStatus === 'Success' ? 'rgba(76,175,80,0.2)'
                            : h.syncStatus === 'Partial' ? 'rgba(255,193,7,0.2)'
                            : 'rgba(239,68,68,0.2)'
                        }}
                        title={`${h.date}: ${h.syncStatus} (${h.records} records)`}
                      >
                        <span className="text-[8px] font-bold" style={{
                          color: h.syncStatus === 'Success' ? '#4CAF50'
                            : h.syncStatus === 'Partial' ? '#FFC107'
                            : '#EF4444'
                        }}>
                          {h.records > 0 ? h.records : '—'}
                        </span>
                      </div>
                      <p className="text-[7px] text-muted-foreground text-center truncate">{h.date.slice(5)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7 gap-1">
                  <RefreshCw className="w-3 h-3" />Sync
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7 gap-1">
                  <Play className="w-3 h-3" />Test
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Field mappings + sync chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Field mappings */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Field Mappings — SIS</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Source fields mapped to SIS target fields</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Source Field</th>
                    <th className="text-left pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Maps To</th>
                    <th className="text-right pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {integrations[0].fieldMappings.map(m => (
                    <tr key={m.source}>
                      <td className="py-2 font-mono text-[10px] text-muted-foreground">{m.source}</td>
                      <td className="py-2 font-mono text-[10px] text-foreground">{m.mapsTo}</td>
                      <td className="py-2 text-right">
                        <Badge variant="outline" className={`text-[8px] capitalize ${mappingBadge(m.mappingStatus)}`}>{m.mappingStatus}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 text-xs h-7 gap-1">
              <Settings className="w-3 h-3" />Manage All Mappings
            </Button>
          </CardContent>
        </Card>

        {/* Sync volume chart */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Sync Volume — Last 14 Days</CardTitle>
            <p className="text-xs text-muted-foreground">Records synced across all integrations</p>
          </CardHeader>
          <CardContent>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={syncVolumeData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regSyncGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B8A9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00B8A9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} interval={1} />
                  <YAxis tick={{ fontSize: 9, fill: '#8B9BB4' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a2332', border: '1px solid #2d4057', borderRadius: 8, fontSize: 11, padding: '8px 12px' }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                    itemStyle={{ color: '#cbd5e1' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="records" stroke="#00B8A9" strokeWidth={2} fill="url(#regSyncGrad)" name="Records" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Error log */}
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Recent Issues</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 bg-red-500/8 border border-red-500/20 rounded-lg px-2.5 py-2">
                  <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-medium text-red-400">SAP HCM — Connection timeout</p>
                    <p className="text-[9px] text-muted-foreground">2026-03-25 02:00 · 0 records synced</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-2.5 py-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-medium text-amber-400">Qudurat — Partial sync (field mapping warning)</p>
                    <p className="text-[9px] text-muted-foreground">2026-03-25 06:00 · 8/12 records synced</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full sync history table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Sync History — All Systems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['System', 'Date', 'Records', 'Duration', 'Status'].map(h => (
                    <th key={h} className="text-left pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {integrations.flatMap(intg =>
                  intg.syncHistory.map((h, i) => (
                    <tr key={`${intg.system}-${i}`} className="hover:bg-muted/10 transition-colors">
                      <td className="py-2 pr-4 font-semibold text-foreground">{intg.system}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{h.date}</td>
                      <td className="py-2 pr-4 text-foreground">{h.records > 0 ? h.records : '—'}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{h.duration}</td>
                      <td className="py-2">
                        <span className={`font-semibold ${syncStatusColor(h.syncStatus)}`}>{h.syncStatus}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
