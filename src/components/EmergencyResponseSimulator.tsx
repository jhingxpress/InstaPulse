'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Radio, Camera, Monitor, ShieldCheck, CheckCircle, Play, RotateCcw, Activity } from 'lucide-react'
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
    { id: 1, time: '00:00', title: 'Alert Button Pressed', icon: Radio, color: 'bg-red-500', pulse: true },
    { id: 2, time: '00:01', title: 'Alert Transmitted', icon: Activity, color: 'bg-orange-500', signal: true },
    { id: 3, time: '00:02', title: 'CCTV Monitoring Active', icon: Camera, color: 'bg-yellow-500', live: true },
    { id: 4, time: '00:03', title: 'Dashboard Alert Received', icon: Monitor, color: 'bg-blue-500', popup: true },
    { id: 5, time: '00:05', title: 'Emergency Response Notification Sent', icon: ShieldCheck, color: 'bg-indigo-500', route: true },
    { id: 6, time: '00:07', title: 'Incident Under Monitoring', icon: CheckCircle, color: 'bg-green-500', success: true },
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
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6"
          >
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </motion.div>
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
                  className={`relative flex items-center space-x-4 p-4 rounded-lg border overflow-hidden ${
                    isActive ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                  }`}
                >
                  {/* Signal Rings Effect */}
                  {isCurrent && step.signal && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 2, 3], opacity: [0.5, 0.3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute left-6 w-12 h-12 border-2 border-orange-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 2], opacity: [0.7, 0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="absolute left-6 w-12 h-12 border-2 border-orange-300 rounded-full"
                      />
                    </>
                  )}

                  {/* Connection Line Animation */}
                  {isCurrent && step.route && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      className="absolute bottom-0 left-0 h-1 bg-indigo-500"
                    />
                  )}

                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    isActive ? step.color : 'bg-gray-200'
                  }`}>
                    {/* Pulse Effect for Alert Button */}
                    {isCurrent && step.pulse && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-red-400"
                      />
                    )}
                    
                    <StepIcon className={`h-6 w-6 relative z-10 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    
                    {/* LIVE Badge */}
                    {isActive && step.live && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded font-bold"
                      >
                        LIVE
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-navy-900">{step.title}</div>
                    <div className="text-sm text-gray-500">{step.time}</div>
                  </div>

                  {/* Dashboard Popup Effect */}
                  {isCurrent && step.popup && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                    >
                      +1 Alert
                    </motion.div>
                  )}

                  {/* Current Step Indicator */}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-3 h-3 bg-red-500 rounded-full z-10"
                    />
                  )}

                  {/* Completed Checkmark */}
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
