# Production-Ready Supabase Authentication System

## Overview

This authentication system uses Supabase Auth for user management with a separate `profiles` table for additional user data. The system is designed with security, scalability, and clean separation of concerns in mind.

## Architecture

### Separation of Concerns

- **auth.users** (Supabase Auth): Managed by Supabase, handles authentication, email verification, password reset
- **public.profiles** (Custom table): Stores additional user data (full_name, phone, address, email)

### Data Flow

```
1. User Registration
   ↓
2. Supabase Auth creates user in auth.users
   ↓
3. PostgreSQL trigger automatically creates profile in public.profiles
   ↓
4. Profile data is populated from raw_user_meta_data and auth.users.email
   ↓
5. User can now access their profile via RLS-protected queries
```

## Setup Instructions

### Step 1: Run SQL Setup

Run the SQL script in `supabase/profiles-setup.sql` in your Supabase SQL Editor:

```sql
-- This creates:
-- - profiles table with proper schema
-- - RLS policies for security
-- - PostgreSQL trigger for automatic profile creation
-- - Indexes for performance
```

### Step 2: Update Environment Variables

Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Use the Profile Library

Import and use the functions from `src/lib/profile.ts`:

```typescript
import { getUserProfile, updateUserProfile, signUpWithEmail } from '@/lib/profile'
```

## API Reference

### signUpWithEmail

Sign up a new user with profile data. The profile is automatically created by the PostgreSQL trigger.

```typescript
const { data, error } = await signUpWithEmail(
  'user@example.com',
  'password123',
  {
    full_name: 'John Doe',
    phone: '+63 912 345 6789',
    address: '123 Street, City'
  }
)
```

### getUserProfile

Fetch the logged-in user's profile. Uses RLS to ensure users can only access their own data.

```typescript
const profile = await getUserProfile()
if (profile) {
  console.log(profile.full_name, profile.phone, profile.address)
}
```

### updateUserProfile

Update the logged-in user's profile data. Uses RLS to ensure users can only update their own data.

```typescript
const updatedProfile = await updateUserProfile({
  full_name: 'John Updated',
  phone: '+63 912 345 6789',
  address: '456 New Street, City'
})
```

## Security Features

### Row Level Security (RLS)

- **SELECT**: Users can only view their own profile (`auth.uid() = id`)
- **INSERT**: Users can only insert their own profile
- **UPDATE**: Users can only update their own profile

### PostgreSQL Trigger

Automatically creates a profile when a new user is created in `auth.users`, ensuring:
- No manual profile insertion needed in application code
- Data consistency between auth.users and profiles
- Automatic population of profile data from metadata

### Cascade Delete

When a user is deleted from `auth.users`, their profile is automatically deleted from `public.profiles` due to the `ON DELETE CASCADE` constraint.

## TypeScript Notes

After running the SQL setup, regenerate your Supabase TypeScript types to resolve type errors:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Or use the Supabase CLI:
```bash
supabase gen types typescript --linked > src/types/supabase.ts
```

## Example Usage in Components

### Registration Page

```typescript
import { signUpWithEmail } from '@/lib/profile'

const handleRegister = async (formData) => {
  const { data, error } = await signUpWithEmail(
    formData.email,
    formData.password,
    {
      full_name: formData.fullname,
      phone: formData.phone,
      address: formData.address
    }
  )
  
  if (error) {
    setError(error.message)
  } else {
    // Profile automatically created by trigger
    setSuccess(true)
  }
}
```

### Profile Page

```typescript
import { getUserProfile, updateUserProfile } from '@/lib/profile'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  
  useEffect(() => {
    getUserProfile().then(setProfile)
  }, [])
  
  const handleUpdate = async (updates) => {
    const updated = await updateUserProfile(updates)
    if (updated) {
      setProfile(updated)
    }
  }
  
  // Render profile form...
}
```

## Troubleshooting

### Profile not created after registration

- Ensure the PostgreSQL trigger is enabled in Supabase
- Check that the SQL setup script was run successfully
- Verify RLS policies are not blocking the trigger

### TypeScript errors

- Run the SQL setup script first
- Regenerate Supabase TypeScript types
- If errors persist, the `@ts-ignore` comments in `src/lib/profile.ts` can be removed after types are regenerated

### Permission errors

- Verify RLS policies are correctly configured
- Check that the user is authenticated (`auth.uid()` is not null)
- Ensure the trigger function has `SECURITY DEFINER` permissions

## Production Considerations

- **Email Verification**: Enable email confirmation in Supabase Auth settings
- **Rate Limiting**: Configure rate limiting on authentication endpoints
- **Password Policies**: Enforce strong password requirements
- **Session Management**: Configure appropriate session timeouts
- **Monitoring**: Set up logging for authentication events
- **Backup**: Regular backups of the profiles table
