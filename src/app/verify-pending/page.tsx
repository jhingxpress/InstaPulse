'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield, Mail, RefreshCw, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function VerifyPendingContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState('')

  const handleResend = async () => {
    setResending(true)
    setResendStatus('idle')

    try {
      const targetEmail = emailParam
      if (!targetEmail) {
        setResendStatus('error')
        setResendMessage('Email address not found. Please register again.')
        return
      }

      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      })
      const data = await res.json()

      if (!res.ok) {
        setResendStatus('error')
        setResendMessage(data.error || 'Failed to resend. Please try again later.')
      } else {
        setResendStatus('success')
        setResendMessage('Verification email sent! Check your inbox.')
      }
    } catch {
      setResendStatus('error')
      setResendMessage('Network error. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <Shield className="h-8 w-8 text-red-600" />
        </div>

        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full mb-4">
          <Mail className="h-7 w-7 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
        <p className="text-gray-500 mb-2">
          We sent a verification link to your email address.
        </p>
        <p className="text-gray-500 mb-8 text-sm">
          Click the link in the email to activate your account. The link expires in <strong>1 hour</strong>.
        </p>

        {resendStatus === 'success' && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-sm text-green-700">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{resendMessage}</span>
          </div>
        )}

        {resendStatus === 'error' && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {resendMessage}
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={resending || resendStatus === 'success'}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
          <span>{resending ? 'Sending…' : 'Resend Verification Email'}</span>
        </button>

        <p className="text-sm text-gray-400">
          Wrong account?{' '}
          <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function VerifyPendingPage() {
  return (
    <Suspense>
      <VerifyPendingContent />
    </Suspense>
  )
}
