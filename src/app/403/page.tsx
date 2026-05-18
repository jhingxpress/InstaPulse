import Link from 'next/link'
import { Shield, Lock, Home } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8">
            <Lock className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-4xl font-bold text-navy-900 mb-4">
            Access Denied
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-navy-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <Shield className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
