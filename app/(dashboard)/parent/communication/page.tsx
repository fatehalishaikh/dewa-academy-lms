'use client'
import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare, Send, Search,
  CheckCheck, Check, MoreVertical, Paperclip, Plus, X, ChevronDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCurrentParent } from '@/stores/role-store'

type Message = {
  id: string
  text: string
  from: 'me' | 'other'
  time: string
  read: boolean
}

type Conversation = {
  id: string
  name: string
  role: string
  initials: string
  avatarColor: string
  tag?: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    name: 'Dr. Sarah Ahmed',
    role: 'Mathematics Teacher',
    initials: 'SA',
    avatarColor: '#00B8A9',
    tag: 'Mathematics',
    lastMessage: 'Please encourage Ahmed to review Chapter 7 before the test.',
    lastTime: 'Today',
    unread: 2,
    messages: [
      { id: 'm1', text: 'Good morning Mr. Mohammed. I wanted to share some positive news about Ahmed\'s progress in Mathematics this term.', from: 'other', time: '08:55', read: true },
      { id: 'm2', text: 'His Chapter 4 quiz score came in at 92% — a strong improvement from last month.', from: 'other', time: '08:56', read: true },
      { id: 'm3', text: 'That\'s wonderful to hear, thank you for letting me know! He has been putting in extra hours at home.', from: 'me', time: '09:10', read: true },
      { id: 'm4', text: 'It really shows. If he keeps this momentum, a top grade for the semester is very achievable.', from: 'other', time: '09:14', read: true },
      { id: 'm5', text: 'Please encourage Ahmed to review Chapter 7 before the test on Thursday.', from: 'other', time: '10:30', read: false },
      { id: 'm6', text: 'I can share additional practice problems if he would like more preparation material.', from: 'other', time: '10:31', read: false },
    ],
  },
  {
    id: 'conv-002',
    name: 'Mr. James Wilson',
    role: 'Physics Teacher',
    initials: 'JW',
    avatarColor: '#0EA5E9',
    tag: 'Physics',
    lastMessage: 'The midterm results are now available on the portal.',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Dear Mr. Mohammed, Ahmed\'s Physics midterm results have been finalised.', from: 'other', time: '14:00', read: true },
      { id: 'm2', text: 'He scored 78/100. A passing grade, though he struggled with the optics section.', from: 'other', time: '14:01', read: true },
      { id: 'm3', text: 'Thank you for the update. Should I arrange extra tutoring for optics?', from: 'me', time: '14:20', read: true },
      { id: 'm4', text: 'That would be very helpful. I can also recommend some online resources. The midterm results are now available on the portal.', from: 'other', time: '14:35', read: true },
    ],
  },
  {
    id: 'conv-003',
    name: 'Ms. Layla Al-Farsi',
    role: 'English Teacher',
    initials: 'LF',
    avatarColor: '#8B5CF6',
    tag: 'English',
    lastMessage: 'Ahmed\'s essay was very well structured — well done!',
    lastTime: 'Mon',
    unread: 1,
    messages: [
      { id: 'm1', text: 'Mr. Mohammed, I just finished grading Ahmed\'s persuasive essay and wanted to share the result personally.', from: 'other', time: '16:00', read: false },
      { id: 'm2', text: 'Ahmed\'s essay was very well structured — well done! He scored 47/50.', from: 'other', time: '16:01', read: true },
    ],
  },
  {
    id: 'conv-004',
    name: 'School Administration',
    role: 'DEWA Academy — Admin Office',
    initials: 'AD',
    avatarColor: '#F59E0B',
    lastMessage: 'Your leave request for Ahmed has been approved.',
    lastTime: 'Apr 9',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Dear Mr. Mohammed Al-Rashid, we have received your leave request for Ahmed Al-Rashid dated April 10–11.', from: 'other', time: '10:00', read: true },
      { id: 'm2', text: 'We are pleased to inform you that your leave request for Ahmed has been approved. Please ensure he brings a medical note upon return.', from: 'other', time: '10:02', read: true },
      { id: 'm3', text: 'Thank you very much. We will make sure to provide the documentation.', from: 'me', time: '10:15', read: true },
      { id: 'm4', text: 'Thank you for your cooperation. We wish Ahmed a speedy recovery.', from: 'other', time: '10:18', read: true },
    ],
  },
  {
    id: 'conv-005',
    name: 'Attendance Office',
    role: 'DEWA Academy — Attendance',
    initials: 'AT',
    avatarColor: '#EF4444',
    lastMessage: 'Ahmed was marked late on Mar 20. Please provide an excuse note.',
    lastTime: 'Mar 20',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Dear Parent/Guardian, this is an automated notification. Ahmed Al-Rashid was marked late for the morning session on March 20, 2026.', from: 'other', time: '09:30', read: true },
      { id: 'm2', text: 'Ahmed was marked late on Mar 20. Please provide an excuse note if this was due to a medical or family reason.', from: 'other', time: '09:31', read: true },
      { id: 'm3', text: 'Apologies for the late arrival. There was a traffic delay on Sheikh Zayed Road. I will submit a note today.', from: 'me', time: '10:00', read: true },
      { id: 'm4', text: 'Thank you for letting us know. We have noted this on Ahmed\'s record.', from: 'other', time: '10:10', read: true },
    ],
  },
  {
    id: 'conv-006',
    name: 'Parent Representative',
    role: 'Grade 10A — Parent Group',
    initials: 'PG',
    avatarColor: '#10B981',
    lastMessage: 'Parent-Teacher Day is scheduled for April 22nd.',
    lastTime: 'Apr 11',
    unread: 3,
    messages: [
      { id: 'm1', text: 'Dear parents, a reminder that Parent-Teacher Day is scheduled for April 22nd from 9am to 12pm.', from: 'other', time: '08:00', read: false },
      { id: 'm2', text: 'Please book your slot through the parent portal under Requests → Meeting Request.', from: 'other', time: '08:01', read: false },
      { id: 'm3', text: 'Parent-Teacher Day is scheduled for April 22nd. Slots are filling up — book early!', from: 'other', time: '08:02', read: false },
    ],
  },
]

const CONTACTS = [
  { id: 'c1', name: 'Dr. Sarah Ahmed',      role: 'Mathematics Teacher',            initials: 'SA', avatarColor: '#00B8A9', tag: 'Mathematics' },
  { id: 'c2', name: 'Mr. James Wilson',      role: 'Physics Teacher',                initials: 'JW', avatarColor: '#0EA5E9', tag: 'Physics'     },
  { id: 'c3', name: 'Ms. Layla Al-Farsi',    role: 'English Teacher',                initials: 'LF', avatarColor: '#8B5CF6', tag: 'English'     },
  { id: 'c4', name: 'Mr. Hassan Mahmoud',    role: 'Chemistry Teacher',              initials: 'HM', avatarColor: '#10B981', tag: 'Chemistry'   },
  { id: 'c5', name: 'Ms. Fatima Al-Zaabi',   role: 'Arabic Teacher',                 initials: 'FZ', avatarColor: '#F59E0B', tag: 'Arabic'      },
  { id: 'c6', name: 'School Administration', role: 'DEWA Academy — Admin Office',    initials: 'AD', avatarColor: '#F59E0B', tag: undefined     },
  { id: 'c7', name: 'Attendance Office',     role: 'DEWA Academy — Attendance',      initials: 'AT', avatarColor: '#EF4444', tag: undefined     },
  { id: 'c8', name: 'Student Counsellor',    role: 'Ms. Hana Al-Rashidi',            initials: 'HR', avatarColor: '#6366F1', tag: undefined     },
  { id: 'c9', name: 'Parent Representative', role: 'Grade 10A — Parent Group',       initials: 'PG', avatarColor: '#10B981', tag: undefined     },
]

export default function ParentCommunicationPage() {
  const parent = useCurrentParent()

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [selectedId, setSelectedId]       = useState<string>('conv-001')
  const [search, setSearch]               = useState('')
  const [inputText, setInputText]         = useState('')
  const [composeOpen, setComposeOpen]     = useState(false)
  const [composeRecipient, setComposeRecipient] = useState<typeof CONTACTS[0] | null>(null)
  const [composeText, setComposeText]     = useState('')
  const [contactSearch, setContactSearch] = useState('')
  const [showContactList, setShowContactList] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selected = conversations.find(c => c.id === selectedId)

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.messages.length])

  function openConversation(id: string) {
    setSelectedId(id)
    setConversations(prev => prev.map(c =>
      c.id === id ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c
    ))
  }

  function sendMessage() {
    if (!inputText.trim() || !selectedId) return
    const now = new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })
    const newMsg: Message = { id: `msg-${Date.now()}`, text: inputText.trim(), from: 'me', time: now, read: false }
    setConversations(prev => prev.map(c =>
      c.id === selectedId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: inputText.trim(), lastTime: 'Now' }
        : c
    ))
    setInputText('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function closeCompose() {
    setComposeOpen(false); setComposeRecipient(null)
    setComposeText(''); setContactSearch(''); setShowContactList(false)
  }

  function sendNewMessage() {
    if (!composeRecipient || !composeText.trim()) return
    const now = new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })
    const existingConv = conversations.find(c => c.name === composeRecipient.name)
    if (existingConv) {
      const newMsg: Message = { id: `msg-${Date.now()}`, text: composeText.trim(), from: 'me', time: now, read: false }
      setConversations(prev => prev.map(c =>
        c.id === existingConv.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: composeText.trim(), lastTime: 'Now' }
          : c
      ))
      setSelectedId(existingConv.id)
    } else {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        name: composeRecipient.name,
        role: composeRecipient.role,
        initials: composeRecipient.initials,
        avatarColor: composeRecipient.avatarColor,
        tag: composeRecipient.tag,
        lastMessage: composeText.trim(),
        lastTime: 'Now',
        unread: 0,
        messages: [{ id: `msg-${Date.now()}`, text: composeText.trim(), from: 'me', time: now, read: false }],
      }
      setConversations(prev => [newConv, ...prev])
      setSelectedId(newConv.id)
    }
    closeCompose()
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0)
  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  )

  const ACCENT = '#8B5CF6'

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col relative">

      {/* ── Hero header ── */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0920 0%, #150d2e 55%, #070d1f 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `color-mix(in srgb, ${ACCENT} 20%, transparent)`, border: `1px solid color-mix(in srgb, ${ACCENT} 30%, transparent)` }}
            >
              <MessageSquare className="w-4 h-4" style={{ color: ACCENT }} />
            </div>
            <div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Parent Portal</p>
              <h1 className="text-lg font-bold text-white mt-0.5">Communication</h1>
              <p className="text-white/40 text-sm mt-0.5">
                {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          <Button size="sm" className="gap-1.5 h-8 text-xs shrink-0" onClick={() => { setComposeOpen(true); setShowContactList(false) }}>
            <Plus className="w-3.5 h-3.5" />
            New Message
          </Button>
        </div>
      </div>

      {/* ── Compose slide-in panel ── */}
      {composeOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20" onClick={closeCompose} />
          <div className="fixed right-0 top-0 h-full w-[400px] z-40 bg-card border-l border-border flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">New Message</span>
              </div>
              <button
                onClick={closeCompose}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* To field */}
            <div className="px-5 py-4 border-b border-border shrink-0">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">To</label>
              {composeRecipient ? (
                <div className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-xl px-3 py-2">
                  <Avatar className="w-6 h-6 shrink-0">
                    <AvatarFallback className="text-[11px] font-semibold text-white" style={{ background: composeRecipient.avatarColor }}>
                      {composeRecipient.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{composeRecipient.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{composeRecipient.role}</p>
                  </div>
                  <button onClick={() => { setComposeRecipient(null); setContactSearch('') }} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowContactList(v => !v)}
                    className="w-full flex items-center justify-between gap-2 bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-left hover:border-primary/30 transition-colors"
                  >
                    <span className="text-xs text-muted-foreground">Select a recipient…</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  </button>
                  {showContactList && (
                    <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                      <div className="p-2 border-b border-border">
                        <Input
                          value={contactSearch}
                          onChange={e => setContactSearch(e.target.value)}
                          placeholder="Search contacts…"
                          className="h-7 text-xs bg-muted/30 border-border"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-52 overflow-y-auto">
                        {filteredContacts.map(contact => (
                          <button
                            key={contact.id}
                            onClick={() => { setComposeRecipient(contact); setShowContactList(false); setContactSearch('') }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted/40 transition-colors text-left"
                          >
                            <Avatar className="w-7 h-7 shrink-0">
                              <AvatarFallback className="text-[11px] font-semibold text-white" style={{ background: contact.avatarColor }}>
                                {contact.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground truncate">{contact.name}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{contact.role}</p>
                            </div>
                            {contact.tag && (
                              <Badge variant="outline" className="text-[11px] h-4 shrink-0 border-primary/20 text-primary">{contact.tag}</Badge>
                            )}
                          </button>
                        ))}
                        {filteredContacts.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">No contacts found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Message body */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-3">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                value={composeText}
                onChange={e => setComposeText(e.target.value)}
                placeholder={composeRecipient ? `Write to ${composeRecipient.name.split(' ').slice(-1)[0]}…` : 'Select a recipient first…'}
                disabled={!composeRecipient}
                className="flex-1 w-full resize-none rounded-xl bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                rows={8}
              />
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-border shrink-0 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={closeCompose}>Cancel</Button>
              <Button
                size="sm" className="h-8 text-xs gap-1.5"
                onClick={sendNewMessage}
                disabled={!composeRecipient || !composeText.trim()}
              >
                <Send className="w-3 h-3" />
                Send Message
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ── Main split layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Conversation list */}
        <div className="w-80 shrink-0 border-r border-border flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="pl-8 h-8 text-xs bg-muted/30 border-border"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv.id)}
                className={`w-full flex items-start gap-3 p-4 border-b border-border text-left hover:bg-muted/30 transition-colors ${
                  selectedId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="text-xs font-semibold text-white" style={{ background: conv.avatarColor }}>
                    {conv.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={`text-xs font-medium truncate ${selectedId === conv.id ? 'text-primary' : 'text-foreground'}`}>
                      {conv.name}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <p className="text-[11px] text-muted-foreground">{conv.lastTime}</p>
                      {conv.unread > 0 && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-[11px] font-bold text-primary-foreground">{conv.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{conv.role}</p>
                  <p className={`text-[11px] truncate mt-0.5 ${conv.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs font-semibold text-white" style={{ background: selected.avatarColor }}>
                      {selected.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {selected.role}{selected.tag ? ` · ${selected.tag}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.tag && (
                    <Badge variant="outline" className="text-[11px] h-5 border-primary/30 text-primary">{selected.tag}</Badge>
                  )}
                  <button className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selected.messages.map(msg => {
                  const isMe = msg.from === 'me'
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <Avatar className="w-7 h-7 shrink-0 mb-0.5">
                          <AvatarFallback className="text-[11px] font-semibold text-white" style={{ background: selected.avatarColor }}>
                            {selected.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-[70%] space-y-1 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-card border border-border text-foreground rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[11px] text-muted-foreground">{msg.time}</span>
                          {isMe && (
                            msg.read
                              ? <CheckCheck className="w-2.5 h-2.5 text-primary" />
                              : <Check className="w-2.5 h-2.5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      {isMe && (
                        <Avatar className="w-7 h-7 shrink-0 mb-0.5">
                          <AvatarFallback className="text-[11px] font-semibold text-white" style={{ background: parent?.avatarColor ?? '#00B8A9' }}>
                            {parent?.initials ?? 'P'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="px-5 py-4 border-t border-border bg-card shrink-0">
                <div className="flex items-end gap-2">
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1">
                    <Input
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message ${selected.name.split(' ').slice(-1)[0]}…`}
                      className="bg-muted/30 border-border text-sm h-10"
                    />
                  </div>
                  <Button size="sm" className="h-10 w-10 p-0 shrink-0" onClick={sendMessage} disabled={!inputText.trim()}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 text-center">Press Enter to send</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Select a conversation to start</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
