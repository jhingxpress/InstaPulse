'use client'

import { motion } from 'framer-motion'
import { CheckCircle, RotateCcw, ArrowRight } from 'lucide-react'

interface SimulationResultProps {
  onChoosePackage: () => void
  onReplay: () => void
}

export default function SimulationResult({ onChoosePackage, onReplay }: SimulationResultProps) {
  const checklist = [
    'Alert Received',
    'CCTV Verified',
    'Dashboard Notified',
    'Responders Alerted',
    'Monitoring Active',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        <h4 className="text-2xl font-bold text-navy-900 mb-2">
          Emergency Response Successfully Initiated
        </h4>
        <p className="text-gray-600">
          Your emergency was processed in under 7 seconds
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h5 className="font-semibold text-navy-900 mb-4">Response Checklist</h5>
        <div className="space-y-3">
          {checklist.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onReplay}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Replay Simulation</span>
        </button>
        <button
          onClick={onChoosePackage}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          <span>Choose This Package</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}
