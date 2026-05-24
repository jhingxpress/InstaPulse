'use client'

import { motion } from 'framer-motion'
import { Check, Wrench, GraduationCap, Layout, Headphones, Shield } from 'lucide-react'

interface PackageInclusionsProps {
  isActive?: boolean
}

export default function PackageInclusions({ isActive = false }: PackageInclusionsProps) {
  const inclusions = [
    { icon: Wrench, title: 'Professional Installation', description: 'Expert setup by certified technicians' },
    { icon: Layout, title: 'System Configuration', description: 'Customized to your specific needs' },
    { icon: GraduationCap, title: 'User Training', description: 'Comprehensive training for your team' },
    { icon: Layout, title: 'Dashboard Access', description: '24/7 monitoring from anywhere' },
    { icon: Headphones, title: 'Technical Support', description: 'Dedicated support team available' },
    { icon: Shield, title: 'Emergency Alert Monitoring', description: 'Real-time emergency response' },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-navy-900 mb-6">Every Package Includes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inclusions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 0 }}
            transition={{ duration: 0.4, delay: isActive ? index * 0.1 : 0 }}
            whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 cursor-pointer transition-all"
          >
            <div className="flex items-start space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"
              >
                <item.icon className="h-6 w-6 text-red-600" />
              </motion.div>
              <div className="flex-1">
                <h4 className="font-semibold text-navy-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: isActive ? 0.5 + index * 0.1 : 0, type: 'spring' }}
                className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-green-600" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
