'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, CheckCircle, Loader2, ArrowLeft, Smartphone, Building2, Banknote, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import TermsModal from '@/components/TermsModal'
import PolicyModal from '@/components/PolicyModal'

interface PackageData {
  id: string
  name: string
  price: number
  items: { item_name: string; quantity: number }[]
}

interface PaymentModalProps {
  open: boolean
  pkg: PackageData | null
  onClose: () => void
  onBack: () => void
  onSuccess: (order: any) => void
}

const PAYMENT_METHODS = [
  { id: 'gcash', label: 'GCash', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { id: 'maya', label: 'Maya', icon: Smartphone, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  { id: 'cash', label: 'Cash on Delivery', icon: Banknote, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
]

export default function PaymentModal({ open, pkg, onClose, onBack, onSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [reference, setReference] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMethod) { setError('Please select a payment method'); return }
    if (selectedMethod !== 'cash' && !reference.trim()) { setError('Please enter your transaction reference'); return }
    if (!agreedToTerms) { setError('You must agree to the InstaPulse Terms and Conditions and Policy before proceeding.'); return }
    if (!pkg) return

    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase().auth.getUser()
      if (!user) throw new Error('Session expired. Please login again.')

      // Backend validation: record consent BEFORE order creation
      const { error: consentErr } = await (supabase() as any)
        .from('purchase_agreements')
        .insert({
          user_id: user.id,
          package_id: pkg.id,
          agreed_terms_and_policy: true,
          agreed_at: new Date().toISOString(),
        })

      if (consentErr) {
        throw new Error('User must agree to Terms and Policy before proceeding.')
      }

      const orderNumber = `ORD-${Date.now()}`

      // Create order
      const { data: order, error: orderErr } = await (supabase() as any)
        .from('orders')
        .insert({
          user_id: user.id,
          package_id: pkg.id,
          package_name: pkg.name,
          order_number: orderNumber,
          total_amount: pkg.price,
          status: 'pending',
          payment_method: selectedMethod,
          transaction_reference: reference.trim() || null,
        })
        .select()
        .single()

      if (orderErr) throw orderErr

      // Create payment record
      await (supabase() as any).from('payments').insert({
        order_id: order.id,
        user_id: user.id,
        payment_method: selectedMethod,
        amount: pkg.price,
        status: 'pending',
        reference_number: reference.trim() || null,
      })

      setSuccess(true)
      setTimeout(() => {
        onSuccess(order)
        setSuccess(false)
        setSelectedMethod('')
        setReference('')
        setAgreedToTerms(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!pkg) return null

  return (
    <>
    <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    <PolicyModal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} />
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                <p className="text-gray-600">Your order has been submitted. Our team will confirm your payment shortly.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-600 mr-1">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <CreditCard className="h-6 w-6 text-red-600" />
                    <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Package Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Selected Package</p>
                    <p className="font-bold text-gray-900 text-lg">{pkg.name}</p>
                    <p className="text-red-600 font-bold text-2xl mt-1">₱{Number(pkg.price).toLocaleString()}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`flex items-center space-x-2 p-3 border-2 rounded-xl transition-all ${
                            selectedMethod === method.id
                              ? `${method.bg} border-current ${method.color}`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <method.icon className={`h-5 w-5 ${selectedMethod === method.id ? method.color : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${selectedMethod === method.id ? method.color : 'text-gray-600'}`}>
                            {method.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reference number (not for cash) */}
                  {selectedMethod && selectedMethod !== 'cash' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Transaction Reference Number
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Enter your reference number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                      />
                    </div>
                  )}

                  {selectedMethod === 'cash' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                      Our team will contact you to arrange payment collection. Please wait for confirmation.
                    </div>
                  )}

                  {/* Legal Consent Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <p className="text-sm font-semibold text-blue-900">Legal Agreement Required</p>
                    </div>
                    <p className="text-xs text-blue-700">
                      Before proceeding with your purchase, you must read and agree to the InstaPulse Terms and Conditions and Policy.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-800 underline font-medium text-left"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>📄 Terms and Conditions</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPolicyModal(true)}
                        className="flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-800 underline font-medium text-left"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>📄 InstaPulse Policy</span>
                      </button>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-0.5 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-600"
                        />
                        <span className="text-sm text-gray-700 leading-snug">
                          I have read and agree to the InstaPulse{' '}
                          <button type="button" onClick={() => setShowTermsModal(true)} className="text-blue-600 hover:text-blue-800 underline font-medium">Terms and Conditions</button>
                          {' '}and{' '}
                          <button type="button" onClick={() => setShowPolicyModal(true)} className="text-blue-600 hover:text-blue-800 underline font-medium">Policy</button>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !selectedMethod || !agreedToTerms}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /><span>Processing...</span></>
                    ) : (
                      <span>Confirm Order — ₱{Number(pkg.price).toLocaleString()}</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  )
}
