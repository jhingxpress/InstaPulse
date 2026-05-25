'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, RefreshCw, Camera, Radio, Shield, Zap, Check, Phone } from 'lucide-react'
import { useRecaptcha } from '@/hooks/useRecaptcha'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'ai'
  text: string
  showLeadForm?: boolean
  leadSubmitted?: boolean
}

interface LeadData {
  name: string
  phone: string
  location: string
}

// ─── Constants ───────────────────────────────────────────────────────────────
const INITIAL_MESSAGE = "Hi there! 👋 I'm the InstaPulse Sales Assistant. I help you find the right security package for your property.\n\nWhat type of place do you want to secure?"

const QUICK_REPLIES = [
  { label: '📦 Show packages', value: 'Show me your packages and pricing' },
  { label: '💡 Get recommendation', value: 'Can you recommend the best package for me?' },
  { label: '🔧 Request installation', value: 'I want to request installation' },
  { label: '💬 Talk to sales', value: 'I want to talk to a sales representative' },
]

const LEAD_KEYWORDS = ['buy', 'purchase', 'install', 'price', 'magkano', 'how much', 'interested', 'gusto', 'order', 'quote', 'book', 'reserve', 'inquire', 'inquiry', 'schedule']

const LEAD_TRIGGER_PHRASE = "may i have your name, contact number"

const PACKAGES = [
  { name: 'Basic Package', price: '₱20,000', cameras: 1, buttons: 1, best: 'Small homes, sari-sari stores', color: 'border-blue-200 bg-blue-50' },
  { name: 'Standard Package', price: '₱21,000', cameras: 2, buttons: 1, best: 'Small businesses, shops', color: 'border-green-200 bg-green-50' },
  { name: 'Advanced Package', price: '₱22,000', cameras: 2, buttons: 2, best: 'Businesses, barangay halls', color: 'border-orange-200 bg-orange-50', popular: true },
  { name: 'Enterprise Package', price: 'Custom Quote', cameras: '4+', buttons: 'Multiple', best: 'Barangays, schools, large areas', color: 'border-red-200 bg-red-50' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const hasLeadIntent = (text: string) => LEAD_KEYWORDS.some(k => text.toLowerCase().includes(k))
const aiWantsLeadCapture = (text: string) => text.toLowerCase().includes(LEAD_TRIGGER_PHRASE)
const detectMentionedPackage = (text: string) => PACKAGES.find(p => text.toLowerCase().includes(p.name.toLowerCase()))

// ─── Sub-components ───────────────────────────────────────────────────────────
function PackageCard({ pkg }: { pkg: typeof PACKAGES[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 rounded-xl border-2 p-4 ${pkg.color}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-bold text-navy-900 text-sm">{pkg.name}</p>
          <p className="text-xs text-gray-500">{pkg.best}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-red-600 text-sm">{pkg.price}</p>
          {pkg.price !== 'Custom Quote' && <p className="text-xs text-gray-400">one-time</p>}
        </div>
      </div>
      <div className="flex items-center space-x-3 mt-2">
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <Camera className="h-3 w-3" />
          <span>{pkg.cameras} Camera{pkg.cameras !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <Radio className="h-3 w-3" />
          <span>{pkg.buttons} Button{pkg.buttons !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <Shield className="h-3 w-3" />
          <span>24/7 Support</span>
        </div>
      </div>
      {pkg.popular && (
        <div className="mt-2">
          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold">⭐ Most Popular</span>
        </div>
      )}
    </motion.div>
  )
}

function LeadForm({ onSubmit, onSkip }: { onSubmit: (data: LeadData) => void; onSkip: () => void }) {
  const [data, setData] = useState<LeadData>({ name: '', phone: '', location: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.name.trim() || !data.phone.trim()) return
    setSubmitting(true)
    await onSubmit(data)
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4"
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-navy-900">Reserve Your Slot</p>
          <p className="text-xs text-gray-500">Limited installation slots this week!</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text" placeholder="Your Name *" required value={data.name}
          onChange={e => setData(p => ({ ...p, name: e.target.value }))}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="tel" placeholder="Phone Number *" required value={data.phone}
          onChange={e => setData(p => ({ ...p, phone: e.target.value }))}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="text" placeholder="Your Location / City" value={data.location}
          onChange={e => setData(p => ({ ...p, location: e.target.value }))}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-400"
        />
        <div className="flex space-x-2 pt-1">
          <button
            type="submit" disabled={submitting || !data.name.trim() || !data.phone.trim()}
            className="flex-1 bg-red-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Sending...' : '🚀 Get Contacted Now'}
          </button>
          <button type="button" onClick={onSkip}
            className="px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            Skip
          </button>
        </div>
      </form>
    </motion.div>
  )
}

function LeadSuccess() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
        <Check className="h-5 w-5 text-white" />
      </div>
      <p className="text-sm font-bold text-green-800">You're all set! ✅</p>
      <p className="text-xs text-green-700 mt-1">Our team will contact you shortly to arrange your installation.</p>
      <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-gray-500">
        <Phone className="h-3 w-3" />
        <span>Or call us: +63 939 920 8711</span>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', text: INITIAL_MESSAGE }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [pendingLeadIndex, setPendingLeadIndex] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { getToken } = useRecaptcha()

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300) }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    setInput('')
    setError('')
    const userMsg: Message = { role: 'user', text: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages.slice(-5).map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      const triggerLead = !leadCaptured && (aiWantsLeadCapture(data.reply) || hasLeadIntent(msg))

      const aiMsg: Message = {
        role: 'ai',
        text: data.reply,
        showLeadForm: triggerLead,
      }
      setMessages(prev => {
        const updated = [...prev, aiMsg]
        if (triggerLead) setPendingLeadIndex(updated.length - 1)
        return updated
      })
    } catch (err: any) {
      setError(err.message || 'Failed to get a response.')
    } finally {
      setLoading(false)
    }
  }

  const submitLead = async (data: LeadData) => {
    try {
      const interest = messages.map(m => m.text).join(' ').substring(0, 200)
      const recaptchaToken = await getToken('lead_capture')
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, interest, recaptchaToken: recaptchaToken ?? undefined }),
      })
    } catch (_) {}

    setLeadCaptured(true)
    if (pendingLeadIndex !== null) {
      setMessages(prev => prev.map((m, i) =>
        i === pendingLeadIndex ? { ...m, showLeadForm: false, leadSubmitted: true } : m
      ))
    }
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Thank you, ${data.name}! 🎉 Our sales team will reach out to you at ${data.phone} shortly to schedule your site assessment.\n\nWe have limited installation slots — you're in good hands!`,
      }])
    }, 400)
  }

  const skipLead = () => {
    if (pendingLeadIndex !== null) {
      setMessages(prev => prev.map((m, i) =>
        i === pendingLeadIndex ? { ...m, showLeadForm: false } : m
      ))
    }
    setPendingLeadIndex(null)
  }

  const resetChat = () => {
    setMessages([{ role: 'ai', text: INITIAL_MESSAGE }])
    setError('')
    setLeadCaptured(false)
    setPendingLeadIndex(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const showQuickReplies = messages.length <= 2 && !loading

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ maxHeight: 'min(620px, calc(100vh - 120px))' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600 to-red-700 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-red-600 animate-pulse" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">InstaPulse Sales AI</p>
                  <p className="text-xs text-red-100">Available 24/7 · Instant Response</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={resetChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="New conversation">
                  <RefreshCw className="h-4 w-4 text-white" />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Urgency bar */}
            <div className="bg-orange-500 px-4 py-1.5 flex-shrink-0">
              <p className="text-xs text-white text-center font-medium">⚡ Limited installation slots available this week!</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50 min-h-0">
              {messages.map((msg, i) => {
                const mentionedPkg = msg.role === 'ai' ? detectMentionedPackage(msg.text) : null
                return (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mb-auto mt-1">
                        <Bot className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                    <div className={`max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-red-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                      {mentionedPkg && <PackageCard pkg={mentionedPkg} />}
                      {msg.showLeadForm && !leadCaptured && (
                        <LeadForm onSubmit={submitLead} onSkip={skipLead} />
                      )}
                      {msg.leadSubmitted && <LeadSuccess />}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mb-auto mt-1">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex justify-start items-end space-x-2">
                  <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-red-600" />
                  </div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex items-center space-x-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 bg-red-400 rounded-full" />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">Analyzing…</span>
                    </div>
                  </motion.div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <p className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">{error}</p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {QUICK_REPLIES.map(q => (
                    <button key={q.value} onClick={() => sendMessage(q.value)}
                      className="flex-shrink-0 text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors whitespace-nowrap font-medium">
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-4 py-2.5">
                <input
                  ref={inputRef}
                  type="text" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about packages, pricing, installation..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
                />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                  className="w-8 h-8 flex-shrink-0 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-1.5">Powered by InstaPulse AI · 24/7 Sales Assistant</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Open Sales Chat"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="h-6 w-6" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle className="h-6 w-6" /></motion.div>
          }
        </AnimatePresence>
        {!open && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />}
      </motion.button>
    </>
  )
}
