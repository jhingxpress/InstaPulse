'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Users, FileText, Package, CreditCard, Settings, LogOut, Search, CheckCircle, XCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isAdmin, getAllProfiles, updateUserRole, type Profile } from '@/lib/profile'
import type { UserRole } from '@/lib/profile'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const isAdminUser = await isAdmin()
      if (!isAdminUser) {
        router.push('/dashboard')
        return
      }

      setAuthenticated(true)
      setLoading(false)

      // Fetch all profiles
      const allProfiles = await getAllProfiles()
      setProfiles(allProfiles)
    }

    checkAuth()
  }, [router])

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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'kyc', name: 'KYC Approvals', icon: FileText },
    { id: 'support', name: 'Support Messages', icon: MessageSquare },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const stats = {
    totalUsers: profiles.length,
    totalAdmins: profiles.filter(p => p.role === 'admin').length,
    totalSuperadmins: profiles.filter(p => p.role === 'superadmin').length,
    totalRegularUsers: profiles.filter(p => p.role === 'user').length,
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const success = await updateUserRole(userId, newRole)
    if (success) {
      // Refresh profiles
      const allProfiles = await getAllProfiles()
      setProfiles(allProfiles)
    } else {
      alert('Failed to update role')
    }
  }

  const filteredUsers = profiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleKYCAction = (id: number, action: 'approve' | 'reject') => {
    console.log(`KYC ${action} for request ${id}`)
    // TODO: Implement KYC approval/rejection
  }

  const handleUserAction = (userId: number, action: 'ban' | 'unban') => {
    console.log(`User ${action} for user ${userId}`)
    // TODO: Implement user ban/unban
  }

  const handleSupportResponse = (messageId: number, response: string) => {
    console.log(`Response to message ${messageId}: ${response}`)
    // TODO: Implement support response
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
                    <p className="text-3xl font-bold text-navy-900">{stats.totalUsers}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="h-8 w-8 text-yellow-600" />
                      <span className="text-gray-600">Admins</span>
                    </div>
                    <p className="text-3xl font-bold text-navy-900">{stats.totalAdmins}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="h-8 w-8 text-red-600" />
                      <span className="text-gray-600">Superadmins</span>
                    </div>
                    <p className="text-3xl font-bold text-navy-900">{stats.totalSuperadmins}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="h-8 w-8 text-green-600" />
                      <span className="text-gray-600">Regular Users</span>
                    </div>
                    <p className="text-3xl font-bold text-navy-900">{stats.totalRegularUsers}</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-4">Recent Users</h3>
                  <div className="space-y-4">
                    {profiles.slice(0, 5).map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-navy-900">{profile.full_name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{profile.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            profile.role === 'superadmin' ? 'bg-red-100 text-red-800' :
                            profile.role === 'admin' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {profile.role}
                          </span>
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
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((profile) => (
                        <tr key={profile.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">{profile.full_name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{profile.email || 'Unknown'}</td>
                          <td className="px-6 py-4">
                            <select
                              value={profile.role}
                              onChange={(e) => handleRoleChange(profile.id, e.target.value as UserRole)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none text-sm"
                              disabled={profile.role === 'superadmin'} // Admin cannot change superadmin roles
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin" disabled>Superadmin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => router.push(`/admin/users/${profile.id}`)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              View Details
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
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-gray-600">KYC approval system coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Support Messages</h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-gray-600">Support message system coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Order Management</h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <p className="text-gray-600">Order management system coming soon...</p>
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
