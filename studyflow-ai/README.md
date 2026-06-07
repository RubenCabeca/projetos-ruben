# StudyFlow AI

StudyFlow AI is a production-style study platform built with Next.js, TypeScript, Tailwind CSS, Supabase, and OpenAI.

## Features
- Email authentication with Supabase
- Protected dashboard and profile pages
- Upload study notes and PDFs
- AI-generated summaries, quizzes, and flashcards
- Progress tracking and session analytics
- Dark/light theme support
- Responsive SaaS dashboard UI

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in Supabase and OpenAI credentials.
5. Run the development server:
   ```bash
   npm run dev
   ```

## Database
Use `supabase/schema.sql` to initialize the PostgreSQL schema in Supabase.

## Supabase Storage
Create a storage bucket called `study-files` in Supabase for uploaded notes and PDF assets. The app stores metadata in the `documents` table and file references in Storage.

## Project Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI and shell components
- `lib/` - Supabase and OpenAI helpers
- `supabase/schema.sql` - Database tables and constraints

## Notes
- Protect secret keys. Do not commit `.env.local`.
- Use Supabase storage for file uploads.
