'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, CheckCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PackageItem {
  item_name: string
  quantity: number
}

interface PackageData {
  id: string
  name: string
  description: string
  price: number
  items: PackageItem[]
}

interface PackageModalProps {
  open: boolean
  onClose: () => void
  onSelectPackage: (pkg: PackageData) => void
}

const pluralize = (name: string, qty: number) => {
  if (qty <= 1) return name
  if (name === 'CCTV Camera') return 'CCTV Cameras'
  if (name === 'Alert Button') return 'Alert Buttons'
  return name
}

export default function PackageModal({ open, onClose, onSelectPackage }: PackageModalProps) {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    const fetchPackages = async () => {
      setLoading(true)
      const { data: pkgs } = await (supabase() as any)
        .from('packages')
        .select('id, name, description, price')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (pkgs) {
        const withItems = await Promise.all(
          pkgs.map(async (pkg: any) => {
            const { data: items } = await (supabase() as any)
              .from('package_items')
              .select('item_name, quantity')
              .eq('package_id', pkg.id)
            return { ...pkg, items: items || [] }
          })
        )
        setPackages(withItems)
      }
      setLoading(false)
    }
    fetchPackages()
  }, [open])

  return (
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Choose a Package</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="border-2 border-gray-200 hover:border-red-400 rounded-xl p-6 transition-all group"
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          {pkg.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                      </div>

                      <p className="text-3xl font-bold text-red-600 mb-4">
                        ₱{Number(pkg.price).toLocaleString()}
                      </p>

                      {pkg.items.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {pkg.items.map((item, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{pluralize(item.item_name, item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Select Package
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
