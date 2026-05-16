'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Package, CreditCard, FileText, Settings, LogOut, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'kyc', name: 'KYC Status', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const mockData = {
    package: {
      name: 'Advanced Response',
      price: 22000,
      status: 'Active',
      items: ['1x Alert System', '2x CCTV Camera', '2x Alert Buttons'],
    },
    payment: {
      status: 'Paid',
      amount: 22000,
      method: 'GCash',
      date: '2024-01-15',
    },
    kyc: {
      status: 'Pending',
      submittedAt: '2024-01-15',
    },
    orders: [
      { id: 'ORD-001', package: 'Advanced Response', amount: 22000, status: 'Paid', date: '2024-01-15' },
    ],
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
                <span className="hidden sm:inline">John Doe</span>
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
                <h2 className="text-2xl font-bold text-navy-900">Dashboard Overview</h2>

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
                    <p className="text-2xl font-bold text-navy-900">{mockData.payment.status}</p>
                    <p className="text-sm text-gray-500 mt-1">₱{mockData.payment.amount.toLocaleString()}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="h-8 w-8 text-yellow-600" />
                      <span className="text-gray-600">KYC Status</span>
                    </div>
                    <p className="text-2xl font-bold text-navy-900">{mockData.kyc.status}</p>
                    <p className="text-sm text-gray-500 mt-1">Submitted {mockData.kyc.submittedAt}</p>
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
                        {mockData.package.items.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Order History</h2>
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
                      {mockData.orders.map((order) => (
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

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Account Settings</h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+63 912 345 6789"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        defaultValue="123 Street, City, Philippines"
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
