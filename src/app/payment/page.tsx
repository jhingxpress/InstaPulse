'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { CreditCard, Smartphone, Building2, Check, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('package')
  const paymentMethod = searchParams.get('method') || 'gcash'
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const packages = [
    { id: '1', name: 'Basic Protection', price: 20000 },
    { id: '2', name: 'Standard Protection', price: 21000 },
    { id: '3', name: 'Advanced Response', price: 22000 },
    { id: '4', name: 'Enterprise Security', price: 25000 },
  ]

  const selectedPackage = packages.find((p) => p.id === packageId) || packages[2]

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase().auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setAuthenticated(true)
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handlePayment = async () => {
    setProcessing(true)
    setError('')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // TODO: Integrate with actual payment gateway (PayMongo)
      // For now, we'll simulate a successful payment

      // Store the order in localStorage (temporary solution)
      const { data: { user } } = await supabase().auth.getUser()
      
      if (user) {
        try {
          // Get existing orders from localStorage
          const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
          
          // Create new order
          const newOrder = {
            id: `ORD-${Date.now()}`,
            user_id: user.id,
            package_id: selectedPackage.id,
            package_name: selectedPackage.name,
            amount: selectedPackage.price,
            payment_method: paymentMethod,
            status: 'completed',
            created_at: new Date().toISOString()
          }
          
          // Add to orders
          existingOrders.push(newOrder)
          localStorage.setItem('orders', JSON.stringify(existingOrders))
          
          // Update user's package in localStorage
          const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
          userProfile.package_id = selectedPackage.id
          userProfile.package_name = selectedPackage.name
          userProfile.package_price = selectedPackage.price
          userProfile.payment_status = 'paid'
          userProfile.updated_at = new Date().toISOString()
          localStorage.setItem('userProfile', JSON.stringify(userProfile))
          
          console.log('Order created:', newOrder)
        } catch (storageError) {
          console.error('Storage error:', storageError)
        }
      }

      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment processing failed. Please try again.')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Payment Processing</h1>
            <p className="text-xl text-gray-600">Complete your purchase</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Your order has been processed successfully.</p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                      <CreditCard className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900">{selectedPackage.name}</h3>
                      <p className="text-sm text-gray-600">Security Package</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-bold text-navy-900 text-lg">
                      <span>Total Amount</span>
                      <span>₱{selectedPackage.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Payment Method: {paymentMethod.toUpperCase()}</p>
                      <p className="text-xs text-blue-700 mt-1">You will be redirected to complete your payment securely.</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Pay ₱{selectedPackage.price.toLocaleString()}</span>
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-600 hover:text-red-600"
                  >
                    ← Cancel and go back
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
