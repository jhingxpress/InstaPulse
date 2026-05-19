import { supabase } from './supabase'

export type UserRole = 'user' | 'admin' | 'superadmin'

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  email: string | null
  role: UserRole
  kyc_status: string | null
  created_at: string
  updated_at: string
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase().auth.getUser()
  
  if (!user) return null

  const { data, error } = await (supabase() as any)
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: Partial<Profile>): Promise<boolean> {
  const { data: { user } } = await supabase().auth.getUser()
  
  if (!user) return false

  const { error } = await (supabase() as any)
    .from('users')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return false
  }

  return true
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile()
  return profile?.role || null
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole()
  
  if (!userRole) return false
  
  // Superadmin has all permissions
  if (userRole === 'superadmin') return true
  
  // Admin has user permissions
  if (role === 'user' && userRole === 'admin') return true
  
  return userRole === role
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('admin')
}

/**
 * Check if the current user is a superadmin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'superadmin'
}

/**
 * Update a user's role (admin or superadmin only)
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  const { error } = await (supabase() as any)
    .from('users')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error)
    return false
  }

  return true
}

/**
 * Get all profiles (admin or superadmin only)
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await (supabase() as any)
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching profiles:', error)
    return []
  }

  return data || []
}

/**
 * Sign up with email and create profile
 */
export async function signUpWithEmail(email: string, password: string, metadata: {
  full_name: string
  phone: string
  address: string
}) {
  const { data, error } = await supabase().auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  if (error) {
    console.error('Error signing up:', error)
    return { data: null, error }
  }

  return { data, error: null }
}
