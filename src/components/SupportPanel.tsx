'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageSquare, ArrowLeft, Send, Plus, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SupportPanelProps {
  isAdmin: boolean
  darkMode?: boolean
}

const TICKET_STATUS_COLORS: Record<string, string> = {
  open:    'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-purple-100 text-purple-700',
  closed:  'bg-gray-200 text-gray-600',
}

export default function SupportPanel({ isAdmin, darkMode = false }: SupportPanelProps) {
  const [view, setView] = useState<'list' | 'thread'>('list')
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [reply, setReply] = useState('')
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [creating, setCreating] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentRole, setCurrentRole] = useState<string>('user')
  const bottomRef = useRef<HTMLDivElement>(null)

  const s = supabase() as any

  const bg    = darkMode ? 'bg-navy-900 border-navy-800' : 'bg-white border-gray-200'
  const text  = darkMode ? 'text-white' : 'text-gray-900'
  const sub   = darkMode ? 'text-gray-400' : 'text-gray-500'
  const itemBg = darkMode ? 'bg-navy-800 hover:bg-navy-700' : 'bg-gray-50 hover:bg-gray-100'
  const inputCls = darkMode
    ? 'bg-navy-800 border-navy-700 text-white placeholder-gray-500 focus:ring-red-600'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-red-600'

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase().auth.getUser()
      if (user) {
        setCurrentUser(user)
        const { data: profile } = await s.from('users').select('role').eq('id', user.id).single()
        setCurrentRole(profile?.role || 'user')
      }
    }
    init()
  }, [])

  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true)
    try {
      let query = s.from('support_tickets').select('*').order('updated_at', { ascending: false })
      if (!isAdmin) query = query.eq('user_id', currentUser?.id ?? '')
      const { data } = await query
      const tickets = data || []

      if (isAdmin && tickets.length > 0) {
        const userIds = [...new Set(tickets.map((t: any) => t.user_id))]
        const { data: users } = await s.from('users').select('id, full_name, email').in('id', userIds)
        const userMap: Record<string, any> = {}
        ;(users || []).forEach((u: any) => { userMap[u.id] = u })
        setTickets(tickets.map((t: any) => ({ ...t, users: userMap[t.user_id] || null })))
      } else {
        setTickets(tickets)
      }
    } finally {
      setLoadingTickets(false)
    }
  }, [isAdmin, currentUser])

  useEffect(() => {
    if (currentUser) fetchTickets()
  }, [currentUser, fetchTickets])

  const handleDeleteMessage = async (msgId: string) => {
    if (!confirm('Delete this message?')) return
    const { error } = await s.from('support_messages').delete().eq('id', msgId)
    if (error) {
      alert('Failed to delete message: ' + error.message)
    } else {
      setMessages(prev => prev.filter((m: any) => m.id !== msgId))
    }
  }

  const openTicket = async (ticket: any) => {
    setSelectedTicket(ticket)
    setView('thread')
    setLoadingMessages(true)
    const { data: msgs } = await s.from('support_messages').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true })
    let enriched = msgs || []
    if (isAdmin && enriched.length > 0) {
      const userSenderIds = [...new Set(
        enriched.filter((m: any) => m.sender_role === 'user').map((m: any) => m.sender_id as string)
      )]
      if (userSenderIds.length > 0) {
        const { data: profiles } = await s.from('users').select('id, full_name').in('id', userSenderIds)
        const nameMap: Record<string, string> = {}
        ;(profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name || 'Unknown' })
        enriched = enriched.map((m: any) => ({
          ...m,
          sender_name: m.sender_role === 'user' ? (nameMap[m.sender_id] || 'Unknown') : null,
        }))
      }
    }
    setMessages(enriched)
    setLoadingMessages(false)

    // Mark read
    if (isAdmin && ticket.unread_admin > 0) {
      await s.from('support_tickets').update({ unread_admin: 0 }).eq('id', ticket.id)
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unread_admin: 0 } : t))
    }
    if (!isAdmin && ticket.unread_user > 0) {
      await s.from('support_tickets').update({ unread_user: 0 }).eq('id', ticket.id)
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unread_user: 0 } : t))
    }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendReply = async () => {
    if (!reply.trim() || !selectedTicket || !currentUser) return
    setSending(true)
    try {
      const { data: msg } = await s.from('support_messages').insert({
        ticket_id: selectedTicket.id,
        sender_id: currentUser.id,
        sender_role: currentRole,
        message: reply.trim(),
      }).select().single()

      if (msg) {
        setMessages(prev => [...prev, msg])
        setReply('')
      }

      // Update ticket status + unread counter
      const unreadField = isAdmin ? 'unread_user' : 'unread_admin'
      const newStatus = isAdmin ? 'replied' : 'pending'
      await s.from('support_tickets').update({
        status: newStatus,
        [unreadField]: (selectedTicket[unreadField] || 0) + 1,
        updated_at: new Date().toISOString(),
      }).eq('id', selectedTicket.id)

      setSelectedTicket((prev: any) => ({ ...prev, status: newStatus }))
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus } : t))
    } finally {
      setSending(false)
    }
  }

  const updateTicketStatus = async (status: string) => {
    await s.from('support_tickets').update({ status }).eq('id', selectedTicket.id)
    setSelectedTicket((prev: any) => ({ ...prev, status }))
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status } : t))
  }

  const createTicket = async () => {
    if (!newSubject.trim() || !newMessage.trim() || !currentUser) return
    setCreating(true)
    try {
      const { data: ticket } = await s.from('support_tickets').insert({
        user_id: currentUser.id,
        subject: newSubject.trim(),
        unread_admin: 1,
      }).select().single()

      if (ticket) {
        await s.from('support_messages').insert({
          ticket_id: ticket.id,
          sender_id: currentUser.id,
          sender_role: 'user',
          message: newMessage.trim(),
        })
        setNewSubject('')
        setNewMessage('')
        setShowNewForm(false)
        await fetchTickets()
      }
    } finally {
      setCreating(false)
    }
  }

  // ─── LIST VIEW ────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${text}`}>{isAdmin ? 'Support Inbox' : 'Support'}</h2>
          <div className="flex items-center space-x-2">
            <button onClick={fetchTickets} className={`p-2 rounded-lg ${itemBg} ${sub}`}><RefreshCw className="h-4 w-4" /></button>
            {!isAdmin && (
              <button onClick={() => setShowNewForm(!showNewForm)}
                className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm font-medium">
                <Plus className="h-4 w-4" />
                <span>New Ticket</span>
              </button>
            )}
          </div>
        </div>

        {/* New Ticket Form */}
        {!isAdmin && showNewForm && (
          <div className={`border rounded-xl p-4 space-y-3 ${bg}`}>
            <h3 className={`font-semibold ${text}`}>New Support Ticket</h3>
            <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
              placeholder="Subject"
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 ${inputCls}`} />
            <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
              placeholder="Describe your issue..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none resize-none focus:ring-2 ${inputCls}`} />
            <div className="flex space-x-2">
              <button onClick={createTicket} disabled={creating}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-1">
                {creating ? <><Loader2 className="h-3 w-3 animate-spin" /><span>Sending...</span></>
                  : <span>Submit Ticket</span>}
              </button>
              <button onClick={() => setShowNewForm(false)} className={`px-4 py-2 rounded-lg text-sm border ${sub}`}>Cancel</button>
            </div>
          </div>
        )}

        {/* Tickets List */}
        {loadingTickets ? (
          <div className="flex justify-center py-12"><Loader2 className={`h-6 w-6 animate-spin ${sub}`} /></div>
        ) : tickets.length === 0 ? (
          <div className={`rounded-xl p-8 text-center border ${bg}`}>
            <MessageSquare className={`h-12 w-12 mx-auto mb-3 ${sub}`} />
            <p className={sub}>{isAdmin ? 'No support tickets yet.' : 'No tickets yet. Click "New Ticket" to get help.'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map(ticket => {
              const unread = isAdmin ? (ticket.unread_admin || 0) : (ticket.unread_user || 0)
              const isUnread = unread > 0
              return (
                <button key={ticket.id} onClick={() => openTicket(ticket)}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${isUnread ? (darkMode ? 'border-red-500 bg-red-900/10' : 'border-red-300 bg-red-50') : `${bg} ${itemBg}`}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {isUnread && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                        <p className={`truncate ${isUnread ? `font-bold ${text}` : `font-medium ${text}`}`}>{ticket.subject}</p>
                        {isUnread && (
                          <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5 font-bold flex-shrink-0">{unread} new</span>
                        )}
                      </div>
                      {isAdmin && ticket.users && (
                        <p className={`text-xs ${sub} mb-1`}>{ticket.users?.full_name || 'Unknown'} · {ticket.users?.email || ''}</p>
                      )}
                      <p className={`text-xs ${sub}`}>{new Date(ticket.updated_at).toLocaleString()}</p>
                    </div>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${TICKET_STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                      {ticket.status}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ─── THREAD VIEW ─────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Thread Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => { setView('list'); setSelectedTicket(null) }}
            className={`p-2 rounded-lg ${itemBg} ${sub}`}><ArrowLeft className="h-4 w-4" /></button>
          <div>
            <h3 className={`font-bold ${text}`}>{selectedTicket?.subject}</h3>
            {isAdmin && selectedTicket?.users && (
              <p className={`text-xs ${sub}`}>{selectedTicket.users.full_name} · {selectedTicket.users.email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${TICKET_STATUS_COLORS[selectedTicket?.status] || ''}`}>
            {selectedTicket?.status}
          </span>
          {isAdmin && (
            <select value={selectedTicket?.status}
              onChange={e => updateTicketStatus(e.target.value)}
              className={`text-xs border rounded-lg px-2 py-1 outline-none ${inputCls}`}>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className={`border rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4 ${bg}`}>
        {loadingMessages ? (
          <div className="flex justify-center py-8"><Loader2 className={`h-5 w-5 animate-spin ${sub}`} /></div>
        ) : messages.length === 0 ? (
          <p className={`text-center text-sm py-8 ${sub}`}>No messages yet.</p>
        ) : (
          messages.map(msg => {
            const isOwn = msg.sender_id === currentUser?.id
            const isAdminMsg = msg.sender_role !== 'user'
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isOwn
                    ? 'bg-red-600 text-white rounded-br-sm'
                    : isAdminMsg
                      ? 'bg-blue-600 text-white rounded-bl-sm'
                      : darkMode ? 'bg-navy-700 text-white rounded-bl-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}>
                  {!isOwn && (
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {isAdminMsg ? 'Admin' : (isAdmin ? (msg.sender_name || 'User') : 'User')}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <p className="text-xs opacity-60">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {currentRole === 'superadmin' && (
                      <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-60 hover:opacity-100 text-red-300 flex-shrink-0" title="Delete message">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply Box */}
      {selectedTicket?.status !== 'closed' && (
        <div className={`border rounded-xl p-3 flex items-end space-x-2 ${bg}`}>
          <textarea value={reply} onChange={e => setReply(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
            placeholder="Type a reply... (Enter to send)"
            rows={2}
            className={`flex-1 text-sm border rounded-lg px-3 py-2 outline-none resize-none focus:ring-2 ${inputCls}`} />
          <button onClick={sendReply} disabled={sending || !reply.trim()}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex-shrink-0">
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      )}
      {selectedTicket?.status === 'closed' && (
        <div className={`text-center text-sm py-3 rounded-xl border ${sub} ${bg}`}>
          This ticket is closed.
          {isAdmin && <button onClick={() => updateTicketStatus('open')} className="ml-2 text-red-600 hover:underline">Reopen</button>}
        </div>
      )}
    </div>
  )
}
