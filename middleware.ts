import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { validateRequestOrigin, logSecurityEvent } from '@/lib/security'

export async function middleware(request: NextRequest) {
  // Get initial response from Supabase middleware
  let response = await updateSession(request)
  
  // Apply security headers manually if not a NextResponse
  if (!(response instanceof NextResponse)) {
    response = NextResponse.next()
  }

  // Apply comprehensive security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // Validate request origin for state-changing requests (only in production)
  if (process.env.NODE_ENV === 'production' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    if (!validateRequestOrigin(request)) {
      logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { reason: 'Invalid origin', url: request.url }
      })
      
      return new Response('Forbidden', { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
