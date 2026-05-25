'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import {
  Shield, AlertTriangle, Monitor, Camera, MapPin,
  Radio, Truck, ArrowDown, ChevronRight,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Emergency Alert Triggered',
    description:
      'The user presses the InstaPulse Emergency Button or Mobile App to instantly send an emergency alert.',
    icon: AlertTriangle,
    accent: 'red',
    imageLabel: 'Emergency Button / Mobile Alert Illustration',
    image: '/images/step 1.png',
  },
  {
    number: '02',
    title: 'Alert Received by Command Center',
    description:
      'The InstaPulse monitoring dashboard receives the alert and displays incident information for immediate assessment.',
    icon: Monitor,
    accent: 'blue',
    imageLabel: 'Monitoring Center / Command Center Dashboard',
    image: '/images/step 2.png',
  },
  {
    number: '03',
    title: 'CCTV Verification',
    description:
      'Operators verify the incident through integrated CCTV cameras and live video feeds.',
    icon: Camera,
    accent: 'purple',
    imageLabel: 'CCTV Monitoring Screen',
    image: '/images/step 3.png',
  },
  {
    number: '04',
    title: 'Location Pinpointing',
    description:
      'GPS coordinates are automatically captured and displayed on Google Maps for accurate location tracking.',
    icon: MapPin,
    accent: 'green',
    imageLabel: 'Google Maps Location Pin Visualization',
    image: '/images/step 4.png',
  },
  {
    number: '05',
    title: 'Responder Notification',
    description:
      'Nearest available responders are instantly notified and provided with incident details.',
    icon: Radio,
    accent: 'orange',
    imageLabel: 'Police / Emergency Responders Receiving Alerts',
    image: '/images/step 5.png',
  },
  {
    number: '06',
    title: 'Unit Deployment',
    description:
      'Responding units are dispatched to the emergency location for rapid assistance.',
    icon: Truck,
    accent: 'navy',
    imageLabel: 'Police Vehicle / Emergency Response Deployment',
    image: '/images/step 6.png',
  },
]

type AccentKey = 'red' | 'blue' | 'purple' | 'green' | 'orange' | 'navy'

const accentClasses: Record<AccentKey, {
  bg: string; text: string; border: string; light: string; badge: string
}> = {
  red:    { bg: 'bg-red-600',    text: 'text-red-600',    border: 'border-red-200',    light: 'bg-red-50',    badge: 'bg-red-100 text-red-700 border-red-200'    },
  blue:   { bg: 'bg-blue-600',   text: 'text-blue-600',   border: 'border-blue-200',   light: 'bg-blue-50',   badge: 'bg-blue-100 text-blue-700 border-blue-200'   },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  green:  { bg: 'bg-green-600',  text: 'text-green-600',  border: 'border-green-200',  light: 'bg-green-50',  badge: 'bg-green-100 text-green-700 border-green-200'  },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-200', light: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  navy:   { bg: 'bg-slate-700',  text: 'text-slate-700',  border: 'border-slate-200',  light: 'bg-slate-50',  badge: 'bg-slate-100 text-slate-700 border-slate-200'  },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-8"
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-full mb-6"
          >
            <span>6-Step Process</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight"
          >
            How InstaPulse{' '}
            <span className="text-red-600">Works</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            A simple 6-step emergency response process designed to help
            authorities respond faster during emergencies.
          </motion.p>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8 lg:space-y-20">
            {steps.map((step, index) => {
              const accent = accentClasses[step.accent as AccentKey]
              const isEven = index % 2 === 1
              const Icon = step.icon

              return (
                <div key={step.number}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}
                  >
                    {/* Image Card */}
                    <div className="w-full lg:w-1/2">
                      <motion.div
                        whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
                        transition={{ duration: 0.3 }}
                        className="relative rounded-2xl shadow-lg overflow-hidden aspect-video"
                      >
                        <Image
                          src={step.image}
                          alt={step.imageLabel}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Step number watermark */}
                        <span className="absolute top-4 right-5 text-8xl font-black leading-none text-white opacity-20 select-none pointer-events-none drop-shadow-lg">
                          {step.number}
                        </span>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-5">
                      <div className="flex items-center space-x-4">
                        <span className={`text-8xl font-black leading-none ${accent.text} opacity-15 select-none`}>
                          {step.number}
                        </span>
                        <div className={`h-0.5 flex-1 ${accent.bg} opacity-25 rounded-full`} />
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 leading-tight">
                        {step.title}
                      </h2>

                      <p className="text-lg text-gray-600 leading-relaxed">
                        {step.description}
                      </p>

                      <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-semibold ${accent.badge}`}>
                        <Icon className="h-4 w-4" />
                        <span>Step {step.number}</span>
                      </span>
                    </div>
                  </motion.div>

                  {/* Connector Arrow between steps */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex justify-center mt-10 lg:mt-14"
                    >
                      <div className="flex flex-col items-center space-y-1 text-gray-300">
                        <div className="w-px h-10 bg-gray-300" />
                        <ArrowDown className="h-5 w-5" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Enhance Your Security?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Protect your community with InstaPulse's advanced emergency alert technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/packages"
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
              >
                <span>View Packages</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="bg-white text-navy-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
