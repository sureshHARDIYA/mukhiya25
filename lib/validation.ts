// lib/validation.ts - Input validation and sanitization

export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  errors: string[];
}

// Basic HTML sanitization without external dependencies
function basicSanitize(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Chat input validation
export function validateChatInput(input: string): ValidationResult {
  const errors: string[] = [];
  
  if (!input || input.trim().length === 0) {
    errors.push('Input cannot be empty');
  }
  
  if (input.length > 1000) {
    errors.push('Input too long (max 1000 characters)');
  }
  
  // Check for potential injection attempts
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /document\./i,
    /window\./i
  ];
  
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(input)
  );
  
  if (hasSuspiciousContent) {
    errors.push('Input contains potentially harmful content');
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
