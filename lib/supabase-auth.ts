// lib/supabase-auth.ts - Enhanced Supabase client with auth
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth utilities
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Check if user is admin
export const isAdminUser = async () => {
  const { user } = await getCurrentUser()
  if (!user) return false

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, is_active, role')
    .eq('id', user.id)
    .single()

  return adminUser?.is_active === true
}

// Database types for portfolio data
export interface Skill {
  id: number
  category_name: string
  skill_name: string
  skill_level: number
  color: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: number
  degree: string
  institution: string
  start_year: number | null
  end_year: number | null
  description: string | null
  status: 'completed' | 'current' | 'pending'
  grade: string | null
  location: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: number
  title: string
  company: string
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description: string[]
  technologies: string[]
  location: string | null
  employment_type: string
  company_url: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  title: string
  description: string | null
  long_description: string | null
  technologies: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  status: 'completed' | 'in-progress' | 'planned' | 'archived'
  featured: boolean
  start_date: string | null
  end_date: string | null
  category: string | null
  difficulty_level: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ResearchPaper {
  id: number
  title: string
  authors: string[]
  publication: string | null
  publication_date: string | null
  abstract: string | null
  doi: string | null
  url: string | null
  pdf_url: string | null
  keywords: string[]
  citation_count: number
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PersonalInfo {
  id: number
  key: string
  value: string | null
  data_type: 'text' | 'json' | 'array' | 'url' | 'email'
  is_public: boolean
  description: string | null
  created_at: string
  updated_at: string
}
