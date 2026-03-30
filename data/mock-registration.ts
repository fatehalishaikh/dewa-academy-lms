// ─── Types ───────────────────────────────────────────────────────────────────

export type ApplicationType = 'Regular' | 'Transfer' | 'International' | 'Special Program'

export type KanbanStage =
  | 'Application Submitted'
  | 'Emirates ID Verified'
  | 'Documents Under Review'
  | 'AI Scored'
  | 'Decision Made'
  | 'Enrolled'

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted'

export type VerificationStatus = 'Verified' | 'Pending' | 'Flagged' | 'Rejected'

export type FlagReason =
  | 'Incomplete Documents'
  | 'Suspicious Data'
  | 'Low Score'
  | 'Expired ID'
  | 'GPA Mismatch'

export type DocumentType =
  | 'Emirates ID'
  | 'Passport'
  | 'Birth Certificate'
  | 'Academic Transcript'
  | 'Medical Records'
  | 'Guardian ID'
  | 'Clearance Letter'

export type ChecklistItem = {
  document: DocumentType
  required: boolean
  completed: boolean
  flagged?: boolean
}

export type DocumentRecord = {
  type: DocumentType
  fileName: string
  uploadedDate: string
  verificationStatus: VerificationStatus
  ocrConfidence: number
  extractedFields: {
    field: string
    value: string
    confidence: number
    matchesApplication: boolean
  }[]
}

export type TimelineEvent = {
  stage: KanbanStage | string
  date: string
  actor: string
  note?: string
}

export type ScoringBreakdown = {
  academic: number
  qudurat: number
  attendance: number
  extracurricular: number
  interview: number
  overall: number
  recommendation: 'Admit' | 'Waitlist' | 'Reject'
  rationale: string
}

export type Application = {
  id: string
  initials: string
  nameEn: string
  nameAr: string
  emiratesId: string
  nationality: string
  dob: string
  gender: 'Male' | 'Female'
  applicationType: ApplicationType
  gradeApplying: string
  stage: KanbanStage
  status: ApplicationStatus
  submittedDate: string
  flagged: boolean
  flagReasons: FlagReason[]
  assignedReviewer: string | null
  reviewerInitials: string | null
  aiScore: number | null
  checklist: ChecklistItem[]
  documents: DocumentRecord[]
  timeline: TimelineEvent[]
  scoring: ScoringBreakdown | null
}

export type IntegrationFieldMapping = {
  source: string
  mapsTo: string
  mappingStatus: 'mapped' | 'auto' | 'unmapped'
}

export type SyncHistoryEntry = {
  date: string
  records: number
  syncStatus: 'Success' | 'Partial' | 'Failed'
  duration: string
}

export type IntegrationStatus = {
  system: 'SIS' | 'Qudurat' | 'SAP HCM'
  connected: boolean
  connectionStatus: 'Healthy' | 'Warning' | 'Error'
  lastSync: string
  recordsSynced: number
  fieldMappings: IntegrationFieldMapping[]
  syncHistory: SyncHistoryEntry[]
}

export type NotificationRecord = {
  id: string
  recipientName: string
  channel: 'Email' | 'SMS' | 'Portal'
  subject: string
  sentDate: string
  deliveryStatus: 'Delivered' | 'Read' | 'Bounced' | 'Pending'
  templateId: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeChecklist(completed: number[], flagged: number[] = []): ChecklistItem[] {
  const docs: DocumentType[] = [
    'Emirates ID', 'Passport', 'Birth Certificate',
    'Academic Transcript', 'Medical Records', 'Guardian ID',
  ]
  return docs.map((doc, i) => ({
    document: doc,
    required: doc !== 'Medical Records',
    completed: completed.includes(i),
    flagged: flagged.includes(i),
  }))
}

// ─── Mock Applications ────────────────────────────────────────────────────────

export const mockApplications: Application[] = [
  // Stage 1: Application Submitted (3)
  {
    id: 'APP-2026-001',
    initials: 'SA',
    nameEn: 'Sara Al Mansoori',
    nameAr: 'سارة المنصوري',
    emiratesId: '784-2010-1234567-1',
    nationality: 'Emirati',
    dob: '2010-03-14',
    gender: 'Female',
    applicationType: 'Regular',
    gradeApplying: 'Grade 9',
    stage: 'Application Submitted',
    status: 'Pending',
    submittedDate: '2026-03-22',
    flagged: false,
    flagReasons: [],
    assignedReviewer: null,
    reviewerInitials: null,
    aiScore: null,
    checklist: makeChecklist([0]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-22', actor: 'Sara Al Mansoori', note: 'Online application received' },
    ],
    scoring: null,
  },
  {
    id: 'APP-2026-002',
    initials: 'KA',
    nameEn: 'Khalid Al Rashidi',
    nameAr: 'خالد الراشدي',
    emiratesId: '784-2009-2345678-3',
    nationality: 'Emirati',
    dob: '2009-07-22',
    gender: 'Male',
    applicationType: 'Transfer',
    gradeApplying: 'Grade 10',
    stage: 'Application Submitted',
    status: 'Pending',
    submittedDate: '2026-03-23',
    flagged: false,
    flagReasons: [],
    assignedReviewer: null,
    reviewerInitials: null,
    aiScore: null,
    checklist: makeChecklist([0, 1]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-23', actor: 'Khalid Al Rashidi', note: 'Transfer application received' },
    ],
    scoring: null,
  },
  {
    id: 'APP-2026-003',
    initials: 'NB',
    nameEn: 'Noura Binsaeed',
    nameAr: 'نورة بن سعيد',
    emiratesId: '784-2011-3456789-2',
    nationality: 'Emirati',
    dob: '2011-01-09',
    gender: 'Female',
    applicationType: 'Special Program',
    gradeApplying: 'Grade 8',
    stage: 'Application Submitted',
    status: 'Pending',
    submittedDate: '2026-03-24',
    flagged: false,
    flagReasons: [],
    assignedReviewer: null,
    reviewerInitials: null,
    aiScore: null,
    checklist: makeChecklist([0, 1, 2]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-24', actor: 'Noura Binsaeed', note: 'Special program application' },
    ],
    scoring: null,
  },

  // Stage 2: Emirates ID Verified (2)
  {
    id: 'APP-2026-004',
    initials: 'MA',
    nameEn: 'Mohammed Al Hamdan',
    nameAr: 'محمد الحمدان',
    emiratesId: '784-2010-4567890-1',
    nationality: 'Emirati',
    dob: '2010-11-05',
    gender: 'Male',
    applicationType: 'Regular',
    gradeApplying: 'Grade 9',
    stage: 'Emirates ID Verified',
    status: 'Pending',
    submittedDate: '2026-03-18',
    flagged: false,
    flagReasons: [],
    assignedReviewer: null,
    reviewerInitials: null,
    aiScore: null,
    checklist: makeChecklist([0, 1, 2, 5]),
    documents: [
      {
        type: 'Emirates ID',
        fileName: 'emirates_id_front.jpg',
        uploadedDate: '2026-03-18',
        verificationStatus: 'Verified',
        ocrConfidence: 98,
        extractedFields: [
          { field: 'Full Name (EN)', value: 'Mohammed Al Hamdan', confidence: 99, matchesApplication: true },
          { field: 'ID Number', value: '784-2010-4567890-1', confidence: 98, matchesApplication: true },
          { field: 'Nationality', value: 'UAE', confidence: 100, matchesApplication: true },
          { field: 'Date of Birth', value: '05/11/2010', confidence: 97, matchesApplication: true },
          { field: 'Expiry Date', value: '15/09/2028', confidence: 99, matchesApplication: true },
        ],
      },
    ],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-18', actor: 'Mohammed Al Hamdan' },
      { stage: 'Emirates ID Verified', date: '2026-03-19', actor: 'AI OCR Engine', note: 'ID extracted with 98% confidence' },
    ],
    scoring: null,
  },
  {
    id: 'APP-2026-005',
    initials: 'LK',
    nameEn: 'Layla Al Kindi',
    nameAr: 'ليلى الكندي',
    emiratesId: '784-2009-5678901-4',
    nationality: 'Emirati',
    dob: '2009-04-17',
    gender: 'Female',
    applicationType: 'International',
    gradeApplying: 'Grade 10',
    stage: 'Emirates ID Verified',
    status: 'Pending',
    submittedDate: '2026-03-17',
    flagged: false,
    flagReasons: [],
    assignedReviewer: null,
    reviewerInitials: null,
    aiScore: null,
    checklist: makeChecklist([0, 1, 5]),
    documents: [
      {
        type: 'Emirates ID',
        fileName: 'eid_layla.jpg',
        uploadedDate: '2026-03-17',
        verificationStatus: 'Verified',
        ocrConfidence: 96,
        extractedFields: [
          { field: 'Full Name (EN)', value: 'Layla Al Kindi', confidence: 97, matchesApplication: true },
          { field: 'ID Number', value: '784-2009-5678901-4', confidence: 96, matchesApplication: true },
          { field: 'Nationality', value: 'UAE', confidence: 100, matchesApplication: true },
          { field: 'Date of Birth', value: '17/04/2009', confidence: 95, matchesApplication: true },
        ],
      },
    ],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-17', actor: 'Layla Al Kindi' },
      { stage: 'Emirates ID Verified', date: '2026-03-18', actor: 'AI OCR Engine', note: 'ID extracted with 96% confidence' },
    ],
    scoring: null,
  },

  // Stage 3: Documents Under Review (5) — bottleneck stage
  {
    id: 'APP-2026-006',
    initials: 'HA',
    nameEn: 'Hamad Al Falasi',
    nameAr: 'حمد الفلاسي',
    emiratesId: '784-2008-6789012-2',
    nationality: 'Emirati',
    dob: '2008-09-30',
    gender: 'Male',
    applicationType: 'Regular',
    gradeApplying: 'Grade 11',
    stage: 'Documents Under Review',
    status: 'Pending',
    submittedDate: '2026-03-14',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Dr. Sarah Ahmed',
    reviewerInitials: 'SA',
    aiScore: null,
    checklist: makeChecklist([0, 1, 2, 3, 5]),
    documents: [
      {
        type: 'Emirates ID',
        fileName: 'eid_hamad.jpg',
        uploadedDate: '2026-03-14',
        verificationStatus: 'Verified',
        ocrConfidence: 99,
        extractedFields: [
          { field: 'Full Name (EN)', value: 'Hamad Al Falasi', confidence: 99, matchesApplication: true },
          { field: 'ID Number', value: '784-2008-6789012-2', confidence: 98, matchesApplication: true },
        ],
      },
      {
        type: 'Academic Transcript',
        fileName: 'grade10_transcript.pdf',
        uploadedDate: '2026-03-14',
        verificationStatus: 'Pending',
        ocrConfidence: 87,
        extractedFields: [
          { field: 'Student Name', value: 'Hamad Al Falasi', confidence: 91, matchesApplication: true },
          { field: 'GPA', value: '3.7', confidence: 87, matchesApplication: true },
          { field: 'Institution', value: 'Al Manhal School', confidence: 89, matchesApplication: true },
        ],
      },
    ],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-14', actor: 'Hamad Al Falasi' },
      { stage: 'Emirates ID Verified', date: '2026-03-15', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-16', actor: 'Dr. Sarah Ahmed', note: 'Assigned for document review' },
    ],
    scoring: null,
  },
  {
    id: 'APP-2026-007',
    initials: 'RN',
    nameEn: 'Reem Al Nuaimi',
    nameAr: 'ريم النعيمي',
    emiratesId: '784-2010-7890123-1',
    nationality: 'Emirati',
    dob: '2010-06-12',
    gender: 'Female',
    applicationType: 'Regular',
    gradeApplying: 'Grade 9',
    stage: 'Documents Under Review',
    status: 'Pending',
    submittedDate: '2026-03-12',
    flagged: true,
    flagReasons: ['GPA Mismatch'],
    assignedReviewer: 'Mr. Omar Hassan',
    reviewerInitials: 'OH',
    aiScore: null,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5], [3]),
    documents: [
      {
        type: 'Emirates ID',
        fileName: 'eid_reem.jpg',
        uploadedDate: '2026-03-12',
        verificationStatus: 'Verified',
        ocrConfidence: 97,
        extractedFields: [
          { field: 'Full Name (EN)', value: 'Reem Al Nuaimi', confidence: 97, matchesApplication: true },
        ],
      },
      {
        type: 'Academic Transcript',
        fileName: 'transcript_reem.pdf',
        uploadedDate: '2026-03-12',
        verificationStatus: 'Flagged',
        ocrConfidence: 82,
        extractedFields: [
          { field: 'Student Name', value: 'Reem Nuaimi', confidence: 84, matchesApplication: false },
          { field: 'GPA', value: '2.9', confidence: 82, matchesApplication: false },
        ],
      },
    ],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-12', actor: 'Reem Al Nuaimi' },
      { stage: 'Emirates ID Verified', date: '2026-03-13', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-14', actor: 'AI Engine', note: 'GPA mismatch detected — flagged for review' },
    ],
    scoring: null,
  },
  {
    id: 'APP-2026-008',
    initials: 'YM',
    nameEn: 'Yousef Al Marzouqi',
    nameAr: 'يوسف المرزوقي',
    emiratesId: '784-2009-8901234-3',
    nationality: 'Emirati',
    dob: '2009-12-01',
    gender: 'Male',
    applicationType: 'Transfer',
    gradeApplying: 'Grade 10',
    stage: 'Documents Under Review',
    status: 'Pending',
    submittedDate: '2026-03-11',
    flagged: true,
    flagReasons: ['Incomplete Documents'],
    assignedReviewer: 'Dr. Sarah Ahmed',
    reviewerInitials: 'SA',
    aiScore: null,
    checklist: makeChecklist([0, 1, 2, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-11', actor: 'Yousef Al Marzouqi' },
      { stage: 'Emirates ID Verified', date: '2026-03-12', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-13', actor: 'System', note: 'Missing clearance letter and medical records' },
    ],
    scoring: null,
  },
  {
    id: 'APP-2026-009',
    initials: 'AF',
    nameEn: 'Aisha Al Farsi',
    nameAr: 'عائشة الفارسي',
    emiratesId: '784-2011-9012345-2',
    nationality: 'Emirati',
    dob: '2011-08-27',
    gender: 'Female',
    applicationType: 'Regular',
    gradeApplying: 'Grade 8',
    stage: 'Documents Under Review',
    status: 'Pending',
    submittedDate: '2026-03-10',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Ms. Fatima Al Ali',
    reviewerInitials: 'FA',
    aiScore: null,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-10', actor: 'Aisha Al Farsi' },
      { stage: 'Emirates ID Verified', date: '2026-03-11', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-12', actor: 'Ms. Fatima Al Ali' },
    ],
    scoring: null,
  },
  {
    id: 'APP-2026-010',
    initials: 'TA',
    nameEn: 'Tariq Al Suwaidi',
    nameAr: 'طارق السويدي',
    emiratesId: '784-2008-0123456-4',
    nationality: 'Emirati',
    dob: '2008-02-19',
    gender: 'Male',
    applicationType: 'Special Program',
    gradeApplying: 'Grade 11',
    stage: 'Documents Under Review',
    status: 'Pending',
    submittedDate: '2026-03-09',
    flagged: true,
    flagReasons: ['Expired ID'],
    assignedReviewer: 'Mr. Omar Hassan',
    reviewerInitials: 'OH',
    aiScore: null,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5], [0]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-09', actor: 'Tariq Al Suwaidi' },
      { stage: 'Emirates ID Verified', date: '2026-03-10', actor: 'AI OCR Engine', note: 'Warning: Emirates ID expires within 30 days' },
      { stage: 'Documents Under Review', date: '2026-03-11', actor: 'System', note: 'Flagged: ID expiry concern' },
    ],
    scoring: null,
  },

  // Stage 4: AI Scored (4)
  {
    id: 'APP-2026-011',
    initials: 'DA',
    nameEn: 'Dana Al Blooshi',
    nameAr: 'دانة البلوشي',
    emiratesId: '784-2009-1234567-1',
    nationality: 'Emirati',
    dob: '2009-05-08',
    gender: 'Female',
    applicationType: 'Regular',
    gradeApplying: 'Grade 10',
    stage: 'AI Scored',
    status: 'Pending',
    submittedDate: '2026-03-05',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Dr. Sarah Ahmed',
    reviewerInitials: 'SA',
    aiScore: 91,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-05', actor: 'Dana Al Blooshi' },
      { stage: 'Emirates ID Verified', date: '2026-03-06', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-07', actor: 'Dr. Sarah Ahmed' },
      { stage: 'AI Scored', date: '2026-03-10', actor: 'AI Scoring Engine', note: 'Score: 91 — Recommend Admit' },
    ],
    scoring: {
      academic: 94, qudurat: 88, attendance: 95, extracurricular: 90, interview: 87,
      overall: 91,
      recommendation: 'Admit',
      rationale: 'Exceptional academic record with consistent high performance. Qudurat scores in top 15th percentile. Strong extracurricular involvement. Highly recommended for admission.',
    },
  },
  {
    id: 'APP-2026-012',
    initials: 'FM',
    nameEn: 'Faisal Al Mazrouei',
    nameAr: 'فيصل المزروعي',
    emiratesId: '784-2008-2345678-2',
    nationality: 'Emirati',
    dob: '2008-10-15',
    gender: 'Male',
    applicationType: 'Regular',
    gradeApplying: 'Grade 11',
    stage: 'AI Scored',
    status: 'Pending',
    submittedDate: '2026-03-04',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Ms. Fatima Al Ali',
    reviewerInitials: 'FA',
    aiScore: 76,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-04', actor: 'Faisal Al Mazrouei' },
      { stage: 'Emirates ID Verified', date: '2026-03-05', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-06', actor: 'Ms. Fatima Al Ali' },
      { stage: 'AI Scored', date: '2026-03-09', actor: 'AI Scoring Engine', note: 'Score: 76 — Recommend Admit' },
    ],
    scoring: {
      academic: 78, qudurat: 74, attendance: 82, extracurricular: 70, interview: 75,
      overall: 76,
      recommendation: 'Admit',
      rationale: 'Above-average academic performance with satisfactory Qudurat results. Good attendance record. Recommended for admission with standard conditions.',
    },
  },
  {
    id: 'APP-2026-013',
    initials: 'WA',
    nameEn: 'Wafa Al Shamsi',
    nameAr: 'وفاء الشامسي',
    emiratesId: '784-2010-3456789-3',
    nationality: 'Emirati',
    dob: '2010-03-22',
    gender: 'Female',
    applicationType: 'Transfer',
    gradeApplying: 'Grade 9',
    stage: 'AI Scored',
    status: 'Pending',
    submittedDate: '2026-03-03',
    flagged: true,
    flagReasons: ['Low Score'],
    assignedReviewer: 'Mr. Omar Hassan',
    reviewerInitials: 'OH',
    aiScore: 54,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-03', actor: 'Wafa Al Shamsi' },
      { stage: 'Emirates ID Verified', date: '2026-03-04', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-05', actor: 'Mr. Omar Hassan' },
      { stage: 'AI Scored', date: '2026-03-08', actor: 'AI Scoring Engine', note: 'Score: 54 — Marginal. Flagged for committee review' },
    ],
    scoring: {
      academic: 52, qudurat: 48, attendance: 65, extracurricular: 55, interview: 58,
      overall: 54,
      recommendation: 'Waitlist',
      rationale: 'Below target academic threshold. Qudurat results indicate foundational gaps. Attendance is acceptable. Recommend waitlisting pending committee review and possible remedial assessment.',
    },
  },
  {
    id: 'APP-2026-014',
    initials: 'BB',
    nameEn: 'Bashir Al Balushi',
    nameAr: 'بشير البلوشي',
    emiratesId: '784-2009-4567890-2',
    nationality: 'Emirati',
    dob: '2009-07-04',
    gender: 'Male',
    applicationType: 'International',
    gradeApplying: 'Grade 10',
    stage: 'AI Scored',
    status: 'Pending',
    submittedDate: '2026-03-02',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Dr. Sarah Ahmed',
    reviewerInitials: 'SA',
    aiScore: 83,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-03-02', actor: 'Bashir Al Balushi' },
      { stage: 'Emirates ID Verified', date: '2026-03-03', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-03-04', actor: 'Dr. Sarah Ahmed' },
      { stage: 'AI Scored', date: '2026-03-07', actor: 'AI Scoring Engine', note: 'Score: 83 — Recommend Admit' },
    ],
    scoring: {
      academic: 85, qudurat: 80, attendance: 88, extracurricular: 78, interview: 84,
      overall: 83,
      recommendation: 'Admit',
      rationale: 'Strong international academic record. Qudurat equivalency assessment satisfactory. Good interview performance. Recommended for standard admission.',
    },
  },

  // Stage 5: Decision Made (3)
  {
    id: 'APP-2026-015',
    initials: 'AA',
    nameEn: 'Amira Al Ameri',
    nameAr: 'أميرة العامري',
    emiratesId: '784-2010-5678901-1',
    nationality: 'Emirati',
    dob: '2010-01-30',
    gender: 'Female',
    applicationType: 'Regular',
    gradeApplying: 'Grade 9',
    stage: 'Decision Made',
    status: 'Approved',
    submittedDate: '2026-02-25',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Dr. Sarah Ahmed',
    reviewerInitials: 'SA',
    aiScore: 89,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-02-25', actor: 'Amira Al Ameri' },
      { stage: 'Emirates ID Verified', date: '2026-02-26', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-02-27', actor: 'Dr. Sarah Ahmed' },
      { stage: 'AI Scored', date: '2026-03-02', actor: 'AI Scoring Engine', note: 'Score: 89' },
      { stage: 'Decision Made', date: '2026-03-10', actor: 'Admissions Committee', note: 'Approved — offer letter sent' },
    ],
    scoring: {
      academic: 91, qudurat: 86, attendance: 92, extracurricular: 85, interview: 90,
      overall: 89,
      recommendation: 'Admit',
      rationale: 'Outstanding profile with consistent academic excellence.',
    },
  },
  {
    id: 'APP-2026-016',
    initials: 'ZQ',
    nameEn: 'Zayed Al Qubaisi',
    nameAr: 'زايد القبيسي',
    emiratesId: '784-2008-6789012-3',
    nationality: 'Emirati',
    dob: '2008-11-18',
    gender: 'Male',
    applicationType: 'Transfer',
    gradeApplying: 'Grade 11',
    stage: 'Decision Made',
    status: 'Rejected',
    submittedDate: '2026-02-20',
    flagged: true,
    flagReasons: ['Suspicious Data', 'Low Score'],
    assignedReviewer: 'Mr. Omar Hassan',
    reviewerInitials: 'OH',
    aiScore: 38,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-02-20', actor: 'Zayed Al Qubaisi' },
      { stage: 'Emirates ID Verified', date: '2026-02-21', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-02-22', actor: 'Mr. Omar Hassan', note: 'Transcript authenticity concern raised' },
      { stage: 'AI Scored', date: '2026-02-28', actor: 'AI Scoring Engine', note: 'Score: 38 — Below threshold' },
      { stage: 'Decision Made', date: '2026-03-08', actor: 'Admissions Committee', note: 'Rejected — score below minimum + document concerns' },
    ],
    scoring: {
      academic: 35, qudurat: 32, attendance: 48, extracurricular: 40, interview: 38,
      overall: 38,
      recommendation: 'Reject',
      rationale: 'Score below minimum admission threshold. Document authenticity concerns flagged during review.',
    },
  },
  {
    id: 'APP-2026-017',
    initials: 'JA',
    nameEn: 'Joud Al Awadhi',
    nameAr: 'جود العوضي',
    emiratesId: '784-2010-7890123-4',
    nationality: 'Emirati',
    dob: '2010-09-07',
    gender: 'Female',
    applicationType: 'Special Program',
    gradeApplying: 'Grade 9',
    stage: 'Decision Made',
    status: 'Waitlisted',
    submittedDate: '2026-02-22',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Ms. Fatima Al Ali',
    reviewerInitials: 'FA',
    aiScore: 62,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-02-22', actor: 'Joud Al Awadhi' },
      { stage: 'Emirates ID Verified', date: '2026-02-23', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-02-24', actor: 'Ms. Fatima Al Ali' },
      { stage: 'AI Scored', date: '2026-03-01', actor: 'AI Scoring Engine', note: 'Score: 62 — Marginal' },
      { stage: 'Decision Made', date: '2026-03-09', actor: 'Admissions Committee', note: 'Waitlisted — pending capacity review' },
    ],
    scoring: {
      academic: 65, qudurat: 60, attendance: 70, extracurricular: 58, interview: 62,
      overall: 62,
      recommendation: 'Waitlist',
      rationale: 'Borderline score. Place on waitlist pending available capacity.',
    },
  },

  // Stage 6: Enrolled (2)
  {
    id: 'APP-2026-018',
    initials: 'MS',
    nameEn: 'Mariam Al Subousi',
    nameAr: 'مريم السبوسي',
    emiratesId: '784-2009-8901234-1',
    nationality: 'Emirati',
    dob: '2009-03-11',
    gender: 'Female',
    applicationType: 'Regular',
    gradeApplying: 'Grade 10',
    stage: 'Enrolled',
    status: 'Approved',
    submittedDate: '2026-02-10',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Dr. Sarah Ahmed',
    reviewerInitials: 'SA',
    aiScore: 94,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-02-10', actor: 'Mariam Al Subousi' },
      { stage: 'Emirates ID Verified', date: '2026-02-11', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-02-12', actor: 'Dr. Sarah Ahmed' },
      { stage: 'AI Scored', date: '2026-02-18', actor: 'AI Scoring Engine', note: 'Score: 94' },
      { stage: 'Decision Made', date: '2026-02-25', actor: 'Admissions Committee', note: 'Approved' },
      { stage: 'Enrolled', date: '2026-03-01', actor: 'Registrar', note: 'Enrolled in Grade 10 — SIS synced' },
    ],
    scoring: {
      academic: 96, qudurat: 93, attendance: 98, extracurricular: 90, interview: 95,
      overall: 94,
      recommendation: 'Admit',
      rationale: 'Top applicant this cycle. Exceptional across all criteria.',
    },
  },
  {
    id: 'APP-2026-019',
    initials: 'OA',
    nameEn: 'Omar Al Dhaheri',
    nameAr: 'عمر الظاهري',
    emiratesId: '784-2009-9012345-3',
    nationality: 'Emirati',
    dob: '2009-06-25',
    gender: 'Male',
    applicationType: 'Transfer',
    gradeApplying: 'Grade 10',
    stage: 'Enrolled',
    status: 'Approved',
    submittedDate: '2026-02-08',
    flagged: false,
    flagReasons: [],
    assignedReviewer: 'Ms. Fatima Al Ali',
    reviewerInitials: 'FA',
    aiScore: 87,
    checklist: makeChecklist([0, 1, 2, 3, 4, 5]),
    documents: [],
    timeline: [
      { stage: 'Application Submitted', date: '2026-02-08', actor: 'Omar Al Dhaheri' },
      { stage: 'Emirates ID Verified', date: '2026-02-09', actor: 'AI OCR Engine' },
      { stage: 'Documents Under Review', date: '2026-02-10', actor: 'Ms. Fatima Al Ali' },
      { stage: 'AI Scored', date: '2026-02-16', actor: 'AI Scoring Engine', note: 'Score: 87' },
      { stage: 'Decision Made', date: '2026-02-24', actor: 'Admissions Committee', note: 'Approved' },
      { stage: 'Enrolled', date: '2026-03-01', actor: 'Registrar', note: 'Enrolled — transfer credits verified' },
    ],
    scoring: {
      academic: 89, qudurat: 85, attendance: 90, extracurricular: 82, interview: 88,
      overall: 87,
      recommendation: 'Admit',
      rationale: 'Strong transfer applicant with verified credentials from accredited institution.',
    },
  },
]

// ─── Pipeline Summary ─────────────────────────────────────────────────────────

export const pipelineData = [
  { stageName: 'Submitted', count: 72 },
  { stageName: 'ID Verified', count: 58 },
  { stageName: 'Docs Review', count: 45 },
  { stageName: 'AI Scored', count: 89 },
  { stageName: 'Decision', count: 60 },
  { stageName: 'Enrolled', count: 18 },
]

// ─── Score Distribution ───────────────────────────────────────────────────────

export const scoreDistribution = [
  { band: '90–100', label: 'Excellent', count: 42, fill: '#4CAF50' },
  { band: '70–89', label: 'Good', count: 98, fill: '#00B8A9' },
  { band: '50–69', label: 'Marginal', count: 31, fill: '#FFC107' },
  { band: '<50', label: 'Below Threshold', count: 15, fill: '#EF4444' },
]

// ─── Document Verification Stats ──────────────────────────────────────────────

export const docVerificationStats = [
  { verificationLabel: 'Verified', count: 186, fill: '#4CAF50' },
  { verificationLabel: 'Pending', count: 64, fill: '#FFC107' },
  { verificationLabel: 'Flagged', count: 18, fill: '#EF4444' },
]

export const recentDocScans = [
  { name: 'Emirates ID — Mohammed Al Hamdan', confidence: 98, docStatus: 'Verified', time: '2 min ago' },
  { name: 'Transcript — Reem Al Nuaimi', confidence: 82, docStatus: 'Flagged', time: '14 min ago' },
  { name: 'Passport — Layla Al Kindi', confidence: 96, docStatus: 'Verified', time: '31 min ago' },
  { name: 'Birth Certificate — Noura Binsaeed', confidence: 91, docStatus: 'Verified', time: '1 hr ago' },
]

// ─── Integration Status ───────────────────────────────────────────────────────

export const integrations: IntegrationStatus[] = [
  {
    system: 'SIS',
    connected: true,
    connectionStatus: 'Healthy',
    lastSync: '2026-03-25 08:14',
    recordsSynced: 1842,
    fieldMappings: [
      { source: 'nameEn', mapsTo: 'student_name', mappingStatus: 'mapped' },
      { source: 'emiratesId', mapsTo: 'national_id', mappingStatus: 'mapped' },
      { source: 'gradeApplying', mapsTo: 'enrollment_grade', mappingStatus: 'mapped' },
      { source: 'dob', mapsTo: 'date_of_birth', mappingStatus: 'auto' },
      { source: 'nationality', mapsTo: 'citizenship', mappingStatus: 'mapped' },
      { source: 'applicationType', mapsTo: 'admission_route', mappingStatus: 'auto' },
    ],
    syncHistory: [
      { date: '2026-03-25', records: 12, syncStatus: 'Success', duration: '0.8s' },
      { date: '2026-03-24', records: 18, syncStatus: 'Success', duration: '1.1s' },
      { date: '2026-03-23', records: 7, syncStatus: 'Partial', duration: '2.3s' },
      { date: '2026-03-22', records: 22, syncStatus: 'Success', duration: '0.9s' },
      { date: '2026-03-21', records: 15, syncStatus: 'Success', duration: '1.0s' },
    ],
  },
  {
    system: 'Qudurat',
    connected: true,
    connectionStatus: 'Warning',
    lastSync: '2026-03-25 06:00',
    recordsSynced: 342,
    fieldMappings: [
      { source: 'emiratesId', mapsTo: 'applicant_id', mappingStatus: 'mapped' },
      { source: 'scoring.qudurat', mapsTo: 'assessment_score', mappingStatus: 'mapped' },
      { source: 'nameEn', mapsTo: 'candidate_name', mappingStatus: 'auto' },
      { source: 'gradeApplying', mapsTo: 'target_level', mappingStatus: 'unmapped' },
    ],
    syncHistory: [
      { date: '2026-03-25', records: 8, syncStatus: 'Partial', duration: '3.2s' },
      { date: '2026-03-24', records: 14, syncStatus: 'Success', duration: '1.4s' },
      { date: '2026-03-23', records: 0, syncStatus: 'Failed', duration: '—' },
      { date: '2026-03-22', records: 19, syncStatus: 'Success', duration: '1.2s' },
      { date: '2026-03-21', records: 11, syncStatus: 'Success', duration: '1.1s' },
    ],
  },
  {
    system: 'SAP HCM',
    connected: false,
    connectionStatus: 'Error',
    lastSync: '2026-03-23 22:00',
    recordsSynced: 0,
    fieldMappings: [
      { source: 'nameEn', mapsTo: 'PERNR_NAME', mappingStatus: 'mapped' },
      { source: 'emiratesId', mapsTo: 'IDNUMBER', mappingStatus: 'mapped' },
      { source: 'status', mapsTo: 'ENROLLMENT_STATUS', mappingStatus: 'unmapped' },
    ],
    syncHistory: [
      { date: '2026-03-25', records: 0, syncStatus: 'Failed', duration: '—' },
      { date: '2026-03-24', records: 0, syncStatus: 'Failed', duration: '—' },
      { date: '2026-03-23', records: 5, syncStatus: 'Success', duration: '2.1s' },
      { date: '2026-03-22', records: 9, syncStatus: 'Success', duration: '1.8s' },
      { date: '2026-03-21', records: 6, syncStatus: 'Partial', duration: '2.6s' },
    ],
  },
]

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications: NotificationRecord[] = [
  { id: 'N001', recipientName: 'Sara Al Mansoori', channel: 'Portal', subject: 'Application Received', sentDate: '2026-03-22 10:15', deliveryStatus: 'Read', templateId: 'TPL-001' },
  { id: 'N002', recipientName: 'Khalid Al Rashidi', channel: 'Email', subject: 'Application Received', sentDate: '2026-03-23 09:00', deliveryStatus: 'Delivered', templateId: 'TPL-001' },
  { id: 'N003', recipientName: 'Hamad Al Falasi', channel: 'Email', subject: 'Documents Under Review', sentDate: '2026-03-16 11:30', deliveryStatus: 'Read', templateId: 'TPL-003' },
  { id: 'N004', recipientName: 'Reem Al Nuaimi', channel: 'SMS', subject: 'Action Required: Document Issue', sentDate: '2026-03-14 14:00', deliveryStatus: 'Delivered', templateId: 'TPL-004' },
  { id: 'N005', recipientName: 'Yousef Al Marzouqi', channel: 'Email', subject: 'Missing Documents Reminder', sentDate: '2026-03-15 09:00', deliveryStatus: 'Bounced', templateId: 'TPL-005' },
  { id: 'N006', recipientName: 'Amira Al Ameri', channel: 'Portal', subject: 'Congratulations — Admission Offer', sentDate: '2026-03-10 16:00', deliveryStatus: 'Read', templateId: 'TPL-006' },
  { id: 'N007', recipientName: 'Zayed Al Qubaisi', channel: 'Email', subject: 'Application Decision', sentDate: '2026-03-08 10:00', deliveryStatus: 'Delivered', templateId: 'TPL-007' },
  { id: 'N008', recipientName: 'Mariam Al Subousi', channel: 'Email', subject: 'Welcome — Enrollment Confirmed', sentDate: '2026-03-01 09:00', deliveryStatus: 'Read', templateId: 'TPL-008' },
]

export const notificationTemplates = [
  { id: 'TPL-001', name: 'Application Received', channel: 'Email / Portal', trigger: 'On submission' },
  { id: 'TPL-002', name: 'Emirates ID Verified', channel: 'Portal', trigger: 'On ID verification' },
  { id: 'TPL-003', name: 'Documents Under Review', channel: 'Email', trigger: 'On stage change' },
  { id: 'TPL-004', name: 'Action Required: Document Issue', channel: 'Email / SMS', trigger: 'On flag' },
  { id: 'TPL-005', name: 'Missing Documents Reminder', channel: 'Email / SMS', trigger: '3 days after flag' },
  { id: 'TPL-006', name: 'Admission Offer', channel: 'Email / Portal', trigger: 'On approval' },
  { id: 'TPL-007', name: 'Application Decision', channel: 'Email', trigger: 'On rejection/waitlist' },
  { id: 'TPL-008', name: 'Enrollment Confirmation', channel: 'Email / Portal', trigger: 'On enrollment' },
]
