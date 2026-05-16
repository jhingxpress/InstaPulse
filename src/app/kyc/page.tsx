'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Shield, Upload, AlertCircle, Check, FileText, Camera } from 'lucide-react'

export default function KYCPage() {
  const [files, setFiles] = useState({
    validId: null as File | null,
    selfie: null as File | null,
    businessPermit: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'validId' | 'selfie' | 'businessPermit') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({
        ...files,
        [type]: e.target.files[0],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!files.validId || !files.selfie) {
      alert('Please upload valid ID and selfie')
      return
    }

    setLoading(true)

    try {
      // TODO: Implement file upload to Supabase Storage
      console.log('KYC submission:', files)
      setSuccess(true)
    } catch (error) {
      console.error('KYC submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-navy-900 mb-4">KYC Verification</h1>
            <p className="text-xl text-gray-600">
              Complete your identity verification to activate your account
            </p>
          </motion.div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Documents Submitted</h2>
              <p className="text-gray-600 mb-6">
                Your KYC documents have been submitted successfully. Our team will review your
                documents within 24-48 hours.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Go to Dashboard
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <ul className="space-y-1">
                      <li>• Ensure all documents are clear and readable</li>
                      <li>• Valid ID must be government-issued (passport, driver's license, etc.)</li>
                      <li>• Selfie must clearly show your face</li>
                      <li>• Business permit is optional for individual accounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Valid ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Valid Government ID <span className="text-red-600">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'validId')}
                      className="hidden"
                      id="validId"
                    />
                    <label htmlFor="validId" className="cursor-pointer">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      {files.validId ? (
                        <div>
                          <p className="font-semibold text-navy-900">{files.validId.name}</p>
                          <p className="text-sm text-gray-600">{(files.validId.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">PNG, JPG, PDF up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Selfie Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selfie Photo <span className="text-red-600">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'selfie')}
                      className="hidden"
                      id="selfie"
                    />
                    <label htmlFor="selfie" className="cursor-pointer">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      {files.selfie ? (
                        <div>
                          <p className="font-semibold text-navy-900">{files.selfie.name}</p>
                          <p className="text-sm text-gray-600">{(files.selfie.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Business Permit Upload (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Business Permit <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'businessPermit')}
                      className="hidden"
                      id="businessPermit"
                    />
                    <label htmlFor="businessPermit" className="cursor-pointer">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      {files.businessPermit ? (
                        <div>
                          <p className="font-semibold text-navy-900">{files.businessPermit.name}</p>
                          <p className="text-sm text-gray-600">{(files.businessPermit.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-400">PNG, JPG, PDF up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>{loading ? 'Uploading...' : 'Submit Documents'}</span>
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
