'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Shield, ShieldAlert, Users, Clock, CheckCircle, ArrowRight, AlertTriangle, Zap, Camera, MapPin, Radio, ShieldCheck } from 'lucide-react'

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
            <div className="prose prose-lg text-gray-600 text-justify">
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
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 border border-white/20">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              A seamless 4-step process for rapid emergency response
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
          </motion.div>

          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent"></div>
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6 shadow-lg shadow-red-600/30"
                    >
                      <Radio className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-navy-900 mb-3">Alert System</h3>
                    <p className="text-gray-600 text-sm">
                      Emergency alert buttons instantly notify the monitoring system during emergencies.
                    </p>
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                      <ArrowRight className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-8 bg-red-600 rounded-full transform -translate-y-1/2 z-20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-900/5 to-transparent"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-navy-900 rounded-full mb-6 shadow-lg shadow-navy-900/30">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-3">CCTV Monitoring</h3>
                    <p className="text-gray-600 text-sm">
                      Integrated CCTV cameras provide real-time monitoring and incident recording.
                    </p>
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                      <ArrowRight className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-8 bg-navy-900 rounded-full transform -translate-y-1/2 z-20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6 shadow-lg shadow-red-600/30">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-3">GPS Enabled Tracking</h3>
                    <p className="text-gray-600 text-sm">
                      GPS technology helps responders quickly identify the exact incident location.
                    </p>
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                      <ArrowRight className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-8 bg-red-600 rounded-full transform -translate-y-1/2 z-20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-900/5 to-transparent"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-navy-900 rounded-full mb-6 shadow-lg shadow-navy-900/30">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-3">Emergency Responders</h3>
                    <p className="text-gray-600 text-sm">
                      Authorities and responders receive instant notifications for rapid emergency coordination.
                    </p>
                  </div>
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-8 bg-navy-900 rounded-full transform -translate-y-1/2 z-20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
              </motion.div>
            </div>
          </div>
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
                <li>+63 912 345 6789</li>
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
