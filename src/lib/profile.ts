import { supabase } from './supabase'

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  email: string | null
  created_at: string
  updated_at: string
}

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
