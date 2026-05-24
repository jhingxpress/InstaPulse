'use client'

import { motion } from 'framer-motion'
import { Check, Clock, Wrench, Activity, Zap } from 'lucide-react'

interface InstallationTimelineProps {
  isActive?: boolean
}

export default function InstallationTimeline({ isActive = false }: InstallationTimelineProps) {
  const steps = [
    { day: 'Day 1', title: 'Site Assessment', icon: Clock, delay: 0 },
    { day: 'Day 2–3', title: 'Device Installation', icon: Wrench, delay: 0.2 },
    { day: 'Day 4', title: 'System Testing', icon: Activity, delay: 0.4 },
    { day: 'Day 5', title: 'Activation & Training', icon: Zap, delay: 0.6 },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-navy-900 mb-6">Installation Timeline</h3>
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.5, x: 0 }}
            transition={{ duration: 0.5, delay: isActive ? step.delay : 0 }}
            className="relative pl-16 pb-8 last:pb-0"
          >
            {/* Circle Icon */}
            <div className={`absolute left-4 w-5 h-5 rounded-full flex items-center justify-center ${
              isActive ? 'bg-red-600' : 'bg-gray-300'
            }`}>
              {isActive ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <step.icon className="h-3 w-3 text-white" />
              )}
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-sm font-semibold text-red-600 mb-1">{step.day}</div>
              <div className="font-medium text-navy-900">{step.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
