// lib/security.ts - Comprehensive security utilities

import { NextRequest, NextResponse } from 'next/server';

// Security headers for all responses
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none'
};

// CSRF protection
export function generateCSRFToken(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Input sanitization for different contexts
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeSQL(input: string): string {
  return input
    .replace(/['\";\\]/g, '')
    .replace(/\b(union|select|insert|update|delete|drop|create|alter|exec|execute|sp_|xp_)\b/gi, '')
    .trim()
    .slice(0, 500);
}

export function sanitizeUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return null;
    }
    
    // Block localhost and private IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsedUrl.hostname;
      if (hostname === 'localhost' || 
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          hostname.startsWith('172.')) {
        return null;
      }
    }
    
    return parsedUrl.toString();
  } catch {
    return null;
  }
}

// Content validation
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }
  
  return { valid: true };
}

// Request validation
export function validateRequestOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  
  if (origin && !allowedOrigins.includes(origin)) {
    return false;
  }
  
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      if (!allowedOrigins.includes(refererOrigin)) {
        return false;
      }
    } catch {
      return false;
    }
  }
  
  return true;
}

// Security logging
export function logSecurityEvent(event: {
  type: 'RATE_LIMIT' | 'INVALID_INPUT' | 'AUTH_FAILURE' | 'SUSPICIOUS_ACTIVITY';
  ip: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}) {
  const timestamp = new Date().toISOString();
  console.warn(`[SECURITY] ${timestamp} - ${event.type}`, {
    ip: event.ip,
    userAgent: event.userAgent,
    details: event.details
  });
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to monitoring service like Sentry, DataDog, etc.
  }
}

// IP whitelist checking
export function isIPWhitelisted(ip: string): boolean {
  const whitelist = process.env.IP_WHITELIST?.split(',') || [];
  if (whitelist.length === 0) return true; // No whitelist means all IPs allowed
  
  return whitelist.includes(ip);
}

// Honeypot detection
export function checkHoneypot(formData: Record<string, string>): boolean {
  // Check for hidden honeypot fields that should be empty
  const honeypotFields = ['email_confirm', 'phone', 'website_url'];
  return honeypotFields.some(field => formData[field] && formData[field].trim() !== '');
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check against common passwords
  const commonPasswords = ['password', '123456', 'admin', 'user', 'guest'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
  }
  
  return { valid: errors.length === 0, errors };
}

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
