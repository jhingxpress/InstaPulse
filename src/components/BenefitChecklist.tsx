'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface BenefitChecklistProps {
  isActive?: boolean
}

export default function BenefitChecklist({ isActive = false }: BenefitChecklistProps) {
  const benefits = [
    '24/7 Emergency Monitoring',
    'Real-time CCTV Surveillance',
    'Instant Alert Notifications',
    'Professional Installation Included',
    'Monthly On-site Maintenance',
    'Dedicated Support Team',
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-navy-900 mb-6">ROI Benefits</h3>
      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.5, x: 0 }}
            transition={{ duration: 0.4, delay: isActive ? index * 0.1 : 0 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Check className="h-4 w-4 text-green-600" />
            </motion.div>
            <span className="text-gray-700">{benefit}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
