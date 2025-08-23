import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('Testing Supabase connection...')
    
    const supabase = await createClient()
    
    // Test basic connection
    const { error: healthError } = await supabase
      .from('skills')
      .select('count(*)')
      .limit(1)
    
    if (healthError) {
      console.error('Health check failed:', healthError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: healthError.message 
      }, { status: 500 })
    }
    
    console.log('Database connection successful')
    
    // Try to create admin user using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'itsmeskm99@gmail.com',
      password: 'VSB33otmjijaji#',
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    })
    
    if (authError) {
      console.error('Admin creation failed:', authError)
      return NextResponse.json({ 
        error: 'Failed to create admin user', 
        details: authError.message 
      }, { status: 500 })
    }
    
    console.log('Admin user created successfully:', authData.user?.email)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      user: authData.user?.email 
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
