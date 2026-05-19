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
    { id: '1', name: 'Basic Package', price: 20000 },
    { id: '2', name: 'Standard Package', price: 21000 },
    { id: '3', name: 'Advanced Package', price: 22000 },
    { id: '4', name: 'Enterprise Package', price: 25000 },
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

    // Redirect to payment page with package and payment method
    router.push(`/payment?package=${packageId}&method=${selectedPayment}`)
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
                    className="mt-4 text-sm text-gray-600 space-y-3 max-h-96 overflow-y-auto"
                  >
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-navy-900 mb-2">TERMS AND CONDITIONS AGREEMENT</h4>
                      <p className="text-xs text-gray-500 mb-2">This Terms and Conditions Agreement is entered into by and between:</p>
                      <p className="text-xs text-gray-500 mb-2">Client: ___________________________</p>
                      <p className="text-xs text-gray-500 mb-2">Developer: ___________________________</p>
                      <p className="text-xs text-gray-500 mb-2">Project: Real-Time Alert and Notification System (Project RAN)</p>
                      <p className="text-xs text-gray-500 mb-4">Effective Date: ___________________________</p>
                      
                      <div className="space-y-3 text-xs">
                        <div><strong>1. ACCEPTANCE OF TERMS</strong><p>By availing and using the Project RAN, the Client agrees to be bound by all the terms and conditions stated herein.</p></div>
                        <div><strong>2. DESCRIPTION OF SERVICE</strong><p>Project RAN is a real-time emergency alert system that enables the Client to send immediate alerts to the PICC through a push-button device with GPS tracking and CCTV verification for rapid response.</p></div>
                        <div><strong>3. Scope of Work</strong><p>The Developer agrees to design, install, and implement the Real-Time Alert and Notification System, including devices, CCTV integration, and connectivity with the Provincial Integrated Command Center (PICC).</p></div>
                        <div><strong>4. Subscription and Package Cost</strong><p>The system is offered as a package deal amounting to ₱20,000, payable upon subscription. This includes the device, installation, and system setup. Payment is required prior to activation.</p></div>
                        <div><strong>5. Subscription Term</strong><p>The service is valid for one (1) year from activation and is renewable annually. Upon renewal, the Client shall cover the cost of damaged or defective parts.</p></div>
                        <div><strong>6. Monthly Maintenance Fee</strong><p>The Client agrees to pay a monthly maintenance fee of ₱500. Non-payment may result in service suspension.</p></div>
                        <div><strong>7. WEAR AND TEAR CHARGES</strong><p>Upon renewal, the system shall be inspected. Any damage or wear and tear shall incur additional charges, including repairs, replacement of parts, and necessary upgrades. All such costs shall be shouldered by the Client.</p></div>
                        <div><strong>8. Simulation Exercise (SIMEX)</strong><p>The Client agrees to participate in Simulation Exercises (SIMEX) conducted by PICC for calibration and testing purposes.</p></div>
                        <div><strong>9. CCTV Installation</strong><p>The Client agrees to allow CCTV installation in strategic locations determined by the Developer or PICC and shall not tamper with equipment.</p></div>
                        <div><strong>10. USE OF SERVICE</strong><p>The system shall be used strictly for emergency purposes only. The Client shall not trigger false or malicious alerts, tamper with the device, or use the system for unauthorized purposes.</p></div>
                        <div><strong>11. False ALERT POLICY</strong><p>The Client is allowed a maximum of three (3) false alerts. Any excess false alert shall be charged ₱100.00 per incident. Repeated misuse may result in warning, suspension, or termination of service.</p></div>
                        <div><strong>12. Client Responsibilities</strong><p>The Client agrees to use the system responsibly, provide access for maintenance, and coordinate when necessary.</p></div>
                        <div><strong>13. SERVICE LEVEL</strong><p>The Developer shall provide 24/7 monitoring, alert acknowledgment within 1–3 minutes, dispatch within 1-3 minutes, and minimum 95% system uptime.</p></div>
                        <div><strong>14. DEVICE RESPONSIBILITY</strong><p>The Client is responsible for safekeeping of the device and preventing damage or misuse. Repair or replacement due to negligence shall be charged to the Client.</p></div>
                        <div><strong>15. DATA PRIVACY</strong><p>All data shall be handled in accordance with the Data Privacy Act of 2012 and used solely for emergency and law enforcement purposes.</p></div>
                        <div><strong>16. LIMITATION OF LIABILITY</strong><p>The Developer shall not be liable for delays due to external factors, force majeure events, or misuse of the system by the Client.</p></div>
                        <div><strong>17. Termination</strong><p>The Developer may terminate service due to non-payment, misuse of system, or breach of agreement. The Client may terminate with prior written notice and settlement of obligations.</p></div>
                        <div><strong>18. Governing Law</strong><p>This Agreement shall be governed by the laws of the Republic of the Philippines.</p></div>
                        <div><strong>19. DISPUTE RESOLUTION</strong><p>Disputes shall be resolved through negotiation, mediation, or legal action.</p></div>
                        <div><strong>20. EFFECTIVITY</strong><p>This Agreement shall take effect upon signing or system activation.</p></div>
                        <div><strong>21. ACCEPTANCE</strong><p>By checking the agree box below, both parties agree to all terms stated herein.</p></div>
                      </div>
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
