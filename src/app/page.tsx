'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Shield, ShieldAlert, Users, Clock, CheckCircle, ArrowRight, AlertTriangle, Zap, Camera, MapPin, Radio, ShieldCheck, Monitor, Truck, ChevronRight } from 'lucide-react'

export default function Home() {
  const benefits = [
    {
      icon: Shield,
      title: 'Crime Deterrence',
      description: 'Visible alert systems and CCTV monitoring help discourage criminal activity.',
    },
    {
      icon: Clock,
      title: 'Faster Emergency Response',
      description: 'Instant notifications help authorities respond quickly during emergencies.',
    },
    {
      icon: Zap,
      title: 'Easy Access to Assistance',
      description: 'Users can trigger emergency alerts with a single press.',
    },
    {
      icon: Users,
      title: 'Centralized Monitoring',
      description: 'Real-time monitoring improves coordination and incident management.',
    },
    {
      icon: Camera,
      title: 'Smart Security Technology',
      description: 'Modern communication systems designed for safety and rapid response.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              <span className="text-red-600 block sm:inline">Faster Police Response</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              InstaPulse is a smart emergency alert and monitoring system designed to help
              communities and establishments quickly connect with authorities during emergencies
              and suspicious incidents.
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

      {/* Introduction Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-8 text-center">
              Advanced Emergency Alert & Monitoring Solution
            </h2>
            <div className="prose prose-lg text-gray-600 text-center">
              <p className="mb-4">
                InstaPulse is an advanced emergency alert and monitoring solution that helps
                improve public safety through real-time communication and rapid response technology.
              </p>
              <p className="mb-4">
                The system is designed to assist communities, businesses, and organizations in
                reporting emergencies quickly and efficiently. By integrating alert systems, CCTV
                monitoring, and emergency buttons, InstaPulse helps authorities respond faster
                during critical situations.
              </p>
              <p>
                With smart connectivity and centralized monitoring, InstaPulse supports crime
                deterrence, faster emergency coordination, and improved incident response
                capabilities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About InstaPulse Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-navy-900/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-navy-900/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              About InstaPulse Technology
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
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                InstaPulse is a smart emergency alert and monitoring system designed to improve public safety through rapid communication and real-time monitoring technology.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The system combines emergency alert devices, CCTV monitoring, GPS location tracking, and responder coordination to help authorities respond faster during emergencies and suspicious incidents.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-red-600/5 to-navy-900/5"></div>
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-navy-900/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple 6-step emergency response process designed to help authorities respond faster during emergencies.
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: '01', icon: AlertTriangle, bg: 'bg-red-600', shadow: 'shadow-red-600/30', glow: 'from-red-600/5',
                title: 'Emergency Alert Triggered',
                desc: 'The user presses the InstaPulse Emergency Button or Mobile App to instantly send an emergency alert.',
              },
              {
                step: '02', icon: Monitor, bg: 'bg-blue-600', shadow: 'shadow-blue-600/30', glow: 'from-blue-600/5',
                title: 'Alert Received by Command Center',
                desc: 'The InstaPulse monitoring dashboard receives the alert and displays incident information for immediate assessment.',
              },
              {
                step: '03', icon: Camera, bg: 'bg-purple-600', shadow: 'shadow-purple-600/30', glow: 'from-purple-600/5',
                title: 'CCTV Verification',
                desc: 'Operators verify the incident through integrated CCTV cameras and live video feeds.',
              },
              {
                step: '04', icon: MapPin, bg: 'bg-green-600', shadow: 'shadow-green-600/30', glow: 'from-green-600/5',
                title: 'Location Pinpointing',
                desc: 'GPS coordinates are automatically captured and displayed on Google Maps for accurate location tracking.',
              },
              {
                step: '05', icon: Radio, bg: 'bg-orange-500', shadow: 'shadow-orange-500/30', glow: 'from-orange-500/5',
                title: 'Responder Notification',
                desc: 'Nearest available responders are instantly notified and provided with incident details.',
              },
              {
                step: '06', icon: Truck, bg: 'bg-navy-900', shadow: 'shadow-navy-900/30', glow: 'from-navy-900/5',
                title: 'Unit Deployment',
                desc: 'Responding units are dispatched to the emergency location for rapid assistance.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 h-full relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} to-transparent`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center justify-center w-14 h-14 ${item.bg} rounded-full shadow-lg ${item.shadow}`}>
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <span className="text-5xl font-black text-gray-100 select-none">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Details CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 mb-4">Want to see the full step-by-step process with images and details?</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Key Benefits
            </h2>
            <p className="text-xl text-gray-600">
              Why choose InstaPulse for your security needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                  <benefit.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Enhance Your Security?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Get started with InstaPulse today and protect your community with advanced
              emergency alert technology.
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

      {/* Footer */}
      <footer className="bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold">InstaPulse</span>
              </div>
              <p className="text-gray-400">
                Advanced emergency alert and monitoring system for communities and
                establishments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-white transition-colors">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>admin@instapulse.site</li>
                <li>+63 939 920 8711</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-navy-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 InstaPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
