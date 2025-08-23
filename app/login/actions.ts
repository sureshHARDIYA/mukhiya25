'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Attempting login with:', data.email)

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message, error.status)
    // Instead of redirecting to error, let's redirect back to login with error info
    const errorParam = encodeURIComponent(error.message)
    redirect(`/login?error=${errorParam}`)
  }

  console.log('Login successful:', authData.user?.email)
  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Attempting signup with:', data.email)

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error.message, error.status)
    const errorParam = encodeURIComponent(error.message)
    redirect(`/login?error=${errorParam}`)
  }

  console.log('Signup successful:', authData.user?.email)
  revalidatePath('/', 'layout')
  redirect('/admin')
}
