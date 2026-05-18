import { supabase } from './supabase'

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  email: string | null
  role: 'user' | 'admin' | 'superadmin'
  created_at: string
  updated_at: string
}

export type UserRole = 'user' | 'admin' | 'superadmin'

/**
 * Fetch the logged-in user's profile from Supabase
 * This uses RLS policies to ensure users can only access their own profile
 */
export async function getUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase().auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await (supabase() as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data as Profile
}

/**
 * Get the logged-in user's role
 * Returns null if user is not authenticated
 */
export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile()
  return profile ? profile.role : null
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const role = await getUserRole()
  if (!role) return false
  
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    admin: 2,
    superadmin: 3
  }
  
  return roleHierarchy[role] >= roleHierarchy[requiredRole]
}

/**
 * Check if the current user is an admin or superadmin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('admin')
}

/**
 * Check if the current user is a superadmin
 */
export async function isSuperAdmin(): Promise<boolean> {
  return await hasRole('superadmin')
}

/**
 * Update the logged-in user's profile data
 * This uses RLS policies to ensure users can only update their own profile
 */
export async function updateUserProfile(updates: Partial<Profile>): Promise<Profile | null> {
  const { data: { user } } = await supabase().auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await (supabase() as any)
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data as Profile
}

/**
 * Update a user's role (admin/superadmin only)
 * This uses RLS policies to ensure only authorized users can change roles
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  const { error } = await (supabase() as any)
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error)
    return false
  }

  return true
}

/**
 * Get all profiles (admin/superadmin only)
 * This uses RLS policies to ensure only authorized users can view all profiles
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await (supabase() as any)
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching profiles:', error)
    return []
  }

  return data as Profile[]
}

/**
 * Sign up a new user with profile data
 * The profile is automatically created by the PostgreSQL trigger
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: {
    full_name: string
    phone: string
    address: string
  }
) {
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
