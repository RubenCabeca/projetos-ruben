# Supabase Integration Guide - StudyFlow AI

## 📋 Overview

Complete Supabase integration with authentication, database queries, and PDF storage for the StudyFlow AI SaaS platform.

## 🗂️ File Structure & Placement

### Environment Variables
**File:** `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://glpvziijmnrddoveyklj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pt43X3LeR8U_KeYthgaGcw_4xxOeiRl
```

### Core Supabase Utilities

#### 1. **`lib/supabase/client.ts`**
- **Purpose:** Browser-side Supabase client for client components
- **Usage:** Creating a reusable Supabase client instance
- **Exports:** `createClient()` function

#### 2. **`lib/supabase/server.ts`**
- **Purpose:** Server-side Supabase client for server components
- **Usage:** Server-side database operations (optional)
- **Exports:** `createServerClient()` function

#### 3. **`lib/supabase/types.ts`**
- **Purpose:** TypeScript type definitions for database tables
- **Tables Defined:**
  - `profiles` - User profile data (XP, streak, quizzes_completed)
  - `documents` - Uploaded PDF metadata
  - `quizzes` - Quiz attempt records
- **Usage:** Type-safe database queries

#### 4. **`lib/supabase/middleware.ts`**
- **Purpose:** Session management middleware
- **Usage:** Keeps auth tokens fresh in `middleware.ts`
- **Exports:** `updateSession()` function

#### 5. **`lib/utils.ts`**
- **Purpose:** Utility functions (date formatting, className helpers)
- **Functions:**
  - `formatDate()` - Smart date formatting
  - `cn()` - Classname utility

### Authentication Hooks

#### **`hooks/useAuth.ts`**
- **Purpose:** Main authentication hook
- **Functions Provided:**
  - `signUp(email, password, fullName?)` - Register new user
  - `signIn(email, password)` - Login user
  - `signOut()` - Logout and redirect to home
  - `user` - Current authenticated user
  - `session` - Current session object
  - `isAuthenticated` - Boolean auth state
  - `loading` - Loading state for auth operations
  - `error` - Error message if any

**Usage Example:**
```typescript
const { user, signIn, signOut, isAuthenticated, loading } = useAuth();

// Sign in
await signIn('user@example.com', 'password');

// Sign out
await signOut();
```

### Database Query Hooks

#### **`hooks/useSupabaseQuery.ts`**
- **Purpose:** Fetch data from Supabase database
- **Hooks Provided:**
  - `useProfile(userId)` - Get user profile data
  - `useDocuments(userId)` - Get user's uploaded PDFs

**Usage Example:**
```typescript
const { profile, loading } = useProfile(user?.id);
const { documents, loading: docsLoading } = useDocuments(user?.id);
```

### Storage Component

#### **`components/PDFUpload.tsx`**
- **Purpose:** PDF upload and management component
- **Features:**
  - Upload PDF files (max 10MB)
  - List uploaded documents
  - Delete documents
  - Real-time metadata storage
  - Error handling and success messages
- **Storage Bucket:** `study-files`
- **File Path:** `{userId}/{timestamp}-{filename}`

**Usage Example:**
```typescript
import { PDFUpload } from '@/components/PDFUpload';

<PDFUpload 
  userId={user?.id} 
  documents={documents || []}
  isLoading={isLoading}
  onUploadSuccess={() => refetch()}
/>
```

### Middleware

#### **`middleware.ts`**
- **Purpose:** Next.js middleware for session management
- **Usage:** Automatically refreshes auth tokens

## 📄 Updated Pages

### Authentication Pages

#### **`app/auth/login/page.tsx`**
- Email/password login form
- Auto-redirect authenticated users to dashboard
- Error handling with visual feedback
- Form validation

#### **`app/auth/register/page.tsx`**
- User registration form (email, password, full name)
- Email confirmation flow
- Success/error messages
- Link to login page

#### **`app/auth/profile/page.tsx`**
- User profile display with stats
- Shows: XP, streak, quizzes completed
- Sign out button
- Protected route (redirects unauthenticated users)

### Main Pages

#### **`app/page.tsx` (Home)**
- Landing page for unauthenticated users
- Auto-redirects authenticated users to dashboard
- CTA buttons for sign up/sign in

#### **`app/dashboard/page.tsx`**
- Displays user stats from database:
  - XP earned
  - Current streak
  - Quizzes completed
  - Number of uploaded PDFs
- Recent activity feed
- Protected route with loading states
- Real data fetching from `profiles` table

#### **`app/materials/page.tsx`**
- Lists uploaded PDFs
- Integrated `PDFUpload` component
- Shows file count
- Document metadata (date, size)
- Protected route for authenticated users

## 🔒 Database Schema

### Profiles Table
```sql
- id (UUID) - Primary key / User ID
- email (text) - User email
- full_name (text) - User's full name
- xp (integer) - Total experience points
- streak (integer) - Current study streak
- quizzes_completed (integer) - Total quizzes done
- created_at (timestamp) - Account creation date
- updated_at (timestamp) - Last update
- avatar_url (text) - Profile picture URL (optional)
```

### Documents Table
```sql
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to profiles
- filename (text) - Original filename
- storage_path (text) - Path in storage bucket
- size (integer) - File size in bytes
- created_at (timestamp) - Upload date
```

### Quizzes Table
```sql
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to profiles
- document_id (UUID) - Foreign key to documents
- score (integer) - Quiz score percentage
- total_questions (integer) - Number of questions
- created_at (timestamp) - Quiz attempt date
```

## 🚀 Authentication Flow

1. **User Registration**
   - Sign up at `/auth/register`
   - Data saved to `auth.users` (Supabase Auth)
   - Profile created in `profiles` table
   - Confirmation email sent

2. **User Login**
   - Sign in at `/auth/login`
   - Session stored in browser
   - Automatic redirect to `/dashboard`

3. **Session Persistence**
   - Auth tokens stored in cookies
   - Middleware keeps tokens fresh
   - Auto-logout on token expiration

4. **Protected Routes**
   - Pages check `useAuth()` hook
   - Redirect to login if not authenticated
   - Loading state shown during auth check

## 📁 PDF Storage

**Bucket Name:** `study-files`

**Storage Rules:**
- Files organized by user ID: `{user_id}/{filename}`
- Max file size: 10MB
- Only authenticated users can upload
- PDF format only
- Metadata stored in `documents` table

**Upload Flow:**
1. Upload file to storage bucket
2. Save metadata to `documents` table
3. Link document to user via `user_id`

## 🛠️ Common Tasks

### Get Current User
```typescript
const { user } = useAuth();
console.log(user?.email);
```

### Fetch User Profile
```typescript
const { profile } = useProfile(user?.id);
console.log(profile?.xp, profile?.streak);
```

### Fetch User Documents
```typescript
const { documents } = useDocuments(user?.id);
documents?.forEach(doc => console.log(doc.filename));
```

### Upload PDF
```typescript
<PDFUpload 
  userId={user?.id}
  onUploadSuccess={() => refetch()}
/>
```

### Sign Out
```typescript
const { signOut } = useAuth();
await signOut(); // Redirects to home
```

## ⚙️ Configuration

### Supabase Setup Required
1. Create Supabase project
2. Create tables using `supabase/schema.sql`
3. Create `study-files` storage bucket
4. Set up authentication providers (if needed)
5. Add environment variables to `.env.local`

### RLS Policies (Row Level Security)
For security, implement RLS policies:
- Users can only read/write their own profile
- Users can only read/write their own documents
- Users can only read/write their own quiz attempts

## 📦 Dependencies Used
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-helpers-nextjs` - Auth helpers (already installed)
- Next.js 14.2.5 - Framework
- React 18.3.1 - UI library

## 🔍 Debugging Tips

**Check Auth State:**
```typescript
const { user, session, loading } = useAuth();
console.log({ user, session, loading });
```

**Monitor Errors:**
```typescript
const { error } = useSupabaseQuery();
if (error) console.error('Query failed:', error);
```

**Test Upload:**
- Navigate to Materials page
- Use PDF upload component
- Check console for errors

## ✅ Build Status
- ✓ Build succeeds
- ✓ All TypeScript types correct
- ✓ Middleware configured
- ✓ All routes protected appropriately

---

## Next Steps
1. Create RLS policies in Supabase
2. Test authentication flow in browser
3. Add profile picture upload
4. Implement quiz scoring system
5. Add AI-powered summarization
