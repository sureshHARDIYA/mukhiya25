// lib/validation.ts - Input validation and sanitization
import { detectProfanity, logProfanityAttempt } from './profanity-filter';

export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  errors: string[];
  isProfane?: boolean;
  moralResponse?: string;
  severity?: 'low' | 'medium' | 'high';
}

// Basic HTML sanitization without external dependencies
function basicSanitize(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data URLs that could contain encoded scripts
    .replace(/vbscript:/gi, '') // Remove vbscript URLs
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .trim();
}

// Chat input validation
export function validateChatInput(input: string, clientIP?: string): ValidationResult {
  const errors: string[] = [];
  
  if (!input || input.trim().length === 0) {
    errors.push('Input cannot be empty');
  }
  
  if (input.length > 1000) {
    errors.push('Input too long (max 1000 characters)');
  }

  // Check for profanity FIRST (highest priority)
  const profanityResult = detectProfanity(input);
  if (profanityResult.isProfane) {
    // Log the profanity attempt
    logProfanityAttempt(input, profanityResult.detectedWords, profanityResult.severity, clientIP);
    
    return {
      isValid: false,
      errors: ['Content contains inappropriate language'],
      isProfane: true,
      moralResponse: profanityResult.fullResponse,
      severity: profanityResult.severity
    };
  }
  
  // Check for potential injection attempts
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /onmouseover=/i,
    /onfocus=/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
    /alert\(/i,
    /confirm\(/i,
    /prompt\(/i,
    /execCommand/i,
    /innerHTML/i,
    /outerHTML/i,
    /insertAdjacentHTML/i,
    /document\.write/i,
    /document\.writeln/i,
    /style\s*=.*expression/i,
    /style\s*=.*javascript/i,
    /vbscript:/i,
    /data:text\/html/i,
    /data:image\/svg\+xml/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<applet/i,
    /<form/i,
    /<input/i,
    /<textarea/i
  ];
  
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(input)
  );
  
  if (hasSuspiciousContent) {
    errors.push('Input contains potentially harmful content');
  }
  
  // Check for SQL injection patterns (more targeted)
  const sqlPatterns = [
    /(\;.*\-\-)|(\bunion\s+select\b)|(\bselect\s+\*\s+from\b)|(\bdrop\s+table\b)|(\bdelete\s+from\b)|(\bupdate\s+\w+\s+set\b)|(\binsert\s+into\b)|(\bexec\s*\()|(\bexecute\s*\()/i,
    /(\'\s*;\s*drop\b)|(\'\s*;\s*delete\b)|(\'\s*;\s*update\b)|(\'\s*union\b)|(\'\s*or\s+\w+\s*=)/i,
    /(--\s*$)|(\/\*.*\*\/)/
  ];
  
  const hasSqlContent = sqlPatterns.some(pattern => pattern.test(input));
  if (hasSqlContent) {
    errors.push('Input contains potentially harmful SQL patterns');
  }
  
  // Sanitize content
  const sanitized = basicSanitize(input);
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

// SQL injection prevention for dynamic queries
export function sanitizeForDatabase(input: string): string {
  return input
    .replace(/[';\\]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 500); // Limit length
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// API parameter validation
export function validatePaginationParams(
  page?: string, 
  limit?: string
): { page: number; limit: number; errors: string[] } {
  const errors: string[] = [];
  
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;
  
  if (isNaN(pageNum) || pageNum < 1) {
    errors.push('Page must be a positive integer');
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum)),
    errors
  };
}
