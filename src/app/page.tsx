'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Shield, Users, Clock, AlertTriangle, Zap, Camera, MapPin, Radio, Monitor, Truck, ChevronRight } from 'lucide-react'

export default function Home() {
  const benefits = [
    {
      icon: Zap,
      title: 'Fast Emergency Reporting',
      description: 'One-touch alert activation during emergencies.',
    },
    {
      icon: Clock,
      title: 'Improved Response Time',
      description: 'Real-time communication with responders.',
    },
    {
      icon: Shield,
      title: 'Crime Deterrence',
      description: 'Visible monitoring systems reduce threats.',
    },
    {
      icon: Monitor,
      title: 'Centralized Monitoring',
      description: 'All incidents managed in one dashboard.',
    },
    {
      icon: Users,
      title: 'Smarter Coordination',
      description: 'Better decision-making during emergencies.',
    },
  ]

  const steps = [
    {
      step: '01', icon: AlertTriangle, bg: 'bg-red-600', shadow: 'shadow-red-600/30', glow: 'from-red-600/5',
      title: 'Alert Triggered',
      desc: 'User activates emergency button or mobile app.',
    },
    {
      step: '02', icon: Monitor, bg: 'bg-blue-600', shadow: 'shadow-blue-600/30', glow: 'from-blue-600/5',
      title: 'Command Center Receives Alert',
      desc: 'Incident appears instantly on monitoring dashboard.',
    },
    {
      step: '03', icon: Camera, bg: 'bg-purple-600', shadow: 'shadow-purple-600/30', glow: 'from-purple-600/5',
      title: 'CCTV Verification',
      desc: 'Live video feeds are checked for validation.',
    },
    {
      step: '04', icon: MapPin, bg: 'bg-green-600', shadow: 'shadow-green-600/30', glow: 'from-green-600/5',
      title: 'Location Tracking',
      desc: 'GPS location is automatically displayed on the map.',
    },
    {
      step: '05', icon: Radio, bg: 'bg-orange-500', shadow: 'shadow-orange-500/30', glow: 'from-orange-500/5',
      title: 'Responder Notification',
      desc: 'Nearest responders are alerted in real time.',
    },
    {
      step: '06', icon: Truck, bg: 'bg-navy-900', shadow: 'shadow-navy-900/30', glow: 'from-navy-900/5',
      title: 'Unit Deployment',
      desc: 'Emergency units are dispatched to the location.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-8"
            >
              <AlertTriangle className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6 leading-tight">
              Instant Emergency Alerts for{' '}
              <span className="text-red-600 block sm:inline">Faster Response</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              InstaPulse connects communities and authorities through real-time emergency alerts, monitoring, and rapid response coordination.
            </p>
            <p className="text-base text-gray-500 mb-10">
              A smart safety system designed for communities, businesses, and organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/packages"
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                View Packages
              </Link>
              <Link
                href="/register"
                className="bg-navy-900 text-white px-8 py-4 rounded-lg hover:bg-navy-800 transition-colors font-semibold text-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-6 px-4 bg-gray-50 border-y border-gray-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm font-semibold text-gray-500 tracking-wide">
            {['Emergency Alerts', 'CCTV Integration', 'GPS Tracking', 'Central Monitoring'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About InstaPulse Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-navy-900/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-navy-900/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Smart Emergency Response Technology
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 border border-white/20 text-center">
              <p className="text-lg text-gray-700 leading-relaxed mb-5">
                InstaPulse is a public safety and monitoring system designed to improve emergency response through fast communication and real-time coordination.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                It integrates emergency alert devices, CCTV monitoring, GPS location tracking, and a centralized command dashboard to support faster decision-making during critical incidents.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-navy-900/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Simple 6-Step Emergency Response System
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} to-transparent`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 ${item.bg} rounded-full shadow-md`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-5xl font-black text-gray-100 select-none">{item.step}</span>
                    </div>
                    <h3 className="text-base font-bold text-navy-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-10"
          >
            <Link
              href="/how-it-works"
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
            >
              <span>View More Details</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">
              Why Choose InstaPulse
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.04, y: -4 }}
                className="bg-gray-50 border border-gray-100 p-7 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl mb-5">
                  <benefit.icon className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Improve Safety in Your Area?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-10 max-w-xl mx-auto">
              Deploy InstaPulse and strengthen emergency response in your community or organization.
            </p>
            <Link
              href="/packages"
              className="inline-block bg-red-600 text-white px-10 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
            >
              View Packages
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
