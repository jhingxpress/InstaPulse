'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Shield, Check, ArrowRight, Camera, Radio } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PackagesPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase().auth.getUser()
      setAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  const handleBuyNow = (pkgId: number) => {
    if (!authenticated) {
      router.push('/register')
    } else {
      router.push(`/checkout?package=${pkgId}`)
    }
  }

  const packages = [
    {
      id: 1,
      name: 'Basic Package',
      price: 20000,
      items: [
        { icon: Shield, name: 'Alert System', quantity: 1 },
        { icon: Camera, name: 'CCTV Camera', quantity: 1 },
        { icon: Radio, name: 'Alert Buttons', quantity: 1 },
      ],
      featured: false,
    },
    {
      id: 2,
      name: 'Standard Package',
      price: 21000,
      items: [
        { icon: Shield, name: 'Alert System', quantity: 1 },
        { icon: Camera, name: 'CCTV Camera', quantity: 2 },
        { icon: Radio, name: 'Alert Buttons', quantity: 1 },
      ],
      featured: false,
    },
    {
      id: 3,
      name: 'Advance Package',
      price: 22000,
      items: [
        { icon: Shield, name: 'Alert System', quantity: 1 },
        { icon: Camera, name: 'CCTV Camera', quantity: 2 },
        { icon: Radio, name: 'Alert Buttons', quantity: 2 },
      ],
      featured: true,
    },
    {
      id: 4,
      name: 'Enterprise Package',
      price: 25000,
      items: [
        { icon: Shield, name: 'Alert System', quantity: 1 },
        { icon: Camera, name: 'CCTV Camera', quantity: 4 },
        { icon: Radio, name: 'Alert Buttons', quantity: 2 },
      ],
      featured: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-4">
              Choose Your Security Package
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect protection plan for your needs. All packages include
              professional installation and 24/7 support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`relative rounded-2xl p-8 shadow-lg ${
                  pkg.featured
                    ? 'bg-gradient-to-b from-red-600 to-red-700 text-white'
                    : 'bg-white'
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-navy-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₱{pkg.price.toLocaleString()}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.items.map((item) => (
                    <li key={item.name} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      <span className="font-semibold">({item.quantity})</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuyNow(pkg.id)}
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                    pkg.featured
                      ? 'bg-white text-red-600 hover:bg-gray-100'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {authenticated ? 'Buy Now' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Compare Packages
            </h2>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-navy-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-navy-900">Basic</th>
                  <th className="text-center py-4 px-4 font-semibold text-navy-900">Standard</th>
                  <th className="text-center py-4 px-4 font-semibold text-red-600">Advanced</th>
                  <th className="text-center py-4 px-4 font-semibold text-navy-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Alert System</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">CCTV Cameras</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4">2</td>
                  <td className="text-center py-4 px-4">2</td>
                  <td className="text-center py-4 px-4">4</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">Alert Buttons</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4">2</td>
                  <td className="text-center py-4 px-4">2</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">24/7 Support</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-600">Professional Installation</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact us for enterprise solutions and custom security packages tailored
              to your specific needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
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
