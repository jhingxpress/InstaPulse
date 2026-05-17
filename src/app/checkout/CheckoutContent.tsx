'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Shield, CreditCard, Smartphone, Building2, Check, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('package')
  const [selectedPayment, setSelectedPayment] = useState('gcash')
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase().auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setAuthenticated(true)
      }
    }

    checkAuth()
  }, [router])

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const packages = [
    { id: '1', name: 'Basic Protection', price: 20000 },
    { id: '2', name: 'Standard Protection', price: 21000 },
    { id: '3', name: 'Advanced Response', price: 22000 },
    { id: '4', name: 'Enterprise Security', price: 25000 },
  ]

  const selectedPackage = packages.find((p) => p.id === packageId) || packages[2]

  const paymentMethods = [
    { id: 'gcash', name: 'GCash', icon: Smartphone, color: 'bg-blue-500' },
    { id: 'maya', name: 'Maya', icon: Smartphone, color: 'bg-orange-500' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, color: 'bg-purple-500' },
    { id: 'banking', name: 'Online Banking', icon: Building2, color: 'bg-green-500' },
  ]

  const handlePayment = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions before proceeding.')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement PayMongo payment integration
      console.log('Processing payment:', { package: selectedPackage, method: selectedPayment })
      // For now, redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Checkout</h1>
            <p className="text-xl text-gray-600">Complete your purchase</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Order Summary</h2>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900">{selectedPackage.name}</h3>
                    <p className="text-sm text-gray-600">Security Package</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₱{selectedPackage.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Installation Fee</span>
                    <span>₱0</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₱0</span>
                  </div>
                  <div className="flex justify-between font-bold text-navy-900 text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₱{selectedPackage.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Professional installation included</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>1-year warranty</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Payment Method</h2>

              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPayment === method.id
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 ${method.color} rounded-lg`}>
                        <method.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-navy-900">{method.name}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedPayment === method.id
                            ? 'border-red-600 bg-red-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <Check className="h-4 w-4 text-white m-1" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You will be redirected to the payment gateway to complete
                  your transaction securely.
                </p>
              </div>

              {/* Policy and Agreement */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3 mb-4">
                  <FileText className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">Terms and Conditions</h3>
                    <button
                      onClick={() => setShowPolicy(!showPolicy)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      {showPolicy ? 'Hide' : 'View'} full policy
                    </button>
                  </div>
                </div>

                {showPolicy && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 text-sm text-gray-600 space-y-3"
                  >
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-navy-900 mb-2">Client Responsibilities</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Provide accurate information for installation</li>
                        <li>Ensure proper access to installation location</li>
                        <li>Maintain the security equipment properly</li>
                        <li>Report any issues within 24 hours</li>
                        <li>Pay all fees on time as agreed</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-navy-900 mb-2">Seller Responsibilities</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Provide professional installation service</li>
                        <li>Ensure equipment quality and functionality</li>
                        <li>Offer 24/7 customer support</li>
                        <li>Honor warranty terms as specified</li>
                        <li>Protect client data and privacy</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-navy-900 mb-2">Payment Terms</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Full payment required before installation</li>
                        <li>All payments are non-refundable after 7 days</li>
                        <li>Installation fee is included in package price</li>
                        <li>Additional charges may apply for extra services</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-navy-900 mb-2">Warranty</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>1-year warranty on all equipment</li>
                        <li>Free replacement for defective units</li>
                        <li>Labor warranty for 6 months</li>
                        <li>Warranty void if equipment is tampered with</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                <div className="mt-4 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-600 mt-0.5"
                  />
                  <label htmlFor="agreement" className="text-sm text-gray-600">
                    I have read and agree to the terms and conditions, client responsibilities, seller responsibilities, payment terms, and warranty policy.
                  </label>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !agreed}
                className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ₱${selectedPackage.price.toLocaleString()}`}
              </button>

              <div className="mt-6 text-center">
                <Link href="/packages" className="text-sm text-gray-600 hover:text-red-600">
                  ← Back to packages
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
