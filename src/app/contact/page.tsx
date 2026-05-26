'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Shield, Mail, Phone, MapPin, Facebook, MessageCircle, Send, Camera, ChevronDown, ChevronUp, ArrowRight, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function ContactPageContent() {
  const [authenticated, setAuthenticated] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase().auth.getUser()
      setAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  const handleDashboardClick = () => {
    if (authenticated) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/login'
    }
  }

  const faqs = [
    {
      question: 'How do I contact support?',
      answer: 'Subscribers can send support requests directly through the Support Messages feature in their InstaPulse dashboard.'
    },
    {
      question: 'How long does support take?',
      answer: 'Most inquiries receive a response within 24 hours during business days.'
    },
    {
      question: 'Can I request a demo?',
      answer: 'Yes. Contact us through phone or email to schedule a demonstration.'
    },
    {
      question: 'Do you offer installation services?',
      answer: 'Yes. Installation is included with eligible package purchases.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
              Need assistance or have questions about InstaPulse? We're here to help.
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Whether you're interested in our packages, partnership opportunities, or technical support, our team is ready to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-navy-900 mb-4 text-center">Support Options</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Customers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Already an InstaPulse Subscriber?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Use the Support Messages feature inside your dashboard to communicate directly with our support team and track responses in one place.
              </p>
              <button
                onClick={handleDashboardClick}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Call Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Call Us</h3>
              </div>
              <p className="text-2xl font-bold text-navy-900 mb-2">+63 939 920 8711</p>
              <p className="text-gray-600">Speak directly with our team for urgent concerns.</p>
            </motion.div>

            {/* Email Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Email Us</h3>
              </div>
              <p className="text-xl font-bold text-navy-900 mb-2">admin@instapulse.site</p>
              <p className="text-gray-600">For sales inquiries, partnerships, and general questions.</p>
            </motion.div>

            {/* Office Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Office Location</h3>
              </div>
              <p className="text-gray-700 font-medium">
                1st Crumb, Digos City<br />
                Davao del Sur, Philippines
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Follow Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Follow Us</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://www.facebook.com/share/1BS8GaxJhz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <Facebook className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-navy-900">Facebook</span>
            </a>

            <a
              href="https://t.me/instapulsedavsur"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <Send className="h-6 w-6 text-blue-600" />
              <span className="font-medium text-navy-900">Telegram</span>
            </a>

            <a
              href="https://instagram.com/instapulse"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <Camera className="h-6 w-6 text-pink-600" />
              <span className="font-medium text-navy-900">Instagram</span>
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 pb-4">
              <h2 className="text-2xl font-bold text-navy-900 mb-1">Find Us</h2>
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
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-navy-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
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
