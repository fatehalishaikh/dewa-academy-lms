'use client'
import { useState } from 'react'
import { CheckCircle2, CreditCard, FileUp, ClipboardList, Sparkles, ArrowRight, ArrowLeft, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

const STEPS = [
  { label: 'Emirates ID', icon: CreditCard },
  { label: 'Application Details', icon: ClipboardList },
  { label: 'Document Upload', icon: FileUp },
  { label: 'Review & Submit', icon: CheckCircle2 },
]

// ─── Step 1: Emirates ID ──────────────────────────────────────────────────────

const extractedId = {
  fullNameEn: 'Mohammed Al Hamdan',
  fullNameAr: 'محمد الحمدان',
  idNumber: '784-2010-4567890-1',
  nationality: 'UAE',
  dob: '05/11/2010',
  gender: 'Male',
  expiryDate: '15/09/2028',
  overallConfidence: 98,
}

function Step1({ onNext }: { onNext: () => void }) {
  const [scanned, setScanned] = useState(false)
  const [scanning, setScanning] = useState(false)

  function handleScan() {
    setScanning(true)
    setTimeout(() => { setScanning(false); setScanned(true) }, 1800)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Emirates ID Scan</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Upload the applicant's Emirates ID to auto-extract personal details via AI OCR</p>
      </div>

      {!scanned ? (
        <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center gap-4 hover:border-primary/40 transition-colors cursor-pointer" onClick={handleScan}>
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            {scanning
              ? <Sparkles className="w-7 h-7 text-primary animate-pulse" />
              : <Upload className="w-7 h-7 text-primary" />
            }
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{scanning ? 'Extracting data…' : 'Upload Emirates ID'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {scanning ? 'AI OCR is reading the card fields' : 'Front and back — JPG, PNG, PDF · Max 5MB'}
            </p>
          </div>
          {scanning && (
            <div className="w-full max-w-xs">
              <Progress value={75} className="h-1.5 animate-pulse" />
            </div>
          )}
          {!scanning && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs gap-1.5" onClick={e => { e.stopPropagation(); handleScan() }}>
              <Upload className="w-3.5 h-3.5" />
              Choose File
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Success banner */}
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-green-400">Emirates ID extracted successfully</p>
              <p className="text-[10px] text-green-400/70">ICP UAE verification • Overall confidence: {extractedId.overallConfidence}%</p>
            </div>
            <Badge className="text-[10px] bg-green-500/15 text-green-400 border-green-500/20 border">AI Verified</Badge>
          </div>

          {/* Extracted fields */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Extracted Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name (English)', value: extractedId.fullNameEn, conf: 99 },
                  { label: 'Full Name (Arabic)', value: extractedId.fullNameAr, conf: 97 },
                  { label: 'Emirates ID Number', value: extractedId.idNumber, conf: 98 },
                  { label: 'Nationality', value: extractedId.nationality, conf: 100 },
                  { label: 'Date of Birth', value: extractedId.dob, conf: 97 },
                  { label: 'Gender', value: extractedId.gender, conf: 100 },
                  { label: 'ID Expiry Date', value: extractedId.expiryDate, conf: 99 },
                ].map(({ label, value, conf }) => (
                  <div key={label} className="bg-card rounded-lg px-3 py-2 space-y-0.5">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-medium text-foreground">{value}</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                      <span className="text-[9px] text-green-400">{conf}% confidence</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4 text-xs w-full gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                <Sparkles className="w-3.5 h-3.5" />
                Verify with UAE PASS
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!scanned} className="gap-1.5 bg-primary hover:bg-primary/90">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Step 2: Application Details ──────────────────────────────────────────────

function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [appType, setAppType] = useState<string | null>(null)

  const types = [
    { id: 'Regular', label: 'Regular Admission', desc: 'Standard academic enrollment' },
    { id: 'Transfer', label: 'Transfer', desc: 'From another school or institution' },
    { id: 'International', label: 'International', desc: 'From an international curriculum' },
    { id: 'Special Program', label: 'Special Program', desc: 'STEM, Arts, or gifted programs' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Application Details</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Select admission route and complete applicant information</p>
      </div>

      {/* Application type selector */}
      <div>
        <Label className="text-xs font-semibold mb-2 block">Admission Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => setAppType(t.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                appType === t.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5'
              }`}
            >
              <p className="text-xs font-semibold">{t.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Common fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="grade" className="text-xs">Grade Applying For</Label>
          <Input id="grade" placeholder="e.g. Grade 9" className="text-xs h-8" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="year" className="text-xs">Academic Year</Label>
          <Input id="year" defaultValue="2026–2027" className="text-xs h-8" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guardian" className="text-xs">Guardian Name</Label>
          <Input id="guardian" placeholder="Full name" className="text-xs h-8" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs">Guardian Phone</Label>
          <Input id="phone" placeholder="+971 5X XXX XXXX" className="text-xs h-8" />
        </div>
      </div>

      {/* Conditional: Transfer */}
      {appType === 'Transfer' && (
        <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-amber-400">Transfer-Specific Information</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">Previous School</Label>
              <Input placeholder="School name" className="text-xs h-8" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">Reason for Transfer</Label>
              <Input placeholder="Briefly describe" className="text-xs h-8" />
            </div>
          </div>
        </div>
      )}

      {/* Conditional: International */}
      {appType === 'International' && (
        <div className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-purple-400">International Student Information</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Country of Origin</Label>
              <Input placeholder="Country" className="text-xs h-8" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Previous Curriculum</Label>
              <Input placeholder="e.g. British, IB, CBSE" className="text-xs h-8" />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5 text-xs"><ArrowLeft className="w-4 h-4" />Back</Button>
        <Button onClick={onNext} disabled={!appType} className="gap-1.5 bg-primary hover:bg-primary/90">Continue <ArrowRight className="w-4 h-4" /></Button>
      </div>
    </div>
  )
}

// ─── Step 3: Document Upload ──────────────────────────────────────────────────

const DOCS = [
  { name: 'Emirates ID', required: true, note: 'Pre-filled from Step 1', done: true },
  { name: 'Passport', required: true, note: 'All pages', done: false },
  { name: 'Birth Certificate', required: true, note: 'Attested copy', done: false },
  { name: 'Academic Transcript', required: true, note: 'Last 2 years', done: false },
  { name: 'Medical Records', required: false, note: 'Optional', done: false },
  { name: 'Guardian ID', required: true, note: 'Emirates ID or Passport', done: false },
]

function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({ 'Emirates ID': true })
  const [processing, setProcessing] = useState<Record<string, boolean>>({})
  const [confidence, setConfidence] = useState<Record<string, number>>({})

  function handleUpload(docName: string) {
    setProcessing(p => ({ ...p, [docName]: true }))
    setTimeout(() => {
      const conf = 85 + Math.floor(Math.random() * 14)
      setProcessing(p => ({ ...p, [docName]: false }))
      setUploaded(u => ({ ...u, [docName]: true }))
      setConfidence(c => ({ ...c, [docName]: conf }))
    }, 1500)
  }

  const done = Object.keys(uploaded).length
  const total = DOCS.length
  const pct = Math.round((done / total) * 100)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Document Upload</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Upload required documents — AI will extract and verify each one</p>
      </div>

      {/* Overall progress */}
      <div className="bg-card border border-border rounded-xl px-4 py-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Upload Progress</span>
          <span className="font-semibold text-foreground">{done}/{total} documents</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {DOCS.map(({ name, required, note }) => {
          const isUploaded = uploaded[name]
          const isProcessing = processing[name]
          const conf = confidence[name]

          return (
            <div key={name} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
              isUploaded ? 'border-green-500/20 bg-green-500/5' : 'border-border bg-card'
            }`}>
              <div className="shrink-0">
                {isProcessing
                  ? <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  : isUploaded
                  ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                  : <Upload className="w-4 h-4 text-muted-foreground" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{name}</span>
                  {required && <Badge variant="outline" className="text-[9px] px-1.5 py-0">Required</Badge>}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {isProcessing ? 'AI extracting fields…'
                    : isUploaded && conf ? `Verified · ${conf}% confidence`
                    : isUploaded ? 'Pre-filled from Emirates ID scan'
                    : note}
                </p>
              </div>
              {!isUploaded && !isProcessing && (
                <Button size="sm" variant="outline" onClick={() => handleUpload(name)} className="text-xs h-7 shrink-0">
                  Upload
                </Button>
              )}
              {isUploaded && conf && (
                <span className="text-[10px] text-green-400 font-semibold shrink-0">{conf}%</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5 text-xs"><ArrowLeft className="w-4 h-4" />Back</Button>
        <Button onClick={onNext} className="gap-1.5 bg-primary hover:bg-primary/90">Review & Submit <ArrowRight className="w-4 h-4" /></Button>
      </div>
    </div>
  )
}

// ─── Step 4: Review & Submit ──────────────────────────────────────────────────

function Step4({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Review & Submit</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Confirm all information before submitting the application</p>
      </div>

      {/* AI pre-score banner */}
      <div className="bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary">Estimated AI Eligibility Score</p>
          <p className="text-[10px] text-muted-foreground">Based on submitted documents and Emirates ID data</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">87</p>
          <p className="text-[9px] text-green-400">Likely: Admit</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Name: </span><span className="font-medium">Mohammed Al Hamdan</span></div>
              <div><span className="text-muted-foreground">Emirates ID: </span><span className="font-medium">784-2010-4567890-1</span></div>
              <div><span className="text-muted-foreground">DOB: </span><span className="font-medium">05/11/2010</span></div>
              <div><span className="text-muted-foreground">Gender: </span><span className="font-medium">Male</span></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Type: </span><span className="font-medium">Regular Admission</span></div>
              <div><span className="text-muted-foreground">Grade: </span><span className="font-medium">Grade 9</span></div>
              <div><span className="text-muted-foreground">Academic Year: </span><span className="font-medium">2026–2027</span></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Emirates ID', 'Passport', 'Birth Certificate', 'Academic Transcript'].map(d => (
                <Badge key={d} variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />{d}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5 text-xs"><ArrowLeft className="w-4 h-4" />Back</Button>
        <Button onClick={onSubmit} className="gap-1.5 bg-primary hover:bg-primary/90">Submit Application</Button>
      </div>
    </div>
  )
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-5">
      <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-green-400" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">Application Submitted!</h2>
        <p className="text-sm text-muted-foreground mt-1">The application has entered the registration pipeline.</p>
        <p className="text-xs text-muted-foreground mt-1">Reference: <span className="font-mono text-primary">APP-2026-020</span></p>
      </div>
      <div className="flex items-center gap-3 bg-primary/8 border border-primary/20 rounded-xl px-6 py-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <p className="text-xs text-muted-foreground">AI scoring will be completed within 24 hours.</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="text-xs" onClick={onNew}>Start New Application</Button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function NewApplication() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) return <SuccessScreen onNew={() => { setStep(0); setSubmitted(false) }} />

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                i < step ? 'bg-primary text-white'
                : i === step ? 'bg-primary/20 border-2 border-primary text-primary'
                : 'bg-muted border-2 border-border text-muted-foreground'
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-[9px] font-medium whitespace-nowrap ${i === step ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card className="border-border">
        <CardContent className="pt-6">
          {step === 0 && <Step1 onNext={() => setStep(1)} />}
          {step === 1 && <Step2 onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <Step3 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step4 onBack={() => setStep(2)} onSubmit={() => setSubmitted(true)} />}
        </CardContent>
      </Card>
    </div>
  )
}
