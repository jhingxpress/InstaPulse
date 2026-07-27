'use client'

import { X } from 'lucide-react'
import TermsContent from '@/components/legal/TermsContent'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">InstaPulse Terms and Conditions</h2>
            <p className="text-xs text-gray-500">Emergency Alert &amp; Notification Services Platform</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <TermsContent compact />
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-between items-center bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-400">Last updated: May 2026</p>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}
