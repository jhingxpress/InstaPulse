'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Shield, Users, FileText, Settings, LogOut, Search, AlertTriangle, Database, Lock, Package, MessageSquare, Eye, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isSuperAdmin, getAllProfiles, updateUserRole, type Profile, type UserRole } from '@/lib/profile'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import SupportPanel from '@/components/SupportPanel'

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [clientOrders, setClientOrders] = useState<any[]>([])
  const [unreadSupportCount, setUnreadSupportCount] = useState(0)
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])
  const [deletingLogs, setDeletingLogs] = useState(false)
  const lastActivityRef = useRef(Date.now())

  const fetchOrders = useCallback(async () => {
    const { data } = await (supabase() as any)
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
  }, [])

  const fetchUnreadSupport = useCallback(async () => {
    const { data } = await (supabase() as any)
      .from('support_tickets')
      .select('unread_admin')
      .gt('unread_admin', 0)
    setUnreadSupportCount(data ? data.reduce((sum: number, t: any) => sum + (t.unread_admin || 0), 0) : 0)
  }, [])

  const logAudit = async (action: string, targetType: string, targetId: string, details: Record<string, any> = {}) => {
    try {
      const { data: { user } } = await supabase().auth.getUser()
      if (!user) return
      const { data: profile } = await (supabase() as any).from('users').select('full_name, email, role').eq('id', user.id).single()
      await (supabase() as any).from('audit_logs').insert({
        user_id: user.id,
        action,
        target_table: targetType,
        target_id: targetId,
        new_data: { actor_name: profile?.full_name || user.email, actor_email: profile?.email || user.email, actor_role: profile?.role || 'unknown', ...details },
      })
    } catch {}
  }

  useEffect(() => {
    const checkAuth = async () => {
      const isSuperAdminUser = await isSuperAdmin()
      if (!isSuperAdminUser) {
        router.push('/403')
        return
      }

      setAuthenticated(true)
      setLoading(false)

      const allProfiles = await getAllProfiles()
      setProfiles(allProfiles)

      try {
        const { data: logs } = await (supabase() as any)
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        if (logs) setAuditLogs(logs)
      } catch (error) {
        console.log('Audit logs table may not exist')
      }

      // Fetch orders with user info from profiles
      const { data: allOrders } = await (supabase() as any)
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (allOrders) setOrders(allOrders)
      await fetchUnreadSupport()
    }

    checkAuth()
  }, [router, fetchUnreadSupport])

  // Idle auto-refresh: refresh data after 3 minutes of inactivity
  useEffect(() => {
    const trackActivity = () => { lastActivityRef.current = Date.now() }
    window.addEventListener('mousemove', trackActivity)
    window.addEventListener('keydown', trackActivity)
    window.addEventListener('click', trackActivity)

    const interval = setInterval(async () => {
      if (Date.now() - lastActivityRef.current >= 3 * 60 * 1000) {
        await fetchOrders()
        await fetchUnreadSupport()
        lastActivityRef.current = Date.now()
      }
    }, 30_000)

    return () => {
      window.removeEventListener('mousemove', trackActivity)
      window.removeEventListener('keydown', trackActivity)
      window.removeEventListener('click', trackActivity)
      clearInterval(interval)
    }
  }, [fetchOrders, fetchUnreadSupport])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  const stats = {
    totalUsers: profiles.length,
    totalAdmins: profiles.filter(p => p.role === 'admin').length,
    totalSuperadmins: profiles.filter(p => p.role === 'superadmin').length,
    totalRegularUsers: profiles.filter(p => p.role === 'user').length,
    totalAuditLogs: auditLogs.length,
  }

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length

  const handleDeleteSelectedLogs = async () => {
    if (selectedLogs.length === 0) return
    if (!confirm(`Delete ${selectedLogs.length} selected log(s)?`)) return
    setDeletingLogs(true)
    try {
      await (supabase() as any).from('audit_logs').delete().in('id', selectedLogs)
      setAuditLogs(prev => prev.filter(l => !selectedLogs.includes(l.id)))
      setSelectedLogs([])
    } finally {
      setDeletingLogs(false)
    }
  }

  const toggleLogSelect = (id: string) => {
    setSelectedLogs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAllLogs = () => {
    setSelectedLogs(prev => prev.length === auditLogs.length ? [] : auditLogs.map(l => l.id))
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const oldProfile = profiles.find(p => p.id === userId)
    const success = await updateUserRole(userId, newRole)
    if (success) {
      await logAudit('ROLE_CHANGE', 'users', userId, { from: oldProfile?.role, to: newRole, target_email: oldProfile?.email })
      const allProfiles = await getAllProfiles()
      setProfiles(allProfiles)
    } else {
      alert('Failed to update role')
    }
  }

  const handleDeleteUser = async (userId: string, userEmail?: string) => {
    if (!confirm(`Delete user "${userEmail || userId}"? This will remove all their orders, payments, and support tickets. This cannot be undone.`)) return
    const { error } = await (supabase() as any).from('users').delete().eq('id', userId)
    if (error) {
      alert('Failed to delete user: ' + error.message)
    } else {
      await logAudit('DELETE_USER', 'users', userId, { deleted_email: userEmail })
      setProfiles(prev => prev.filter(p => p.id !== userId))
    }
  }

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Delete order ${orderNumber}? This will also remove associated payments. This cannot be undone.`)) return
    const { error } = await (supabase() as any).from('orders').delete().eq('id', orderId)
    if (error) {
      alert('Failed to delete order: ' + error.message)
    } else {
      await logAudit('DELETE_ORDER', 'orders', orderId, { order_number: orderNumber })
      setOrders(prev => prev.filter(o => o.id !== orderId))
    }
  }

  const filteredUsers = profiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'overview', name: 'System Overview', icon: Shield, badge: 0 },
    { id: 'orders',   name: 'Orders',          icon: Package,      badge: pendingOrdersCount },
    { id: 'support',  name: 'Support Inbox',   icon: MessageSquare, badge: unreadSupportCount },
    { id: 'users',    name: 'User Management', icon: Users,         badge: 0 },
    { id: 'audit',    name: 'Audit Logs',      icon: FileText,      badge: 0 },
    { id: 'settings', name: 'System Settings', icon: Settings,      badge: 0 },
  ]

  const STATUS_COLORS: Record<string, string> = {
    pending:      'bg-yellow-100 text-yellow-800',
    paid:         'bg-blue-100 text-blue-800',
    acknowledged: 'bg-purple-100 text-purple-800',
    completed:    'bg-green-100 text-green-800',
    cancelled:    'bg-red-100 text-red-800',
  }

  const filteredOrders = orders.filter(o => {
    const matchSearch =
      (o.order_number || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.package_name || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.transaction_reference || '').toLowerCase().includes(orderSearch.toLowerCase())
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter
    return matchSearch && matchStatus
  })

  const orderStats = {
    total:       orders.length,
    pending:     orders.filter(o => o.status === 'pending').length,
    paid:        orders.filter(o => o.status === 'paid').length,
    acknowledged:orders.filter(o => o.status === 'acknowledged').length,
    completed:   orders.filter(o => o.status === 'completed').length,
    cancelled:   orders.filter(o => o.status === 'cancelled').length,
  }

  const openClientInfo = async (userId: string) => {
    setSelectedClientId(userId)
    const { data } = await (supabase() as any)
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setClientOrders(data || [])
  }

  const selectedClientProfile = profiles.find(p => p.id === selectedClientId)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-navy-950 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold">InstaPulse Superadmin</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <span className="hidden sm:inline">Superadmin</span>
              </div>
              <button onClick={async () => { await supabase().auth.signOut(); router.push('/login') }} className="text-gray-300 hover:text-white">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <nav className="bg-navy-900 rounded-xl shadow-lg p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); if (tab.id === 'support') fetchUnreadSupport() }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-navy-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {/* ORDER DETAILS MODAL */}
            {selectedOrder && (
              <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onStatusUpdated={(updated) => {
                  setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
                  setSelectedOrder(updated)
                }}
                onViewClient={(uid) => { setSelectedOrder(null); openClientInfo(uid) }}
              />
            )}

            {/* CLIENT INFO MODAL */}
            {selectedClientId && selectedClientProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60" onClick={() => { setSelectedClientId(null); setClientOrders([]) }} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
                  <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-lg font-bold text-gray-900">Client Information</h2>
                    <button onClick={() => { setSelectedClientId(null); setClientOrders([]) }} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Full Name</span><span className="font-semibold">{selectedClientProfile.full_name || '—'}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Email</span><span className="font-semibold">{selectedClientProfile.email || '—'}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Phone</span><span className="font-semibold">{(selectedClientProfile as any).phone || '—'}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Address</span><span className="font-semibold">{(selectedClientProfile as any).address || '—'}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Role</span><span className="font-semibold capitalize">{selectedClientProfile.role}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Joined</span><span className="font-semibold">{new Date(selectedClientProfile.created_at).toLocaleDateString()}</span></div>
                    </div>
                    <h3 className="font-bold text-gray-900">Order History</h3>
                    {clientOrders.length === 0 ? (
                      <p className="text-sm text-gray-500">No orders yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {clientOrders.map((o: any) => (
                          <div key={o.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-semibold">{o.package_name}</p>
                              <p className="text-xs text-gray-500">{o.order_number} · {new Date(o.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-800'}`}>{o.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">System Overview</h2>

                {/* User Stats */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Users</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Users',    value: stats.totalUsers,       icon: Users,    color: 'text-blue-400' },
                      { label: 'Regular Users',  value: stats.totalRegularUsers,icon: Users,    color: 'text-green-400' },
                      { label: 'Admins',         value: stats.totalAdmins,      icon: Shield,   color: 'text-yellow-400' },
                      { label: 'Superadmins',    value: stats.totalSuperadmins, icon: Lock,     color: 'text-red-400' },
                    ].map(card => (
                      <div key={card.label} className="bg-navy-900 rounded-xl p-5 border border-navy-800">
                        <div className="flex items-center space-x-2 mb-2">
                          <card.icon className={`h-5 w-5 ${card.color}`} />
                          <span className="text-xs text-gray-400">{card.label}</span>
                        </div>
                        <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick-look: extra stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders',          value: orderStats.total,        icon: Package,      color: 'text-orange-400' },
                    { label: 'Pending Orders',        value: orderStats.pending,      icon: Package,      color: 'text-yellow-400' },
                    { label: 'Audit Logs',            value: stats.totalAuditLogs,    icon: Database,     color: 'text-purple-400' },
                    { label: 'Unread Support',        value: unreadSupportCount,      icon: MessageSquare, color: 'text-blue-400' },
                  ].map(card => (
                    <div key={card.label} className="bg-navy-900 rounded-xl p-5 border border-navy-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                        <span className="text-xs text-gray-400">{card.label}</span>
                      </div>
                      <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Security Warning */}
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-red-500 mb-2">Security Notice</h3>
                      <p className="text-gray-300">
                        You have full system access. All actions are logged in the audit logs.
                        Use this power responsibly and only make changes when necessary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Orders Dashboard</h2>
                  <button onClick={fetchOrders} className="text-gray-400 hover:text-white text-sm px-3 py-1 border border-navy-700 rounded-lg">↻ Refresh</button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Total',       value: orderStats.total,        color: 'text-white' },
                    { label: 'Pending',      value: orderStats.pending,      color: 'text-yellow-400' },
                    { label: 'Paid',         value: orderStats.paid,         color: 'text-blue-400' },
                    { label: 'Acknowledged', value: orderStats.acknowledged, color: 'text-purple-400' },
                    { label: 'Completed',    value: orderStats.completed,    color: 'text-green-400' },
                    { label: 'Cancelled',    value: orderStats.cancelled,    color: 'text-red-400' },
                  ].map(card => (
                    <div key={card.label} className="bg-navy-900 border border-navy-800 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search order no., package, reference..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-navy-900 border border-navy-800 rounded-lg text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-600 text-sm"
                    />
                  </div>
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-navy-900 border border-navy-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Orders Table */}
                <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-navy-950">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Order No.</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Package</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Payment</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Reference</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-800">
                        {filteredOrders.length === 0 ? (
                          <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No orders found.</td></tr>
                        ) : filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-navy-800 transition-colors">
                            <td className="px-4 py-3 text-xs font-mono text-gray-300">{order.order_number}</td>
                            <td className="px-4 py-3 text-sm text-white">{order.package_name}</td>
                            <td className="px-4 py-3 text-sm text-white">₱{Number(order.total_amount).toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-300 capitalize">{order.payment_method?.replace('_',' ') || '—'}</td>
                            <td className="px-4 py-3 text-xs font-mono text-gray-400">{order.transaction_reference || '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>{order.status}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <button onClick={() => setSelectedOrder(order)} className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs">
                                  <Eye className="h-3.5 w-3.5" /><span>View</span>
                                </button>
                                <button onClick={() => handleDeleteOrder(order.id, order.order_number)} className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-xs">
                                  <Trash2 className="h-3.5 w-3.5" /><span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUPPORT INBOX TAB */}
            {activeTab === 'support' && (
              <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                <SupportPanel isAdmin={true} darkMode={true} />
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">User Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-navy-900 border border-navy-800 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="bg-navy-900 rounded-xl shadow-lg overflow-hidden border border-navy-800">
                  <table className="w-full">
                    <thead className="bg-navy-950">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-800">
                      {filteredUsers.map((profile) => (
                        <tr key={profile.id}>
                          <td className="px-6 py-4 text-sm text-white">{profile.full_name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-white">{profile.email || 'Unknown'}</td>
                          <td className="px-6 py-4">
                            <select
                              value={profile.role}
                              onChange={(e) => handleRoleChange(profile.id, e.target.value as UserRole)}
                              className="px-3 py-2 bg-navy-950 border border-navy-800 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none text-sm text-white"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Superadmin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteUser(profile.id, profile.email ?? undefined)}
                              className="flex items-center space-x-1 text-red-500 hover:text-red-400 text-sm font-medium disabled:opacity-30"
                              disabled={profile.role === 'superadmin'}
                              title={profile.role === 'superadmin' ? 'Cannot delete superadmin accounts' : 'Delete user'}
                            >
                              <Trash2 className="h-4 w-4" /><span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
                  <div className="flex items-center space-x-3">
                    {selectedLogs.length > 0 && (
                      <button
                        onClick={handleDeleteSelectedLogs}
                        disabled={deletingLogs}
                        className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                      >
                        {deletingLogs ? 'Deleting...' : `Delete Selected (${selectedLogs.length})`}
                      </button>
                    )}
                    <span className="text-xs text-gray-400">{auditLogs.length} total logs</span>
                  </div>
                </div>

                {auditLogs.length === 0 ? (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-8 text-center">
                    <Database className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No audit logs yet. Actions like role changes will be recorded here.</p>
                  </div>
                ) : (
                  <div className="bg-navy-900 rounded-xl shadow-lg overflow-hidden border border-navy-800">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-navy-950">
                          <tr>
                            <th className="px-4 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={selectedLogs.length === auditLogs.length && auditLogs.length > 0}
                                onChange={toggleSelectAllLogs}
                                className="w-4 h-4 rounded border-gray-600 bg-navy-800 text-red-600 focus:ring-red-600"
                              />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actor</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Target</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Details</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-800">
                          {auditLogs.map((log) => {
                            const actorName = log.new_data?.actor_name || log.user_id || 'System'
                            const actorRole = log.new_data?.actor_role || '—'
                            const details = log.new_data
                              ? Object.entries(log.new_data)
                                  .filter(([k]) => !['actor_name','actor_email','actor_role'].includes(k))
                                  .map(([k, v]) => `${k}: ${v}`).join(' · ')
                              : '—'
                            return (
                              <tr key={log.id} className={`hover:bg-navy-800 transition-colors ${selectedLogs.includes(log.id) ? 'bg-red-900/20' : ''}`}>
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedLogs.includes(log.id)}
                                    onChange={() => toggleLogSelect(log.id)}
                                    className="w-4 h-4 rounded border-gray-600 bg-navy-800 text-red-600 focus:ring-red-600"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-sm text-white font-medium">{actorName}</p>
                                  {log.new_data?.actor_email && <p className="text-xs text-gray-500">{log.new_data.actor_email}</p>}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                    actorRole === 'superadmin' ? 'bg-red-900 text-red-300' :
                                    actorRole === 'admin' ? 'bg-yellow-900 text-yellow-300' :
                                    'bg-gray-700 text-gray-300'
                                  }`}>{actorRole}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-xs font-mono bg-navy-800 text-blue-300 px-2 py-0.5 rounded">{log.action}</span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-400">{log.target_table}/{log.target_id || '—'}</td>
                                <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate" title={details}>{details || '—'}</td>
                                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                <div className="bg-navy-900 rounded-xl shadow-lg p-6 border border-navy-800">
                  <p className="text-gray-400">System settings panel coming soon...</p>
                </div>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  )
}
