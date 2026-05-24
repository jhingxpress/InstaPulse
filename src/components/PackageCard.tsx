'use client'

import { motion } from 'framer-motion'
import { Shield, Camera, Radio } from 'lucide-react'

interface PackageItem {
  icon: any
  name: string
  quantity: number
}

interface PackageCardProps {
  id: number
  name: string
  price: number
  items: PackageItem[]
  featured: boolean
  isSelected: boolean
  onSelect: () => void
  pluralize: (name: string, qty: number) => string
}

export default function PackageCard({
  id,
  name,
  price,
  items,
  featured,
  isSelected,
  onSelect,
  pluralize,
}: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: isSelected ? 1 : 1.05, y: isSelected ? 0 : -10 }}
      onClick={onSelect}
      className={`relative rounded-2xl p-8 shadow-lg cursor-pointer transition-all ${
        isSelected
          ? 'ring-4 ring-red-500 scale-105 z-10'
          : featured
          ? 'bg-gradient-to-b from-red-600 to-red-700 text-white'
          : 'bg-white'
      } ${!isSelected ? 'opacity-60 hover:opacity-100' : ''}`}
    >
      {featured && !isSelected && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-navy-900 px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}

      <h3 className={`text-2xl font-bold mb-2 ${isSelected ? 'text-navy-900' : ''}`}>{name}</h3>
      <div className="mb-6">
        <span className={`text-4xl font-bold ${isSelected ? 'text-navy-900' : ''}`}>
          ₱{price.toLocaleString()}
        </span>
      </div>

      <ul className="space-y-4 mb-8">
        {items.map((item) => (
          <li key={item.name} className="flex items-center space-x-3">
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{pluralize(item.name, item.quantity)}</span>
            <span className="font-semibold">({item.quantity})</span>
          </li>
        ))}
      </ul>

      <button
        className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
          featured && !isSelected
            ? 'bg-white text-red-600 hover:bg-gray-100'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {isSelected ? 'View Details' : 'Select Package'}
      </button>
    </motion.div>
  )
}
