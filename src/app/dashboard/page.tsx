'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Package, CreditCard, FileText, Settings, LogOut, User, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ClientDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'kyc', name: 'KYC Status', icon: FileText },
    { id: 'support', name: 'Support', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const mockData: {
    package: any | null
    payment: any | null
    kyc: {
      status: string
      submittedAt: string | null
    }
    orders: any[]
  } = {
    package: null, // No package by default
    payment: null,
    kyc: {
      status: 'Pending',
      submittedAt: null,
    },
    orders: [],
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase().auth.getUser()
        if (user) {
          setUser(user)
          
          // Load user profile from localStorage
          const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
          if (userProfile.package_id) {
            mockData.package = {
              id: userProfile.package_id,
              name: userProfile.package_name,
              price: userProfile.package_price,
            }
            mockData.payment = {
              status: userProfile.payment_status || 'paid',
              amount: userProfile.package_price,
              date: new Date(userProfile.updated_at).toLocaleDateString(),
            }
          }
          
          // Load orders from localStorage
          const orders = JSON.parse(localStorage.getItem('orders') || '[]')
          const userOrders = orders.filter((order: any) => order.user_id === user.id)
          mockData.orders = userOrders.map((order: any) => ({
            id: order.id,
            package: order.package_name,
            amount: order.amount,
            status: order.status,
            date: new Date(order.created_at).toLocaleDateString(),
          }))
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase().auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold">InstaPulse</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden sm:inline">
                  {loading ? 'Loading...' : user?.user_metadata?.fullname || user?.email || 'User'}
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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Dashboard Overview</h2>

                {!mockData.package ? (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-navy-900 mb-2">No Active Package</h3>
                    <p className="text-gray-600 mb-6">Choose a security package to get started with InstaPulse</p>
                    <Link
                      href="/packages"
                      className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Choose a Package
                    </Link>
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
                        <p className="text-2xl font-bold text-navy-900">{mockData.package.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{mockData.package.status}</p>
                      </div>

                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <CreditCard className="h-8 w-8 text-green-600" />
                          <span className="text-gray-600">Payment Status</span>
                        </div>
                        <p className="text-2xl font-bold text-navy-900">{mockData.payment?.status || 'Pending'}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {mockData.payment ? `₱${mockData.payment.amount.toLocaleString()}` : 'Not paid'}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <FileText className="h-8 w-8 text-yellow-600" />
                          <span className="text-gray-600">KYC Status</span>
                        </div>
                        <p className="text-2xl font-bold text-navy-900">{mockData.kyc.status}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {mockData.kyc.submittedAt ? `Submitted ${mockData.kyc.submittedAt}` : 'Not submitted'}
                        </p>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-navy-900 mb-4">Package Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package Name</span>
                          <span className="font-semibold">{mockData.package.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price</span>
                          <span className="font-semibold">₱{mockData.package.price.toLocaleString()}</span>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-gray-600 mb-2">Included Items:</p>
                          <ul className="space-y-1">
                            {mockData.package.items.map((item: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Order History</h2>
                {mockData.orders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-navy-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
                    <Link
                      href="/packages"
                      className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Browse Packages
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Package</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockData.orders.map((order: any) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{order.package}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">₱{order.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">KYC Verification Status</h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-navy-900">Pending Review</h3>
                      <p className="text-gray-600">Your documents are being reviewed by our team</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Expected Timeline:</strong> 24-48 hours for verification completion.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Support Messages</h2>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-navy-900 mb-4">Send a Support Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        placeholder="Brief description of your issue"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        placeholder="Describe your issue in detail..."
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-navy-900 mb-4">Your Messages</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">No support messages yet</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Account Settings</h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.user_metadata?.fullname || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue={user?.user_metadata?.phone || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        defaultValue={user?.user_metadata?.address || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  )
}
