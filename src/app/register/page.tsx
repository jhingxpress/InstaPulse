'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Shield, Mail, Lock, User, Phone, MapPin, AlertCircle, Check, Eye, EyeOff, X } from 'lucide-react'
import { useRecaptcha } from '@/hooks/useRecaptcha'

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const { getToken } = useRecaptcha()

  // --- Validation rules ---
  const validate = (data: typeof formData) => {
    const errs: Record<string, string> = {}
    if (!data.fullname.trim()) errs.fullname = 'Full name is required.'
    else if (data.fullname.trim().length < 3) errs.fullname = 'Full name must be at least 3 characters.'

    if (!data.phone.trim()) errs.phone = 'Phone number is required.'
    else if (!/^(\+63|0)[0-9]{9,10}$/.test(data.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid Philippine phone number (e.g. 09XX XXX XXXX).'

    if (!data.email.trim()) errs.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email address.'

    if (!data.address.trim()) errs.address = 'Address is required.'
    else if (data.address.trim().length < 10) errs.address = 'Please enter your complete address.'

    if (!data.password) errs.password = 'Password is required.'
    else if (data.password.length < 8) errs.password = 'Password must be at least 8 characters.'
    else if (!/[A-Z]/.test(data.password)) errs.password = 'Password must contain at least one uppercase letter.'
    else if (!/[0-9]/.test(data.password)) errs.password = 'Password must contain at least one number.'

    if (!data.confirmPassword) errs.confirmPassword = 'Please confirm your password.'
    else if (data.password !== data.confirmPassword) errs.confirmPassword = 'Passwords do not match.'

    return errs
  }

  const fieldErrors = validate(formData)
  const isFormValid = Object.keys(fieldErrors).length === 0

  // Password strength
  const pwChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  }
  const pwStrength = Object.values(pwChecks).filter(Boolean).length
  const pwStrengthLabel = pwStrength <= 1 ? 'Weak' : pwStrength === 2 ? 'Fair' : pwStrength === 3 ? 'Good' : 'Strong'
  const pwStrengthColor = pwStrength <= 1 ? 'bg-red-500' : pwStrength === 2 ? 'bg-yellow-500' : pwStrength === 3 ? 'bg-blue-500' : 'bg-green-500'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true })
  }

  const fieldClass = (name: string) => {
    const hasError = touched[name] && fieldErrors[name]
    const isValid = touched[name] && !fieldErrors[name] && formData[name as keyof typeof formData]
    return `w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
      hasError
        ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50'
        : isValid
        ? 'border-green-400 focus:ring-2 focus:ring-green-400 bg-green-50'
        : 'border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent'
    }`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ fullname: true, email: true, phone: true, address: true, password: true, confirmPassword: true })
    if (!isFormValid) return
    setError('')
    setLoading(true)

    try {
      const recaptchaToken = await getToken('register')
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullname,
          phone: formData.phone,
          address: formData.address,
          redirect: redirect !== '/dashboard' ? redirect : undefined,
          recaptchaToken: recaptchaToken ?? undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Registration failed.')
      setSuccess(true)
      router.push(`/verify-pending?email=${encodeURIComponent(formData.email)}&redirect=${encodeURIComponent(redirect)}`)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const RequiredStar = () => <span className="text-red-500 ml-0.5">*</span>

  const FieldError = ({ name }: { name: string }) =>
    touched[name] && fieldErrors[name] ? (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-red-600 flex items-center space-x-1">
        <X className="h-3 w-3 flex-shrink-0" />
        <span>{fieldErrors[name]}</span>
      </motion.p>
    ) : null

  const FieldValid = ({ name }: { name: string }) =>
    touched[name] && !fieldErrors[name] && formData[name as keyof typeof formData] ? (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-green-600 flex items-center space-x-1">
        <Check className="h-3 w-3 flex-shrink-0" />
        <span>Looks good!</span>
      </motion.p>
    ) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join InstaPulse to enhance your security</p>
              <p className="text-xs text-gray-400 mt-1">All fields marked <span className="text-red-500">*</span> are required</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Full Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <RequiredStar />
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="fullname" name="fullname" type="text"
                      value={formData.fullname} onChange={handleChange} onBlur={handleBlur}
                      className={fieldClass('fullname')} placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <FieldError name="fullname" />
                  <FieldValid name="fullname" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <RequiredStar />
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="phone" name="phone" type="tel"
                      value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                      className={fieldClass('phone')} placeholder="09XX XXX XXXX"
                    />
                  </div>
                  <FieldError name="phone" />
                  <FieldValid name="phone" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <RequiredStar />
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email" name="email" type="email"
                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('email')} placeholder="you@example.com"
                  />
                </div>
                <FieldError name="email" />
                <FieldValid name="email" />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Complete Address <RequiredStar />
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="address" name="address" type="text"
                    value={formData.address} onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('address')} placeholder="House No., Street, Barangay, City, Province"
                  />
                </div>
                <FieldError name="address" />
                <FieldValid name="address" />
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password <RequiredStar />
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password" name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password} onChange={handleChange} onBlur={handleBlur}
                      className={`${fieldClass('password')} pr-12`} placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FieldError name="password" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password <RequiredStar />
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword" name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                      className={`${fieldClass('confirmPassword')} pr-12`} placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FieldError name="confirmPassword" />
                  <FieldValid name="confirmPassword" />
                </div>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Password Strength</span>
                    <span className={`text-sm font-semibold ${
                      pwStrength <= 1 ? 'text-red-600' : pwStrength === 2 ? 'text-yellow-600' : pwStrength === 3 ? 'text-blue-600' : 'text-green-600'
                    }`}>{pwStrengthLabel}</span>
                  </div>
                  <div className="flex space-x-1 mb-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength ? pwStrengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { check: pwChecks.length, label: 'At least 8 characters' },
                      { check: pwChecks.upper, label: 'One uppercase letter' },
                      { check: pwChecks.number, label: 'One number' },
                      { check: pwChecks.special, label: 'Special character' },
                    ].map(({ check, label }) => (
                      <div key={label} className="flex items-center space-x-1.5">
                        {check
                          ? <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                          : <X className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />}
                        <span className={`text-xs ${check ? 'text-green-700' : 'text-gray-400'}`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3.5 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  href={redirect !== '/dashboard' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-white to-gray-50"><Navigation /></div>}>
      <RegisterPageContent />
    </Suspense>
  )
}
