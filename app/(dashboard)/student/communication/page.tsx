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
import { useCurrentStudent } from '@/stores/role-store'

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
  subject?: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    name: 'Ms. Aisha Al-Zaabi',
    role: 'Mathematics Teacher',
    initials: 'AA',
    avatarColor: '#3B82F6',
    subject: 'Mathematics',
    lastMessage: 'Please review Chapter 6 before next class.',
    lastTime: 'Today',
    unread: 2,
    messages: [
      { id: 'm1', text: 'Hello Ahmed, I wanted to check in on your progress with quadratic equations.', from: 'other', time: '09:10', read: true },
      { id: 'm2', text: 'Hi Ms. Al-Zaabi, I\'ve been practising but Q15 is still giving me trouble.', from: 'me', time: '09:15', read: true },
      { id: 'm3', text: 'That\'s a common sticking point. The key is to check the discriminant first. I\'ll send you a worked example tonight.', from: 'other', time: '09:18', read: true },
      { id: 'm4', text: 'Thank you, that would really help!', from: 'me', time: '09:20', read: true },
      { id: 'm5', text: 'Please review Chapter 6 before next class.', from: 'other', time: '10:45', read: false },
      { id: 'm6', text: 'Also, your assignment is due this Thursday — let me know if you need an extension.', from: 'other', time: '10:46', read: false },
    ],
  },
  {
    id: 'conv-002',
    name: 'Mr. Khalid Al-Mansouri',
    role: 'Physics Teacher',
    initials: 'KM',
    avatarColor: '#8B5CF6',
    subject: 'Physics',
    lastMessage: 'Great work on the lab report!',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Ahmed, I just finished reviewing your Newton\'s Laws lab report.', from: 'other', time: '14:30', read: true },
      { id: 'm2', text: 'Great work on the lab report! Your analysis of error sources was particularly strong.', from: 'other', time: '14:31', read: true },
      { id: 'm3', text: 'Thank you so much, sir! I spent a lot of time on the discussion section.', from: 'me', time: '15:00', read: true },
      { id: 'm4', text: 'It shows. You\'ve earned a well-deserved grade. Keep this up for the end-of-term exam.', from: 'other', time: '15:05', read: true },
    ],
  },
  {
    id: 'conv-003',
    name: 'Ms. Sarah Johnson',
    role: 'English Teacher',
    initials: 'SJ',
    avatarColor: '#10B981',
    subject: 'English Language',
    lastMessage: 'Don\'t forget your essay draft is due Friday.',
    lastTime: 'Mon',
    unread: 1,
    messages: [
      { id: 'm1', text: 'Hi Ahmed, just a reminder that your persuasive essay draft is due on Friday.', from: 'other', time: '11:00', read: false },
      { id: 'm2', text: 'Make sure your thesis statement is in the first paragraph.', from: 'other', time: '11:01', read: true },
    ],
  },
  {
    id: 'conv-004',
    name: 'Student Counsellor',
    role: 'Ms. Hana Al-Rashidi',
    initials: 'HR',
    avatarColor: '#F59E0B',
    lastMessage: 'How are you feeling about the upcoming exams?',
    lastTime: 'Thu',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Good morning Ahmed, I\'m reaching out to check how you\'re feeling ahead of the mid-term period.', from: 'other', time: '08:30', read: true },
      { id: 'm2', text: 'How are you feeling about the upcoming exams?', from: 'other', time: '08:31', read: true },
      { id: 'm3', text: 'A bit stressed about Physics honestly, but I\'m working on it.', from: 'me', time: '09:00', read: true },
      { id: 'm4', text: 'That\'s completely normal. Please drop by my office if you\'d like to talk through any concerns. I\'m here to support you.', from: 'other', time: '09:05', read: true },
    ],
  },
  {
    id: 'conv-005',
    name: 'Class Representative',
    role: 'Group Chat — Grade 10A',
    initials: 'G',
    avatarColor: '#EC4899',
    lastMessage: 'Study group meets tomorrow at 3pm in the library.',
    lastTime: 'Tue',
    unread: 3,
    messages: [
      { id: 'm1', text: 'Hey everyone! Study group for the Maths test is tomorrow at 3pm in the library.', from: 'other', time: '16:00', read: false },
      { id: 'm2', text: 'Bring your Chapter 5 notes!', from: 'other', time: '16:01', read: false },
      { id: 'm3', text: 'Study group meets tomorrow at 3pm in the library.', from: 'other', time: '16:02', read: false },
    ],
  },
]

const CONTACTS = [
  { id: 'c1', name: 'Ms. Aisha Al-Zaabi', role: 'Mathematics Teacher', initials: 'AA', avatarColor: '#3B82F6', subject: 'Mathematics' },
  { id: 'c2', name: 'Mr. Khalid Al-Mansouri', role: 'Physics Teacher', initials: 'KM', avatarColor: '#8B5CF6', subject: 'Physics' },
  { id: 'c3', name: 'Ms. Sarah Johnson', role: 'English Teacher', initials: 'SJ', avatarColor: '#10B981', subject: 'English Language' },
  { id: 'c4', name: 'Student Counsellor', role: 'Ms. Hana Al-Rashidi', initials: 'HR', avatarColor: '#F59E0B', subject: undefined },
  { id: 'c5', name: 'Mr. Omar Bin Saeed', role: 'Chemistry Teacher', initials: 'OS', avatarColor: '#EF4444', subject: 'Chemistry' },
  { id: 'c6', name: 'Ms. Fatima Al-Nuaimi', role: 'Islamic Studies Teacher', initials: 'FN', avatarColor: '#6366F1', subject: 'Islamic Studies' },
  { id: 'c7', name: 'Class Representative', role: 'Group Chat — Grade 10A', initials: 'G', avatarColor: '#EC4899', subject: undefined },
]

function formatMessages(msgs: Message[]) {
  return msgs
}

export default function StudentCommunicationPage() {
  const student = useCurrentStudent()
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState<string>('conv-001')
  const [search, setSearch] = useState('')
  const [inputText, setInputText] = useState('')
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeRecipient, setComposeRecipient] = useState<typeof CONTACTS[0] | null>(null)
  const [composeText, setComposeText] = useState('')
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
    // Mark as read
    setConversations(prev => prev.map(c =>
      c.id === id ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c
    ))
  }

  function sendMessage() {
    if (!inputText.trim() || !selectedId) return
    const now = new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: inputText.trim(),
      from: 'me',
      time: now,
      read: false,
    }
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

  function sendNewMessage() {
    if (!composeRecipient || !composeText.trim()) return
    const now = new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })
    const existingConv = conversations.find(c => c.name === composeRecipient.name)
    if (existingConv) {
      // append to existing conversation
      const newMsg: Message = { id: `msg-${Date.now()}`, text: composeText.trim(), from: 'me', time: now, read: false }
      setConversations(prev => prev.map(c =>
        c.id === existingConv.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: composeText.trim(), lastTime: 'Now' }
          : c
      ))
      setSelectedId(existingConv.id)
    } else {
      // create brand-new conversation
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        name: composeRecipient.name,
        role: composeRecipient.role,
        initials: composeRecipient.initials,
        avatarColor: composeRecipient.avatarColor,
        subject: composeRecipient.subject,
        lastMessage: composeText.trim(),
        lastTime: 'Now',
        unread: 0,
        messages: [{ id: `msg-${Date.now()}`, text: composeText.trim(), from: 'me', time: now, read: false }],
      }
      setConversations(prev => [newConv, ...prev])
      setSelectedId(newConv.id)
    }
    setComposeOpen(false)
    setComposeRecipient(null)
    setComposeText('')
    setContactSearch('')
    setShowContactList(false)
  }

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0)
  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col relative">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Communication</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up'}
            </p>
          </div>
          <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => { setComposeOpen(true); setShowContactList(false) }}>
            <Plus className="w-3.5 h-3.5" />
            New Message
          </Button>
        </div>
      </div>

      {/* Compose slide-in panel */}
      {composeOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20" onClick={() => { setComposeOpen(false); setComposeRecipient(null); setComposeText(''); setContactSearch(''); setShowContactList(false) }} />
          <div className="fixed right-0 top-0 h-full w-[400px] z-40 bg-card border-l border-border flex flex-col shadow-xl">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">New Message</span>
              </div>
              <button
                onClick={() => { setComposeOpen(false); setComposeRecipient(null); setComposeText(''); setContactSearch(''); setShowContactList(false) }}
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
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{contact.name}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{contact.role}</p>
                            </div>
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
                placeholder={composeRecipient ? `Write to ${composeRecipient.name.split(' ')[0]}…` : 'Select a recipient first…'}
                disabled={!composeRecipient}
                className="flex-1 w-full resize-none rounded-xl bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                rows={8}
              />
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-border shrink-0 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => { setComposeOpen(false); setComposeRecipient(null); setComposeText(''); setContactSearch(''); setShowContactList(false) }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: conversation list */}
        <div className="w-80 shrink-0 border-r border-border flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search messages…"
                className="pl-8 h-8 text-xs bg-muted/30 border-border"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv.id)}
                className={`w-full flex items-start gap-3 p-4 border-b border-border text-left hover:bg-muted/30 transition-colors ${selectedId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
              >
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback
                    className="text-xs font-semibold text-white"
                    style={{ background: conv.avatarColor }}
                  >
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

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ background: selected.avatarColor }}
                    >
                      {selected.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {selected.role}{selected.subject ? ` · ${selected.subject}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.subject && (
                    <Badge variant="outline" className="text-[11px] h-5 border-primary/30 text-primary">{selected.subject}</Badge>
                  )}
                  <button className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {formatMessages(selected.messages).map((msg) => {
                  const isMe = msg.from === 'me'
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <Avatar className="w-7 h-7 shrink-0 mb-0.5">
                          <AvatarFallback
                            className="text-[11px] font-semibold text-white"
                            style={{ background: selected.avatarColor }}
                          >
                            {selected.initials}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div
                          className={`px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-card border border-border text-foreground rounded-bl-sm'
                          }`}
                        >
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
                          <AvatarFallback
                            className="text-[11px] font-semibold text-white"
                            style={{ background: student?.avatarColor ?? '#00B8A9' }}
                          >
                            {student?.initials ?? 'S'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-border bg-card shrink-0">
                <div className="flex items-end gap-2">
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 relative">
                    <Input
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message ${selected.name.split(' ')[0]}…`}
                      className="bg-muted/30 border-border text-sm pr-10 h-10"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="h-10 w-10 p-0 shrink-0"
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                  >
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
