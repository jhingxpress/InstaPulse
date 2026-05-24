'use client'

import { motion } from 'framer-motion'

interface SimulationProgressBarProps {
  progress: number
}

export default function SimulationProgressBar({ progress }: SimulationProgressBarProps) {
  const getColor = (p: number) => {
    if (p < 33) return 'bg-red-500'
    if (p < 66) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-3 rounded-full ${getColor(progress)}`}
      />
    </div>
  )
}
