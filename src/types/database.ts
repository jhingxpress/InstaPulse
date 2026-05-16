export interface User {
  id: string
  fullname: string
  email: string
  phone: string
  address: string
  role: 'client' | 'admin'
  created_at: string
}

export interface Package {
  id: string
  package_name: string
  price: number
  description: string
}

export interface PackageItem {
  id: string
  package_id: string
  item_name: string
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  package_id: string
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  payment_method: string
  reference_no: string
  created_at: string
}

export interface KYCDocument {
  id: string
  user_id: string
  valid_id_url: string
  selfie_url: string
  business_permit_url?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
