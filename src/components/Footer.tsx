import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold">InstaPulse</span>
            </div>
            <p className="text-gray-400 text-sm">
              Smart emergency alert and monitoring system for communities and organizations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Packages</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>admin@instapulse.site</li>
              <li>+63 939 920 8711</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-800 mt-8 pt-8 text-center text-gray-400 text-sm space-y-2">
          <p>&copy; 2026 InstaPulse. All rights reserved.</p>
          <p className="text-xs text-gray-500">
            This site is protected by reCAPTCHA and the Google{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </a>
            {' '}and{' '}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-400 transition-colors"
            >
              Terms of Service
            </a>
            {' '}apply.
          </p>
        </div>
      </div>
    </footer>
  )
}
