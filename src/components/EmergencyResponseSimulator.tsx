'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Radio, Camera, Monitor, Truck, CheckCircle, Play, RotateCcw } from 'lucide-react'
import SimulationProgressBar from './SimulationProgressBar'
import SimulationResult from './SimulationResult'

interface EmergencyResponseSimulatorProps {
  onChoosePackage: () => void
}

export default function EmergencyResponseSimulator({ onChoosePackage }: EmergencyResponseSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [progress, setProgress] = useState(0)

  const steps = [
    { id: 1, time: '00:00', title: 'Alert Button Pressed', icon: Radio, color: 'bg-red-500' },
    { id: 2, time: '00:01', title: 'Alert Transmitted', icon: Radio, color: 'bg-orange-500' },
    { id: 3, time: '00:02', title: 'CCTV Monitoring Active', icon: Camera, color: 'bg-yellow-500' },
    { id: 4, time: '00:03', title: 'Dashboard Alert Received', icon: Monitor, color: 'bg-blue-500' },
    { id: 5, time: '00:05', title: 'Emergency Response Notification Sent', icon: Truck, color: 'bg-indigo-500' },
    { id: 6, time: '00:07', title: 'Incident Under Monitoring', icon: CheckCircle, color: 'bg-green-500' },
  ]

  const runSimulation = async () => {
    setIsRunning(true)
    setCurrentStep(0)
    setProgress(0)
    setShowResult(false)

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentStep(i + 1)
      setProgress(((i + 1) / steps.length) * 100)
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    setShowResult(true)
    setIsRunning(false)
  }

  const resetSimulation = () => {
    setShowResult(false)
    setCurrentStep(0)
    setProgress(0)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-navy-900 mb-6">Emergency Response Simulator</h3>
      
      {!isRunning && !showResult && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Experience how our emergency response system works in real-time. Click below to simulate an emergency scenario.
          </p>
          <button
            onClick={runSimulation}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <Play className="h-5 w-5" />
            <span>Simulate Emergency Response</span>
          </button>
        </div>
      )}

      {isRunning && (
        <div className="space-y-6">
          <SimulationProgressBar progress={progress} />

          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index < currentStep
              const isCurrent = index === currentStep - 1

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    isActive ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive ? step.color : 'bg-gray-200'
                  }`}>
                    <StepIcon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-navy-900">{step.title}</div>
                    <div className="text-sm text-gray-500">{step.time}</div>
                  </div>
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-3 h-3 bg-red-500 rounded-full"
                    />
                  )}
                  {isActive && !isCurrent && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showResult && (
          <SimulationResult
            onChoosePackage={onChoosePackage}
            onReplay={resetSimulation}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
