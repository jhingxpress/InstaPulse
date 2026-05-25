'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, Package, CreditCard, FileText, Settings, LogOut, User, CheckCircle, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PackageModal from '@/components/PackageModal'
import PaymentModal from '@/components/PaymentModal'
import SupportPanel from '@/components/SupportPanel'

function ClientDashboard() {
  const searchParams = useSearchParams()
  const purchaseParam = searchParams.get('purchase')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activePackage, setActivePackage] = useState<any>(null)
  const [activePayment, setActivePayment] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [unreadSupportCount, setUnreadSupportCount] = useState(0)
  const [profile, setProfile] = useState<any>(null)
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [settingsForm, setSettingsForm] = useState({ full_name: '', phone: '', address: '' })
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [settingsSuccess, setSettingsSuccess] = useState('')
  const [autoTriggered, setAutoTriggered] = useState(false)
  const lastActivityRef = useRef(Date.now())

  const fetchUnreadSupport = useCallback(async (userId: string) => {
    const { data } = await (supabase() as any)
      .from('support_tickets')
      .select('unread_user')
      .eq('user_id', userId)
      .gt('unread_user', 0)
    setUnreadSupportCount(data ? data.reduce((sum: number, t: any) => sum + (t.unread_user || 0), 0) : 0)
  }, [])

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase().auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      // Fetch orders from Supabase
      const { data: userOrders } = await (supabase() as any)
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (userOrders) {
        setOrders(userOrders)
        // Most recent paid/pending order = active package
        const latestOrder = userOrders.find((o: any) =>
          ['pending', 'paid', 'acknowledged', 'completed'].includes(o.status)
        )
        if (latestOrder) {
          setActivePackage({
            id: latestOrder.package_id,
            name: latestOrder.package_name,
            price: latestOrder.total_amount,
            status: latestOrder.status,
          })
          setActivePayment({
            status: latestOrder.status,
            amount: latestOrder.total_amount,
            method: latestOrder.payment_method,
            reference: latestOrder.transaction_reference,
            date: new Date(latestOrder.created_at).toLocaleDateString(),
          })
        }
      }
      const { data: userProfile } = await (supabase() as any)
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      if (userProfile) {
        setProfile(userProfile)
        setSettingsForm({
          full_name: userProfile.full_name || '',
          phone: userProfile.phone || '',
          address: userProfile.address || '',
        })
      }

      await fetchUnreadSupport(user.id)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [router, fetchUnreadSupport])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Auto-open PaymentModal when navigated from packages page with ?purchase=<name>
  useEffect(() => {
    if (!purchaseParam || !user || loading || autoTriggered) return
    setAutoTriggered(true)

    const triggerPurchase = async () => {
      const { data: pkgs } = await (supabase() as any)
        .from('packages')
        .select('id, name, description, price')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (!pkgs) return

      const withItems = await Promise.all(
        pkgs.map(async (pkg: any) => {
          const { data: items } = await (supabase() as any)
            .from('package_items')
            .select('item_name, quantity')
            .eq('package_id', pkg.id)
          return { ...pkg, items: items || [] }
        })
      )

      const match = withItems.find((p: any) =>
        p.name.toLowerCase().includes(purchaseParam.toLowerCase())
      )

      if (match) {
        setSelectedPackage(match)
        setShowPaymentModal(true)
        router.replace('/dashboard')
      }
    }

    triggerPurchase()
  }, [purchaseParam, user, loading, autoTriggered, router])

  // Idle auto-refresh: refresh data after 3 minutes of inactivity
  useEffect(() => {
    const trackActivity = () => { lastActivityRef.current = Date.now() }
    window.addEventListener('mousemove', trackActivity)
    window.addEventListener('keydown', trackActivity)
    window.addEventListener('click', trackActivity)

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= 3 * 60 * 1000) {
        fetchDashboardData()
        lastActivityRef.current = Date.now()
      }
    }, 30_000)

    return () => {
      window.removeEventListener('mousemove', trackActivity)
      window.removeEventListener('keydown', trackActivity)
      window.removeEventListener('click', trackActivity)
      clearInterval(interval)
    }
  }, [fetchDashboardData])

  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg)
    setShowPackageModal(false)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (order: any) => {
    setShowPaymentModal(false)
    setSelectedPackage(null)
    fetchDashboardData()
    setActiveTab('orders')
  }

  const handleCancelOrder = (orderId: string) => {
    setCancelOrderId(orderId)
  }

  const handleConfirmCancel = async () => {
    if (!cancelOrderId) return
    setCancelling(true)
    try {
      const { error } = await (supabase() as any)
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', cancelOrderId)
      if (error) console.error('Cancel order error:', error)
      else fetchDashboardData()
    } finally {
      setCancelling(false)
      setCancelOrderId(null)
    }
  }

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsError('')
    setSettingsSuccess('')

    if (profile?.updated_at && profile?.created_at) {
      const isFirstEdit = Math.abs(
        new Date(profile.updated_at).getTime() - new Date(profile.created_at).getTime()
      ) < 5 * 60 * 1000
      if (!isFirstEdit) {
        const daysSince = (Date.now() - new Date(profile.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        if (daysSince < 15) {
          const nextEdit = new Date(new Date(profile.updated_at).getTime() + 15 * 24 * 60 * 60 * 1000)
          setSettingsError(`You can only edit your information once every 15 days. Next edit available on ${nextEdit.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`)
          return
        }
      }
    }

    setSettingsSaving(true)
    try {
      const { error } = await (supabase() as any)
        .from('users')
        .update({
          full_name: settingsForm.full_name,
          phone: settingsForm.phone,
          address: settingsForm.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        setSettingsError('Failed to save changes. Please try again.')
      } else {
        await supabase().auth.updateUser({
          data: { full_name: settingsForm.full_name, phone: settingsForm.phone, address: settingsForm.address },
        })
        setSettingsSuccess('Your information has been updated successfully.')
        fetchDashboardData()
      }
    } catch {
      setSettingsError('An unexpected error occurred.')
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase().auth.signOut()
    router.push('/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'acknowledged': return 'bg-purple-100 text-purple-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      {/* Modals */}
      <PackageModal
        open={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        onSelectPackage={handleSelectPackage}
      />
      <PaymentModal
        open={showPaymentModal}
        pkg={selectedPackage}
        onClose={() => { setShowPaymentModal(false); setSelectedPackage(null) }}
        onBack={() => { setShowPaymentModal(false); setShowPackageModal(true) }}
        onSuccess={handlePaymentSuccess}
      />

      {cancelOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !cancelling && setCancelOrderId(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setCancelOrderId(null)}
                disabled={cancelling}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {cancelling
                  ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Cancelling...</span></>
                  : <span>Yes, Cancel</span>
                }
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <Shield className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold">InstaPulse</span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden sm:inline">
                    {loading ? 'Loading...' : user?.user_metadata?.full_name || user?.email || 'User'}
                  </span>
                </div>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white">
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
              <nav className="bg-white rounded-xl shadow-lg p-4 space-y-2">
                {[
                  { id: 'overview', name: 'Overview',  icon: Shield,       badge: 0 },
                  { id: 'orders',   name: 'Orders',    icon: Package,      badge: 0 },
                  { id: 'support',  name: 'Support',   icon: MessageSquare, badge: unreadSupportCount },
                  { id: 'settings', name: 'Settings',  icon: Settings,     badge: 0 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
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
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-navy-900">Dashboard Overview</h2>

                  {!activePackage ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-navy-900 mb-2">No Active Package</h3>
                      <p className="text-gray-600 mb-6">Choose a security package to get started with InstaPulse</p>
                      <button
                        onClick={() => setShowPackageModal(true)}
                        className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Choose a Package
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <Package className="h-8 w-8 text-red-600" />
                            <span className="text-gray-600">Active Package</span>
                          </div>
                          <p className="text-2xl font-bold text-navy-900">{activePackage.name}</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(activePackage.status)}`}>
                            {activePackage.status}
                          </span>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <CreditCard className="h-8 w-8 text-green-600" />
                            <span className="text-gray-600">Payment Status</span>
                          </div>
                          <p className="text-2xl font-bold text-navy-900 capitalize">{activePayment?.status || 'Pending'}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {activePayment ? `₱${Number(activePayment.amount).toLocaleString()}` : 'Not paid'}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <FileText className="h-8 w-8 text-yellow-600" />
                            <span className="text-gray-600">KYC Status</span>
                          </div>
                          <p className="text-2xl font-bold text-navy-900">Pending</p>
                          <p className="text-sm text-gray-500 mt-1">Not submitted</p>
                        </div>
                      </div>

                      {/* Package Details */}
                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-navy-900 mb-4">Package Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Package Name</span>
                            <span className="font-semibold">{activePackage.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price</span>
                            <span className="font-semibold">₱{Number(activePackage.price).toLocaleString()}</span>
                          </div>
                          {activePayment?.method && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment Method</span>
                              <span className="font-semibold capitalize">{activePayment.method.replace('_', ' ')}</span>
                            </div>
                          )}
                          {activePayment?.reference && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Reference No.</span>
                              <span className="font-semibold font-mono text-sm">{activePayment.reference}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order Date</span>
                            <span className="font-semibold">{activePayment?.date}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-navy-900">Order History</h2>
                    <button
                      onClick={() => setShowPackageModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                    >
                      + New Order
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-navy-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
                      <button
                        onClick={() => setShowPackageModal(true)}
                        className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Browse Packages
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order No.</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Package</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.order_number}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{order.package_name}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">₱{Number(order.total_amount).toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-gray-600 capitalize">{order.payment_method?.replace('_', ' ') || '—'}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="text-xs text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 px-3 py-1 rounded-full font-medium transition-colors"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SUPPORT TAB */}
              {activeTab === 'support' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <SupportPanel isAdmin={false} darkMode={false} />
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (() => {
                const isFirstEdit = !profile?.updated_at || !profile?.created_at ||
                  Math.abs(new Date(profile.updated_at).getTime() - new Date(profile.created_at).getTime()) < 5 * 60 * 1000
                const daysSinceEdit = profile?.updated_at
                  ? (Date.now() - new Date(profile.updated_at).getTime()) / (1000 * 60 * 60 * 24)
                  : 999
                const canEdit = isFirstEdit || daysSinceEdit >= 15
                const nextEditDate = profile?.updated_at
                  ? new Date(new Date(profile.updated_at).getTime() + 15 * 24 * 60 * 60 * 1000)
                  : null
                return (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-navy-900">Account Settings</h2>

                    {!canEdit && nextEditDate && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          You can only edit your information once every 15 days. Next edit available on{' '}
                          <strong>{nextEditDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                        </p>
                      </div>
                    )}

                    {settingsError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{settingsError}</p>
                      </div>
                    )}

                    {settingsSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">{settingsSuccess}</p>
                      </div>
                    )}

                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <form onSubmit={handleSettingsSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={settingsForm.full_name}
                            onChange={e => setSettingsForm(f => ({ ...f, full_name: e.target.value }))}
                            disabled={!canEdit}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={settingsForm.phone}
                            onChange={e => setSettingsForm(f => ({ ...f, phone: e.target.value }))}
                            disabled={!canEdit}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            value={settingsForm.address}
                            onChange={e => setSettingsForm(f => ({ ...f, address: e.target.value }))}
                            disabled={!canEdit}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!canEdit || settingsSaving}
                          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {settingsSaving
                            ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Saving...</span></>
                            : <span>Save Changes</span>
                          }
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })()}
            </motion.main>
          </div>
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense>
      <ClientDashboard />
    </Suspense>
  )
}
