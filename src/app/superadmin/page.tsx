'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Users, FileText, Settings, LogOut, Search, CheckCircle, XCircle, AlertTriangle, Database, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { isSuperAdmin, getAllProfiles, updateUserRole, type Profile, type UserRole } from '@/lib/profile'

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      const isSuperAdminUser = await isSuperAdmin()
      if (!isSuperAdminUser) {
        router.push('/403')
        return
      }

      setAuthenticated(true)
      setLoading(false)

      // Fetch all profiles
      const allProfiles = await getAllProfiles()
      setProfiles(allProfiles)

      // Fetch audit logs
      try {
        const { data: logs } = await (supabase() as any)
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        
        if (logs) {
          setAuditLogs(logs)
        }
      } catch (error) {
        console.log('Audit logs table may not exist')
      }
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

  const stats = {
    totalUsers: profiles.length,
    totalAdmins: profiles.filter(p => p.role === 'admin').length,
    totalSuperadmins: profiles.filter(p => p.role === 'superadmin').length,
    totalRegularUsers: profiles.filter(p => p.role === 'user').length,
    totalAuditLogs: auditLogs.length,
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase().auth.admin.deleteUser(userId)
    if (error) {
      alert('Failed to delete user: ' + error.message)
    } else {
      // Refresh profiles
      const allProfiles = await getAllProfiles()
      setProfiles(allProfiles)
    }
  }

  const filteredUsers = profiles.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'overview', name: 'System Overview', icon: Shield },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'audit', name: 'Audit Logs', icon: FileText },
    { id: 'settings', name: 'System Settings', icon: Settings },
  ]

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
            <nav className="bg-navy-900 rounded-xl shadow-lg p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-navy-800'
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
                <h2 className="text-2xl font-bold text-white">System Overview</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-navy-900 rounded-xl shadow-lg p-6 border border-navy-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="h-8 w-8 text-blue-400" />
                      <span className="text-gray-400">Total Users</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  </div>

                  <div className="bg-navy-900 rounded-xl shadow-lg p-6 border border-navy-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="h-8 w-8 text-yellow-400" />
                      <span className="text-gray-400">Admins</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalAdmins}</p>
                  </div>

                  <div className="bg-navy-900 rounded-xl shadow-lg p-6 border border-navy-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <Lock className="h-8 w-8 text-red-400" />
                      <span className="text-gray-400">Superadmins</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalSuperadmins}</p>
                  </div>

                  <div className="bg-navy-900 rounded-xl shadow-lg p-6 border border-navy-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="h-8 w-8 text-green-400" />
                      <span className="text-gray-400">Regular Users</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalRegularUsers}</p>
                  </div>

                  <div className="bg-navy-900 rounded-xl shadow-lg p-6 border border-navy-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <Database className="h-8 w-8 text-purple-400" />
                      <span className="text-gray-400">Audit Logs</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalAuditLogs}</p>
                  </div>
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
                              onClick={() => handleDeleteUser(profile.id)}
                              className="text-red-500 hover:text-red-400 text-sm font-medium"
                            >
                              Delete
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Audit Logs</h2>

                <div className="bg-navy-900 rounded-xl shadow-lg overflow-hidden border border-navy-800">
                  <table className="w-full">
                    <thead className="bg-navy-950">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Action</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Target</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-800">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 text-sm text-white">{log.action}</td>
                          <td className="px-6 py-4 text-sm text-white">{log.target_table}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{log.user_id || 'System'}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
