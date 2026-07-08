'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Smartphone, Search, Check, X, RefreshCw,
  Link2, AlertCircle, ChevronDown, ChevronUp, RotateCcw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MobileUser {
  id:                string
  full_name:         string | null
  email:             string | null
  phone:             string | null
  address:           string | null
  mobile_app_status: 'pending' | 'linked' | 'approved' | 'rejected'
  ran_client_id:     string | null
  created_at:        string
}

interface RanClient {
  ran_client_id:  string
  business_name:  string
  address:        string
  contact_person: string
  contact_phone:  string
}

type StatusFilter = 'pending' | 'linked' | 'approved' | 'rejected' | 'all'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  pending:  { badge: 'bg-yellow-900 text-yellow-300', label: 'Pending'  },
  linked:   { badge: 'bg-blue-900 text-blue-300',     label: 'Linked'   },
  approved: { badge: 'bg-green-900 text-green-300',   label: 'Approved' },
  rejected: { badge: 'bg-red-900 text-red-300',       label: 'Rejected' },
}

const FILTER_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'pending',  label: 'Pending'  },
  { id: 'linked',   label: 'Linked'   },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all',      label: 'All'      },
]

// ─── RAN Client Selector ──────────────────────────────────────────────────────

function RanClientSelector({
  currentId,
  selected,
  onSelect,
}: {
  currentId: string | null
  selected: RanClient | null
  onSelect: (c: RanClient) => void
}) {
  const [open,     setOpen]     = useState(false)
  const [query,    setQuery]    = useState('')
  const [clients,  setClients]  = useState<RanClient[]>([])
  const [fetching, setFetching] = useState(false)
  const [fetchErr, setFetchErr] = useState<string | null>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchClients = useCallback(async (q: string) => {
    setFetching(true)
    setFetchErr(null)
    try {
      const { data: { session } } = await supabase().auth.getSession()
      if (!session) throw new Error('Session expired — please reload.')
      const res = await fetch(`/api/ran-clients?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
      setClients(body.clients ?? [])
    } catch (err: any) {
      setFetchErr(err.message)
      setClients([])
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => searchClients(query), 300)
  }, [query, open, searchClients])

  function handleOpen() {
    setOpen(true)
    setQuery('')
    setClients([])
    setFetchErr(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div>
      {/* Currently selected preview */}
      {selected ? (
        <div className="flex items-start justify-between bg-blue-950 border border-blue-800 rounded-xl px-4 py-3 mb-3">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-white">{selected.business_name || '(No name)'}</p>
            {selected.address        && <p className="text-xs text-gray-400">{selected.address}</p>}
            {selected.contact_person && <p className="text-xs text-gray-400">{selected.contact_person} · {selected.contact_phone}</p>}
            <p className="text-xs font-mono text-blue-400 mt-0.5">ID: {selected.ran_client_id}</p>
          </div>
          <button
            onClick={() => { setOpen(false) }}
            title="Change selection"
            className="text-gray-500 hover:text-yellow-400 ml-3 mt-0.5 flex-shrink-0 text-xs underline"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          {/* Current link indicator */}
          {currentId && !open && (
            <div className="flex items-center gap-2 bg-green-950 border border-green-800 rounded-lg px-3 py-2 mb-3 text-sm text-green-400">
              <Link2 className="h-4 w-4 flex-shrink-0" />
              <span>Currently linked: <span className="font-mono font-bold">{currentId}</span></span>
            </div>
          )}

          {/* Open search button */}
          {!open && (
            <button
              type="button"
              onClick={handleOpen}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-sm text-gray-400 hover:border-blue-600 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {currentId ? 'Search to change linked client…' : 'Search Project RAN clients…'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </>
      )}

      {/* Search panel */}
      {open && !selected && (
        <div className="bg-navy-950 border border-navy-700 rounded-xl overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-navy-800">
            <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Business name or address…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white flex-shrink-0">
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto">
            {fetching && (
              <p className="px-4 py-4 text-sm text-gray-500 text-center">Searching RAN clients…</p>
            )}
            {!fetching && fetchErr && (
              <div className="px-4 py-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{fetchErr}</p>
              </div>
            )}
            {!fetching && !fetchErr && clients.length === 0 && (
              <p className="px-4 py-4 text-sm text-gray-500 text-center">
                {query ? 'No clients found.' : 'Type to search…'}
              </p>
            )}
            {!fetching && clients.map(c => (
              <button
                key={c.ran_client_id}
                type="button"
                onClick={() => { onSelect(c); setOpen(false) }}
                className="w-full text-left px-4 py-3 hover:bg-navy-800 transition-colors border-b border-navy-900 last:border-0"
              >
                <p className="text-sm font-semibold text-white">{c.business_name || '(No name)'}</p>
                {c.address        && <p className="text-xs text-gray-400">{c.address}</p>}
                {c.contact_person && <p className="text-xs text-gray-500">{c.contact_person} · {c.contact_phone}</p>}
                <p className="text-xs font-mono text-blue-500 mt-0.5">ID: {c.ran_client_id}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  user,
  onClose,
  onSaved,
}: {
  user: MobileUser
  onClose: () => void
  onSaved: () => void
}) {
  const [selected,    setSelected]    = useState<RanClient | null>(null)
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleAction(status: 'approved' | 'rejected' | 'pending' | 'linked') {
    const needsClient = status === 'approved' || status === 'linked'
    const clientId    = selected?.ran_client_id ?? (needsClient ? user.ran_client_id : undefined)
    if (needsClient && !clientId) return

    setSaving(true)
    setSaveError(null)
    try {
      const { data: { session } } = await supabase().auth.getSession()
      if (!session) throw new Error('Session expired — please reload.')

      const res = await fetch('/api/mobile-access', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          userId:            user.id,
          mobile_app_status: status,
          ran_client_id:     needsClient ? clientId : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      onSaved()
      onClose()
    } catch (err: any) {
      setSaveError(err.message)
      setShowConfirm(false)
    } finally {
      setSaving(false)
    }
  }

  // Approve allowed if: new client selected, OR user is already linked with ran_client_id
  const clientForApproval = selected?.ran_client_id ?? (user.mobile_app_status === 'linked' ? user.ran_client_id : null)
  const canApprove  = !!clientForApproval
  // Save Link only shown when a NEW client is selected that differs from the current one
  const canSaveLink = !!selected && selected.ran_client_id !== user.ran_client_id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={showConfirm ? undefined : onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              {showConfirm ? 'Confirm Approval' : 'Review Mobile Access'}
            </h2>
          </div>
          <button
            onClick={() => showConfirm ? (setShowConfirm(false), setSaveError(null)) : onClose()}
            className="text-gray-400 hover:text-white text-xl font-bold leading-none"
          >
            {showConfirm ? '←' : '✕'}
          </button>
        </div>

        <div className="p-6 space-y-6">
          {showConfirm ? (
            /* ── Confirmation step ─────────────────────────────────────────── */
            <>
              <p className="text-sm text-gray-400">Please review before granting mobile app access.</p>

              <section className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">User</h3>
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-400">Name</span>
                  <span className="font-semibold text-white">{user.full_name || '—'}</span>
                </div>
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-400">Email</span>
                  <span className="font-medium text-white text-right break-all">{user.email}</span>
                </div>
              </section>

              <section className="bg-green-950 border border-green-900 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Linked Project RAN Client</h3>
                {selected ? (
                  <>
                    <div className="flex justify-between text-sm gap-4">
                      <span className="text-gray-400">Business Name</span>
                      <span className="font-semibold text-white text-right">{selected.business_name || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm gap-4">
                      <span className="text-gray-400">RAN Client ID</span>
                      <span className="font-mono text-xs text-green-400">{selected.ran_client_id}</span>
                    </div>
                    {selected.address && (
                      <div className="flex justify-between text-sm gap-4">
                        <span className="text-gray-400">Address</span>
                        <span className="text-white text-right max-w-[60%]">{selected.address}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-between text-sm gap-4">
                    <span className="text-gray-400">RAN Client ID</span>
                    <span className="font-mono text-xs text-green-400">{user.ran_client_id}</span>
                  </div>
                )}
              </section>

              {saveError && (
                <div className="flex items-start gap-2 bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowConfirm(false); setSaveError(null) }}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold text-sm disabled:opacity-40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction('approved')}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {saving ? 'Approving…' : 'Approve'}
                </button>
              </div>
            </>
          ) : (
            /* ── Review form ─────────────────────────────────────────────── */
            <>
              {/* User info */}
              <section className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">User Information</h3>
                {[
                  ['Name',    user.full_name || '—'],
                  ['Email',   user.email      || '—'],
                  ['Phone',   user.phone      || '—'],
                  ['Address', user.address    || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-400 flex-shrink-0">{label}</span>
                    <span className="font-medium text-white text-right">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm gap-4 pt-1">
                  <span className="text-gray-400 flex-shrink-0">Current Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[user.mobile_app_status]?.badge}`}>
                    {STATUS_STYLES[user.mobile_app_status]?.label}
                  </span>
                </div>
              </section>

              {/* RAN Client Selector */}
              <section>
                <div className="flex items-center gap-2 mb-1">
                  <Link2 className="h-4 w-4 text-gray-400" />
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Link to Project RAN Client</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Select an existing client from the Project RAN database. Manual ID entry is not permitted.
                </p>
                <RanClientSelector
                  currentId={user.ran_client_id}
                  selected={selected}
                  onSelect={setSelected}
                />
              </section>

              {/* Error banner */}
              {saveError && (
                <div className="flex items-start gap-2 bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Action buttons */}
              <section className="space-y-2">
                {/* Approve — triggers confirmation step */}
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={saving || !canApprove}
                  className="w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {canApprove
                    ? selected
                      ? `Approve & Link “${selected.business_name || selected.ran_client_id}”`
                      : 'Approve Access'
                    : 'Select a RAN client above to approve'}
                </button>

                {/* Save Link — links client without granting access yet */}
                {canSaveLink && (
                  <button
                    onClick={() => handleAction('linked')}
                    disabled={saving}
                    className="w-full py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 font-semibold text-sm disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Link2 className="h-4 w-4" />
                    {saving ? 'Saving…' : 'Save Link Only (pending approval)'}
                  </button>
                )}

                {/* Reject */}
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-semibold text-sm disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Reject Request
                </button>

                {/* Reset to Pending */}
                {user.mobile_app_status !== 'pending' && (
                  <button
                    onClick={() => handleAction('pending')}
                    disabled={saving}
                    className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold text-sm disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Pending
                  </button>
                )}
              </section>

              <p className="text-xs text-gray-600 flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                Sensitive client details (CCTV, SIM900A, Orange Pi, Tailscale, credentials) are never
                shown to mobile users. Project RAN remains the master client record.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export default function MobileAccessPanel() {
  const [users,     setUsers]     = useState<MobileUser[]>([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState<StatusFilter>('pending')
  const [search,    setSearch]    = useState('')
  const [reviewing, setReviewing] = useState<MobileUser | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase().auth.getSession()
      if (!session) throw new Error('Session expired — please reload.')
      const res = await fetch('/api/mobile-access', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
      setUsers(body.users || [])
    } catch (err: any) {
      console.error('[MobileAccessPanel] Failed to load users:', err.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  const counts = {
    all:      users.length,
    pending:  users.filter(u => u.mobile_app_status === 'pending').length,
    linked:   users.filter(u => u.mobile_app_status === 'linked').length,
    approved: users.filter(u => u.mobile_app_status === 'approved').length,
    rejected: users.filter(u => u.mobile_app_status === 'rejected').length,
  }

  const filtered = users.filter(u => {
    const matchStatus = filter === 'all' || u.mobile_app_status === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (u.full_name ?? '').toLowerCase().includes(q) ||
      (u.email     ?? '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Review modal */}
      {reviewing && (
        <ReviewModal
          user={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={loadUsers}
        />
      )}

      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Mobile App Access</h2>
        <button
          onClick={loadUsers}
          className="text-gray-400 hover:text-white text-sm px-3 py-1.5 border border-gray-700 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex rounded-xl overflow-hidden border border-gray-700">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${
                filter === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 leading-none ${
                  filter === tab.id ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
                }`}>
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-600 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">RAN Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-blue-500 rounded-full" />
                      Loading users…
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No users found.
                  </td>
                </tr>
              ) : filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white">{user.full_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[user.mobile_app_status]?.badge ?? 'bg-gray-700 text-gray-300'}`}>
                      {STATUS_STYLES[user.mobile_app_status]?.label ?? user.mobile_app_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.ran_client_id ? (
                      <span className="flex items-center gap-1 text-xs font-mono text-green-400">
                        <Link2 className="h-3 w-3 flex-shrink-0" />
                        {user.ran_client_id}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">Not linked</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setReviewing(user)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info footer */}
      <p className="text-xs text-gray-600 flex items-start gap-1.5">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
        Admin workflow: encode client in Project RAN → link ran_client_id here → approve.
        Sensitive fields (CCTV, SIM900A, Orange Pi, Tailscale) are never exposed to mobile users.
      </p>
    </div>
  )
}
