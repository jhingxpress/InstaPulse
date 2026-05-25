'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Cookie, X, ShieldCheck } from 'lucide-react'

const CONSENT_KEY = 'instapulse_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (!stored) setVisible(true)
    } catch {
      // localStorage not available (SSR or privacy mode) — don't show
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }))
    } catch {
      // ignore write errors
    }
    setVisible(false)
  }

  const dismiss = () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }))
    } catch {
      // ignore
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Cookie className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-bold text-gray-900">Cookies</span>
              </div>
              <button
                onClick={dismiss}
                aria-label="Dismiss cookie banner"
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 pb-4">
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                We use <strong className="text-gray-700">essential cookies only</strong> — for secure login sessions and basic site functionality.
                No tracking, no ads, no personal data stored in cookies.
              </p>

              <div className="flex items-center space-x-2 mb-4 p-2.5 bg-green-50 border border-green-100 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">
                  Only <strong>essential cookies</strong> — zero tracking
                </p>
              </div>

              <button
                onClick={accept}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Accept Essential Cookies
              </button>

              <p className="text-center mt-2.5 text-xs text-gray-400">
                <Link href="/privacy" className="hover:text-red-600 underline underline-offset-2 transition-colors">
                  Privacy Policy
                </Link>
                {' · '}
                <Link href="/policy" className="hover:text-red-600 underline underline-offset-2 transition-colors">
                  Site Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
