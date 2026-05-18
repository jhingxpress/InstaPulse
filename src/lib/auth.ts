import { supabase } from './supabase'
import { createClient } from './supabase-server'

/**
 * Sign up a new user with email and password
 * Profile is automatically created by PostgreSQL trigger
 */
export async function signUp(email: string, password: string, metadata: {
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

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase().auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error signing in:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase().auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Get the current session (server-side)
 */
export async function getSession() {
  const supabaseServer = createClient()
  const { data: { session }, error } = await supabaseServer.auth.getSession()

  if (error) {
    console.error('Error getting session:', error)
    return { session: null, error }
  }

  return { session, error: null }
}

/**
 * Get the current user (server-side)
 */
export async function getUser() {
  const supabaseServer = createClient()
  const { data: { user }, error } = await supabaseServer.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return { user: null, error }
  }

  return { user, error: null }
}
