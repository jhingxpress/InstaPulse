# Production-Ready RBAC System Documentation

## Overview

This is a comprehensive Role-Based Access Control (RBAC) system built with Supabase and Next.js (App Router). The system supports three roles: `user`, `admin`, and `superadmin`, with granular permissions enforced through Row Level Security (RLS) policies.

## Architecture

### Role Hierarchy

```
superadmin (Level 3)
  ↓ Can do everything
admin (Level 2)
  ↓ Can manage users but not assign superadmin
user (Level 1)
  ↓ Can only manage own profile
```

### Database Schema

#### Profiles Table
- `id` (UUID, primary key, references auth.users)
- `full_name` (TEXT)
- `phone` (TEXT)
- `address` (TEXT)
- `email` (TEXT)
- `role` (TEXT, default 'user', CHECK constraint: user/admin/superadmin)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Audit Logs Table
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `action` (TEXT)
- `target_table` (TEXT)
- `target_id` (TEXT)
- `old_data` (JSONB)
- `new_data` (JSONB)
- `created_at` (TIMESTAMP)

## Setup Instructions

### Step 1: Run SQL Setup

Run the SQL script in `supabase/rbac-setup.sql` in your Supabase SQL Editor:

```sql
-- This creates:
-- - profiles table with role support
-- - audit_logs table for tracking changes
-- - RLS policies for security
-- - PostgreSQL triggers for auto-creation and audit logging
-- - Performance indexes
```

### Step 2: Assign Superadmin

After running the SQL setup, assign the superadmin role to your email:

```sql
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = 'genecorbeta09@gmail.com';
```

### Step 3: Update Environment Variables

Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Install Dependencies (Optional)

For full SSR support with cookie handling:
```bash
npm install @supabase/ssr
```

Then update `src/lib/supabase-server.ts` to use the SSR client.

## API Reference

### Role Checking Functions

```typescript
import { getUserRole, hasRole, isAdmin, isSuperAdmin } from '@/lib/profile'

// Get current user's role
const role = await getUserRole() // 'user' | 'admin' | 'superadmin' | null

// Check if user has specific role
const canAccess = await hasRole('admin') // true if admin or superadmin

// Quick checks
const isAdminUser = await isAdmin() // true if admin or superadmin
const isSuperAdminUser = await isSuperAdmin() // true only if superadmin
```

### Profile Management

```typescript
import { getUserProfile, updateUserProfile, getAllProfiles, updateUserRole } from '@/lib/profile'

// Get current user's profile
const profile = await getUserProfile()

// Update own profile
const updated = await updateUserProfile({
  full_name: 'New Name',
  phone: '+63 912 345 6789'
})

// Get all profiles (admin/superadmin only)
const allProfiles = await getAllProfiles()

// Update user role (admin/superadmin only)
const success = await updateUserRole(userId, 'admin')
```

### Authentication Functions

```typescript
import { signUp, signIn, signOut, getSession, getUser } from '@/lib/auth'

// Sign up with profile data
const { data, error } = await signUp('user@example.com', 'password', {
  full_name: 'John Doe',
  phone: '+63 912 345 6789',
  address: '123 Street, City'
})

// Sign in
const { data, error } = await signIn('user@example.com', 'password')

// Sign out
const { error } = await signOut()

// Get session (server-side)
const { session, error } = await getSession()

// Get user (server-side)
const { user, error } = await getUser()
```

## Security Features

### Row Level Security (RLS)

**Profiles Table:**
- Users can SELECT only their own profile
- Users can UPDATE only their own profile
- Superadmin can SELECT/UPDATE all profiles
- Admin can SELECT all profiles but cannot change roles to superadmin

**Audit Logs Table:**
- Only superadmin can SELECT audit logs
- Only system (via trigger) can INSERT audit logs

### PostgreSQL Triggers

1. **Automatic Profile Creation**: When a new user signs up in `auth.users`, a profile is automatically created in `public.profiles` with:
   - Data from `raw_user_meta_data` (full_name, phone, address)
   - Email from `auth.users.email`
   - Default role: 'user'

2. **Audit Logging**: All INSERT/UPDATE/DELETE operations on profiles are automatically logged to `audit_logs` with:
   - User ID who made the change
   - Action performed
   - Old and new data
   - Timestamp

### Security Rules

1. **Never trust frontend role checks alone** - All permissions are enforced by RLS
2. **Service role key must NEVER be exposed to client** - Only use anon key on client
3. **Only superadmin can modify roles** - Enforced by RLS policy
4. **Admin cannot promote themselves to superadmin** - Enforced by RLS policy
5. **All profile changes are automatically logged** - Complete audit trail

## Route Protection

### Middleware

The middleware (`src/middleware.ts`) protects routes:

- `/dashboard` - Authenticated users only
- `/admin` - Admin or superadmin only
- `/superadmin` - Superadmin only

Unauthorized users are redirected to `/403`.

### 403 Page

The 403 page (`src/app/403/page.tsx`) displays when users try to access routes they don't have permission for.

## Dashboard Pages

### Admin Dashboard (`/admin`)

**Features:**
- System overview with user statistics
- User management with search
- Role assignment (admin cannot assign superadmin)
- View user details
- KYC approvals (placeholder)
- Support messages (placeholder)
- Order management (placeholder)
- Payment monitoring (placeholder)
- Settings (placeholder)

**Access:** Admin and superadmin only

### Superadmin Dashboard (`/superadmin`)

**Features:**
- System overview with detailed statistics
- Full user management
- Role assignment (including superadmin)
- User deletion (via Supabase admin API)
- Audit log viewer
- System settings (placeholder)

**Access:** Superadmin only

## Data Flow

### Registration Flow

```
1. User fills registration form
   ↓
2. signUpWithEmail() called with metadata
   ↓
3. Supabase Auth creates user in auth.users
   ↓
4. PostgreSQL trigger creates profile in public.profiles
   ↓
5. Profile data populated from metadata
   ↓
6. Default role: 'user'
```

### Role Change Flow

```
1. Admin/superadmin changes user role
   ↓
2. updateUserRole() called
   ↓
3. RLS policy checks permissions
   ↓
4. If authorized, profile updated
   ↓
5. Audit trigger logs the change
   ↓
6. Audit log stored in audit_logs table
```

## Troubleshooting

### Profile not created after registration

- Ensure the PostgreSQL trigger is enabled
- Check that the SQL setup script was run successfully
- Verify RLS policies are not blocking the trigger
- Check Supabase logs for errors

### Role changes not working

- Verify user has admin or superadmin role
- Check RLS policies are correctly configured
- Ensure the user is authenticated
- Check Supabase logs for permission errors

### Cannot access admin/superadmin routes

- Verify user has the correct role in the profiles table
- Check middleware is correctly configured
- Ensure session is valid
- Check browser console for errors

### Audit logs not appearing

- Ensure the audit trigger is enabled
- Check that the trigger function has SECURITY DEFINER
- Verify RLS policies allow system inserts
- Check Supabase logs for trigger errors

## Production Considerations

### Security

- **Email Verification**: Enable email confirmation in Supabase Auth settings
- **Rate Limiting**: Configure rate limiting on authentication endpoints
- **Password Policies**: Enforce strong password requirements
- **Session Management**: Configure appropriate session timeouts
- **Monitoring**: Set up logging for authentication events
- **Regular Audits**: Review audit logs regularly

### Performance

- **Indexes**: All tables have appropriate indexes for common queries
- **Connection Pooling**: Configure Supabase connection pooling
- **Caching**: Consider caching frequently accessed data
- **Pagination**: Implement pagination for large datasets

### Backup

- **Regular Backups**: Enable automated backups in Supabase
- **Point-in-Time Recovery**: Configure PITR for critical data
- **Export Audit Logs**: Regularly export audit logs for long-term storage

## TypeScript Types

After running the SQL setup, regenerate your Supabase TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Or use the Supabase CLI:
```bash
supabase gen types typescript --linked > src/types/supabase.ts
```

## Example Usage

### Protected Server Component

```typescript
import { getUser } from '@/lib/auth'
import { isAdmin } from '@/lib/profile'

export default async function AdminPage() {
  const { user } = await getUser()
  const adminCheck = await isAdmin()
  
  if (!user || !adminCheck) {
    return <div>Access Denied</div>
  }
  
  // Render admin content
}
```

### Protected Client Component

```typescript
'use client'

import { useEffect, useState } from 'react'
import { isAdmin } from '@/lib/profile'

export default function AdminButton() {
  const [isAdminUser, setIsAdminUser] = useState(false)
  
  useEffect(() => {
    isAdmin().then(setIsAdminUser)
  }, [])
  
  if (!isAdminUser) return null
  
  return <button>Admin Action</button>
}
```

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Client-side Supabase client
│   ├── supabase-server.ts   # Server-side Supabase client
│   ├── profile.ts           # Profile & role management
│   └── auth.ts              # Authentication utilities
├── app/
│   ├── admin/
│   │   └── page.tsx         # Admin dashboard
│   ├── superadmin/
│   │   └── page.tsx         # Superadmin dashboard
│   ├── 403/
│   │   └── page.tsx         # Forbidden page
│   └── middleware.ts        # Route protection
└── supabase/
    └── rbac-setup.sql       # SQL setup script
```

## Support

For issues or questions:
1. Check the Supabase logs for errors
2. Verify RLS policies are correctly configured
3. Ensure all SQL setup steps were completed
4. Review audit logs for troubleshooting

## License

This RBAC system is proprietary software. All rights reserved.
