'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Users, FileText, Package, CreditCard, Settings, LogOut, Search, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'kyc', name: 'KYC Approvals', icon: FileText },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const mockData = {
    stats: {
      totalUsers: 150,
      pendingKYC: 12,
      totalOrders: 45,
      totalRevenue: 990000,
    },
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active', kycStatus: 'approved' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'client', status: 'active', kycStatus: 'pending' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'client', status: 'active', kycStatus: 'approved' },
    ],
    kycRequests: [
      { id: 1, userId: 2, userName: 'Jane Smith', submittedAt: '2024-01-15', status: 'pending' },
      { id: 2, userId: 4, userName: 'Alice Brown', submittedAt: '2024-01-14', status: 'pending' },
    ],
    orders: [
      { id: 'ORD-001', userId: 1, userName: 'John Doe', package: 'Advanced Response', amount: 22000, status: 'paid', date: '2024-01-15' },
      { id: 'ORD-002', userId: 2, userName: 'Jane Smith', package: 'Basic Protection', amount: 20000, status: 'pending', date: '2024-01-14' },
    ],
  }

  const handleKYCAction = (id: number, action: 'approve' | 'reject') => {
    console.log(`KYC ${action} for request ${id}`)
    // TODO: Implement KYC approval/rejection
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold">InstaPulse Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="hidden sm:inline">Admin</span>
              </div>
              <Link href="/login" className="text-gray-300 hover:text-white">
                <LogOut className="h-5 w-5" />
              </Link>
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
                <h2 className="text-2xl font-bold text-navy-900">Admin Dashboard</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="h-8 w-8 text-blue-600" />
                      <span className="text-gray-600">Total Users</span>
                    </div>
                    <p className="text-3xl font-bold text-navy-900">{mockData.stats.totalUsers}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="h-8 w-8 text-yellow-600" />
                      <span className="text-gray-600">Pending KYC</span>
                    </div>
                    <p className="text-3xl font-bold text-navy-900">{mockData.stats.pendingKYC}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Package className="h-8 w-8 text-green-600" />
                      <span className="text-gray-600">Total Orders</span>
                    </div>
                    <p className="text-3xl font-bold text-navy-900">{mockData.stats.totalOrders}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <CreditCard className="h-8 w-8 text-purple-600" />
                      <span className="text-gray-600">Revenue</span>
                    </div>
                    <p className="text-3xl font-bold text-navy-900">₱{(mockData.stats.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {mockData.orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-navy-900">{order.userName}</p>
                          <p className="text-sm text-gray-600">Ordered {order.package}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₱{order.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-navy-900">User Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">KYC Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockData.users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 capitalize">{user.role}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              user.kycStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.kycStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">KYC Approvals</h2>

                <div className="space-y-4">
                  {mockData.kycRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-navy-900">{request.userName}</h3>
                          <p className="text-sm text-gray-600">Submitted: {request.submittedAt}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {request.status}
                        </span>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleKYCAction(request.id, 'approve')}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleKYCAction(request.id, 'reject')}
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                        >
                          <XCircle className="h-5 w-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Order Management</h2>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Package</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockData.orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.userName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.package}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">₱{order.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Payment Monitoring</h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-gray-600">Payment monitoring dashboard coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Admin Settings</h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-gray-600">Admin settings panel coming soon...</p>
                </div>
              </div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  )
}
