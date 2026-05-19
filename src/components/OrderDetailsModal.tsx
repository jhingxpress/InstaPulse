'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Package, CreditCard, Hash, Calendar, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface OrderDetailsModalProps {
  order: any
  onClose: () => void
  onStatusUpdated: (updated: any) => void
  onViewClient?: (userId: string) => void
}

const STATUS_FLOW: Record<string, { next: string | null; label: string; color: string }> = {
  pending:      { next: 'paid',        label: 'Mark as Paid',        color: 'bg-blue-600 hover:bg-blue-700' },
  paid:         { next: 'acknowledged',label: 'Acknowledge Order',   color: 'bg-purple-600 hover:bg-purple-700' },
  acknowledged: { next: 'completed',   label: 'Mark as Completed',   color: 'bg-green-600 hover:bg-green-700' },
  completed:    { next: null,          label: 'Completed',           color: 'bg-green-600 opacity-50 cursor-not-allowed' },
  cancelled:    { next: null,          label: 'Cancelled',           color: 'bg-red-600 opacity-50 cursor-not-allowed' },
}

const STATUS_COLORS: Record<string, string> = {
  pending:      'bg-yellow-100 text-yellow-800',
  paid:         'bg-blue-100 text-blue-800',
  acknowledged: 'bg-purple-100 text-purple-800',
  completed:    'bg-green-100 text-green-800',
  cancelled:    'bg-red-100 text-red-800',
}

export default function OrderDetailsModal({ order, onClose, onStatusUpdated, onViewClient }: OrderDetailsModalProps) {
  const [updating, setUpdating] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const flow = STATUS_FLOW[order.status] ?? STATUS_FLOW.pending

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true)
    try {
      const { data, error } = await (supabase() as any)
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id)
        .select()
        .single()
      if (!error && data) onStatusUpdated(data)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return
    setCancelling(true)
    try {
      const { data, error } = await (supabase() as any)
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id)
        .select()
        .single()
      if (!error && data) onStatusUpdated(data)
    } finally {
      setCancelling(false)
    }
  }

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] break-all">{value || '—'}</span>
    </div>
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60" />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
              <p className="text-xs text-gray-400 font-mono">{order.order_number}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </span>
              {onViewClient && (
                <button onClick={() => onViewClient(order.user_id)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
                  <User className="h-4 w-4" />
                  <span>View Client</span>
                </button>
              )}
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Package className="h-4 w-4 text-red-600" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Info</span>
              </div>
              <Row label="Package" value={order.package_name} />
              <Row label="Amount" value={`₱${Number(order.total_amount).toLocaleString()}`} />
              <Row label="Date" value={new Date(order.created_at).toLocaleString()} />
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</span>
              </div>
              <Row label="Method" value={order.payment_method?.replace('_', ' ')} />
              <Row label="Reference No." value={order.transaction_reference} />
            </div>

            {/* Customer Info (if available) */}
            {(order.user_full_name || order.user_email) && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</span>
                </div>
                <Row label="Name" value={order.user_full_name} />
                <Row label="Email" value={order.user_email} />
              </div>
            )}

            {/* Actions */}
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <div className="space-y-3">
                {flow.next && (
                  <button onClick={() => handleStatusUpdate(flow.next!)}
                    disabled={updating}
                    className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 transition-colors ${flow.color}`}>
                    {updating ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Updating...</span></>
                      : <><CheckCircle className="h-4 w-4" /><span>{flow.label}</span></>}
                  </button>
                )}
                <button onClick={handleCancel} disabled={cancelling}
                  className="w-full py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors">
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
