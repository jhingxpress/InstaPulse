'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Shield, Mail, Phone, MapPin, Facebook, MessageCircle, Send, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function ContactPageContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase().auth.getUser()
      setAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    // Check if returning from login/register with saved form data
    const savedData = sessionStorage.getItem('contactFormData')
    if (savedData && authenticated) {
      const parsed = JSON.parse(savedData)
      setFormData(parsed)
      sessionStorage.removeItem('contactFormData')
      // Auto-submit after a short delay
      setTimeout(() => {
        handleSubmit(new Event('submit') as any)
      }, 500)
    }
  }, [authenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check authentication
    if (!authenticated) {
      // Save form data to sessionStorage
      sessionStorage.setItem('contactFormData', JSON.stringify(formData))
      // Redirect to login
      router.push('/login?redirect=/contact')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase().auth.getUser()
      if (!user) {
        sessionStorage.setItem('contactFormData', JSON.stringify(formData))
        router.push('/login?redirect=/contact')
        return
      }

      // Create support ticket
      const { error } = await (supabase() as any)
        .from('support_tickets')
        .insert({
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: 'open',
          unread_admin: 1,
          unread_user: 0,
        })

      if (error) throw error

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      console.error('Form submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with our team for inquiries, support, or partnership opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Send us a Message</h2>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                >
                  Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="Juan Dela Cruz"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="+63 939 920 8711"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                        <Mail className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 mb-1">Email</h3>
                      <p className="text-gray-600">admin@instapulse.site</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                        <Phone className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 mb-1">Phone</h3>
                      <p className="text-gray-600">+63 939 920 8711</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                        <MapPin className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 mb-1">Office Location</h3>
                      <p className="text-gray-600">
                        1st Crumb, Digos City<br />
                        Davao del Sur, Philippines
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Follow Us</h2>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://facebook.com/instapulse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Facebook className="h-6 w-6 text-blue-600" />
                    <span className="font-medium text-navy-900">Facebook</span>
                  </a>

                  <a
                    href="https://m.me/instapulse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                    <span className="font-medium text-navy-900">Messenger</span>
                  </a>

                  <a
                    href="https://t.me/instapulse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Send className="h-6 w-6 text-blue-600" />
                    <span className="font-medium text-navy-900">Telegram</span>
                  </a>

                  <a
                    href="https://instagram.com/instapulse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <Camera className="h-6 w-6 text-pink-600" />
                    <span className="font-medium text-navy-900">Instagram</span>
                  </a>
                </div>
              </div>

              {/* Google Map */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 pb-4">
                  <h2 className="text-xl font-bold text-navy-900 mb-1">Find Us on Map</h2>
                  <p className="text-sm text-gray-500">Digos City, Davao del Sur, Philippines</p>
                </div>
                <div className="h-72">
                  <iframe
                    src="https://maps.google.com/maps?q=6.753052349431254,125.36105930450685&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="px-6 py-3 border-t border-gray-100">
                  <a
                    href="https://maps.google.com/?q=6.753052349431254,125.36105930450685"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold">InstaPulse</span>
              </div>
              <p className="text-gray-400">
                Advanced emergency alert and monitoring system for communities and
                establishments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/packages" className="hover:text-white transition-colors">Packages</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>admin@instapulse.site</li>
                <li>+63 939 920 8711</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 InstaPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-white to-gray-50"><Navigation /></div>}>
      <ContactPageContent />
    </Suspense>
  )
}
