'use client'

import { motion } from 'framer-motion'
import { Camera, Radio, Shield } from 'lucide-react'

interface PackageItem {
  icon: any
  name: string
  quantity: number
}

interface PackageSummaryProps {
  items: PackageItem[]
  pluralize: (name: string, qty: number) => string
}

export default function PackageSummary({ items, pluralize }: PackageSummaryProps) {
  const cctvCount = items.find(i => i.name === 'CCTV Camera')?.quantity || 0
  const buttonCount = items.find(i => i.name === 'Alert Button')?.quantity || 0
  const supportLevel = cctvCount >= 4 ? 'Premium' : cctvCount >= 2 ? 'Standard' : 'Basic'
  const coveragePercent = Math.min(100, (cctvCount * 25) + (buttonCount * 15))

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-navy-900 mb-6">Package Summary</h3>
      
      <div className="space-y-4">
        {/* CCTV Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700">CCTV Cameras</span>
          </div>
          <span className="font-bold text-navy-900">{cctvCount}</span>
        </div>

        {/* Alert Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Radio className="h-5 w-5 text-red-600" />
            <span className="text-gray-700">Alert Buttons</span>
          </div>
          <span className="font-bold text-navy-900">{buttonCount}</span>
        </div>

        {/* Support Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-gray-700">Support Level</span>
          </div>
          <span className="font-bold text-navy-900">{supportLevel}</span>
        </div>

        {/* Coverage Indicator */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Coverage Level</span>
            <span className="text-sm font-semibold text-navy-900">{coveragePercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${coveragePercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-2 rounded-full ${
                coveragePercent >= 75 ? 'bg-green-500' : coveragePercent >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
