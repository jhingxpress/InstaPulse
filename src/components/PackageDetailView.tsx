'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import InstallationTimeline from './InstallationTimeline'
import BenefitChecklist from './BenefitChecklist'
import PackageSummary from './PackageSummary'
import PackageInclusions from './PackageInclusions'
import EmergencyResponseSimulator from './EmergencyResponseSimulator'

interface PackageItem {
  icon: any
  name: string
  quantity: number
}

interface PackageDetailViewProps {
  package: {
    id: number
    name: string
    price: number
    items: PackageItem[]
    featured: boolean
  }
  onClose: () => void
  onChoosePackage: () => void
  pluralize: (name: string, qty: number) => string
}

export default function PackageDetailView({
  package: pkg,
  onClose,
  onChoosePackage,
  pluralize,
}: PackageDetailViewProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-3xl font-bold text-navy-900">{pkg.name}</h2>
              <p className="text-2xl font-semibold text-red-600 mt-1">₱{pkg.price.toLocaleString()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <InstallationTimeline isActive />
              <BenefitChecklist isActive />
              <PackageInclusions isActive />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <PackageSummary items={pkg.items} pluralize={pluralize} />
              <EmergencyResponseSimulator onChoosePackage={onChoosePackage} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
