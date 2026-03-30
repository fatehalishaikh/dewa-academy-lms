import { Link, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddContextButton } from './add-context-button'
import { integrations } from '@/data/mock-registration'

function StatusIcon({ status }: { status: 'Healthy' | 'Warning' | 'Error' }) {
  if (status === 'Healthy') return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
  if (status === 'Warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
  return <XCircle className="w-3.5 h-3.5 text-red-400" />
}

function statusBadge(status: 'Healthy' | 'Warning' | 'Error') {
  if (status === 'Healthy') return 'bg-green-500/10 text-green-400 border-green-500/20'
  if (status === 'Warning') return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  return 'bg-red-500/10 text-red-400 border-red-500/20'
}

export function RegIntegrationWidget() {
  return (
    <Card className="col-span-1 lg:col-span-2 rounded-2xl border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Integration Sync Status</CardTitle>
          </div>
          <AddContextButton
            id="reg-integration"
            entry={{ label: 'Integration Status', summary: 'SIS: Healthy (1,842 synced). Qudurat: Warning — partial sync issue. SAP HCM: Error — disconnected since Mar 23.' }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">SIS · Qudurat · SAP HCM — real-time sync health</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {integrations.map(({ system, connectionStatus, lastSync, recordsSynced, syncHistory }) => {
            const successCount = syncHistory.filter(h => h.syncStatus === 'Success').length
            return (
              <div key={system} className="bg-muted/30 rounded-xl p-3 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={connectionStatus} />
                    <span className="text-sm font-semibold text-foreground">{system}</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${statusBadge(connectionStatus)}`}>{connectionStatus}</Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-base font-bold text-foreground">{recordsSynced.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Records Synced</p>
                  </div>
                  <div className="bg-background/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-base font-bold text-green-400">{successCount}/{syncHistory.length}</p>
                    <p className="text-[9px] text-muted-foreground">Success Rate</p>
                  </div>
                </div>

                {/* Last sync + mini history */}
                <div>
                  <p className="text-[9px] text-muted-foreground mb-1.5">Last sync: {lastSync}</p>
                  <div className="flex gap-1">
                    {syncHistory.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm h-5 flex items-center justify-center"
                        style={{
                          background: h.syncStatus === 'Success' ? 'rgba(76,175,80,0.2)'
                            : h.syncStatus === 'Partial' ? 'rgba(255,193,7,0.2)'
                            : 'rgba(239,68,68,0.2)'
                        }}
                        title={`${h.date}: ${h.syncStatus}`}
                      >
                        <span className="text-[7px] font-bold" style={{
                          color: h.syncStatus === 'Success' ? '#4CAF50'
                            : h.syncStatus === 'Partial' ? '#FFC107'
                            : '#EF4444'
                        }}>
                          {h.syncStatus[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-1.5 text-[10px] text-primary hover:text-primary/80 transition-colors py-1 rounded-lg hover:bg-primary/5">
                  <RefreshCw className="w-3 h-3" />
                  Sync Now
                </button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
