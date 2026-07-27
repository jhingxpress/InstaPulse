import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import TermsContent from '@/components/legal/TermsContent'

export const metadata: Metadata = {
  title: 'Terms and Conditions | InstaPulse',
  description:
    'Review the terms and conditions governing the use of InstaPulse emergency alert and notification services.',
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-navy-900 mb-2">Terms and Conditions</h1>
          <p className="text-lg text-gray-500">
            Emergency Alert &amp; Notification Services Platform
          </p>
        </div>

        <TermsContent />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: May 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
