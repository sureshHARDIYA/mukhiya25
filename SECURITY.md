# Security Guide for Portfolio Chatbot

## Overview
This document outlines the comprehensive security measures implemented in the portfolio chatbot system and best practices for maintaining security.

## 🔒 Security Measures Implemented

### 1. Authentication & Authorization
- **Admin API Protection**: All admin endpoints require API key authentication with Bearer token
- **Rate Limiting**: Chat API limited to 30 requests per minute per IP
- **IP Whitelisting**: Optional IP restriction for admin access
- **Row Level Security**: Database-level access control via Supabase RLS

### 2. Input Validation & Sanitization
- **XSS Prevention**: Comprehensive input sanitization with HTML tag removal
- **SQL Injection Protection**: Pattern detection and parameterized queries
- **Input Length Limits**: Maximum 1000 characters for chat input
- **Content Filtering**: Detection of 25+ suspicious patterns including:
  - Script tags and event handlers
  - JavaScript protocols and data URLs
  - DOM manipulation attempts
  - Form elements and iframe injections
  - SQL commands and injection patterns

### 3. Content Security & Markdown Safety
- **ReactMarkdown Security**: Disabled dangerous elements (script, iframe, form, etc.)
- **URL Sanitization**: Only allows http://, https://, and mailto: protocols
- **Link Validation**: Prevents javascript: and data: URL schemes
- **Markdown Filtering**: Strips potentially harmful markdown elements

### 4. Network Security
- **Enhanced CSP**: Restrictive Content Security Policy with nonce support
- **Security Headers**: Comprehensive HTTP security headers including:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security
  - Permissions-Policy restrictions
- **CORS Protection**: Origin validation for state-changing requests
- **Request Origin Validation**: Middleware-level origin checking

### 5. Rate Limiting & DoS Protection
- **Chat API**: 30 requests per minute per IP
- **Memory-based**: In-memory rate limiting with automatic cleanup
- **Configurable**: Environment variable configuration support

### 6. Security Monitoring & Logging
- **Security Event Logging**: Comprehensive logging of:
  - Rate limit violations
  - Authentication failures
  - Suspicious input attempts
  - Invalid origin requests
- **Production Monitoring**: Ready for integration with monitoring services

## 🚨 Security Vulnerabilities & Mitigations

### High Priority - ✅ FIXED

1. **Input Validation Enhancement**: ✅ Implemented comprehensive validation
2. **Rate Limiting**: ✅ Added to chat API with 30 req/min limit
3. **XSS Prevention**: ✅ Enhanced with ReactMarkdown restrictions
4. **Admin API Security**: ✅ Authentication required for all admin routes
5. **CSRF Protection**: ✅ Origin validation middleware implemented

### Medium Priority - ✅ IMPLEMENTED

1. **Enhanced CSP**: ✅ Restrictive Content Security Policy
2. **Security Headers**: ✅ Comprehensive security headers
3. **SQL Injection Prevention**: ✅ Pattern detection and sanitization
4. **URL Sanitization**: ✅ Protocol and domain validation
5. **Security Logging**: ✅ Event logging system

### Low Priority - 🔄 RECOMMENDED

1. **Two-Factor Authentication**: For admin access
2. **Session Management**: Enhanced session tracking
3. **Database Encryption**: At-rest encryption for sensitive data
4. **Security Monitoring**: Integration with external monitoring services

## 🛡️ Security Testing

### Automated Testing
```bash
# Run comprehensive security tests
./scripts/security-test.sh http://localhost:3000

# Test specific vulnerabilities
curl -X POST 'http://localhost:3000/api/chat/respond' \
  -H 'Content-Type: application/json' \
  -d '{"query":"<script>alert(\"XSS\")</script>"}'
```

### Manual Testing Checklist
- [ ] XSS injection attempts blocked
- [ ] SQL injection patterns detected
- [ ] Rate limiting enforced
- [ ] Admin API requires authentication
- [ ] Security headers present
- [ ] Malicious markdown filtered
- [ ] JavaScript protocols blocked
- [ ] Input length limits enforced

## 🔍 Security Monitoring

### Key Metrics to Monitor
- Failed authentication attempts (> 5 per minute)
- Rate limit violations (> 10 per hour)
- Suspicious input patterns (> 3 per hour)
- Invalid origin requests (> 5 per hour)
- Database query anomalies

### Log Analysis Queries
```sql
-- Check for potential attacks in user_queries
SELECT query, detected_intent, created_at 
FROM user_queries 
WHERE query LIKE '%<script%' 
   OR query LIKE '%javascript:%'
   OR query LIKE '%SELECT%'
ORDER BY created_at DESC;

-- Monitor rate limit violations
SELECT ip, COUNT(*) as attempts, MAX(created_at) as last_attempt
FROM security_logs 
WHERE event_type = 'RATE_LIMIT'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip
HAVING COUNT(*) > 10;
```

## 🚀 Production Deployment Security

### Environment Configuration
```bash
# Generate secure API key
ADMIN_API_KEY=$(openssl rand -base64 32)

# Configure allowed origins
ALLOWED_ORIGINS=https://your-domain.com

# Set up IP whitelisting (optional)
ADMIN_ALLOWED_IPS=192.168.1.100,203.0.113.25

# Enable production security features
NODE_ENV=production
```

### Deployment Checklist
- [ ] Strong, unique API keys generated
- [ ] HTTPS enabled with valid certificates
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Security monitoring enabled
- [ ] Log aggregation set up
- [ ] Error tracking configured (Sentry)
- [ ] Rate limiting configured for production load
- [ ] CORS origins restricted to production domains

## 📝 Security Configuration Files

### Environment Variables (.env.local)
```bash
# Security Configuration
ADMIN_API_KEY=your_secure_random_key_here
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
ADMIN_ALLOWED_IPS=203.0.113.25
NODE_ENV=production
```

### Next.js Security Headers (next.config.mjs)
- Content Security Policy with nonce support
- Frame Options and XSS Protection
- Strict Transport Security
- Referrer Policy and Permissions Policy

## 🆘 Incident Response

### Security Incident Procedure
1. **Immediate Response** (< 5 minutes):
   - Identify the attack vector
   - Block malicious IPs if identified
   - Revoke compromised API keys

2. **Assessment** (< 30 minutes):
   - Analyze logs for scope of breach
   - Check database for unauthorized access
   - Verify data integrity

3. **Containment** (< 1 hour):
   - Apply additional security measures
   - Update authentication credentials
   - Patch identified vulnerabilities

4. **Recovery** (< 24 hours):
   - Restore from clean backups if needed
   - Implement additional monitoring
   - Update security documentation

### Emergency Contacts
- Development Team: [your-email@domain.com]
- Security Team: [security@domain.com]
- Infrastructure: [ops@domain.com]

## 📞 Security Reporting

### Vulnerability Disclosure
If you discover a security vulnerability:

1. **DO NOT** create public GitHub issues
2. **DO** email security concerns to: [security@domain.com]
3. **PROVIDE** detailed information:
   - Vulnerability description
   - Steps to reproduce
   - Potential impact assessment
   - Suggested mitigation

### Bug Bounty Program
We appreciate responsible disclosure and may offer rewards for:
- Critical vulnerabilities: $500-1000
- High severity: $100-500
- Medium severity: $50-100

## 🔧 Security Tools & Dependencies

### Dependencies
- `react-markdown`: Secure markdown rendering
- `@supabase/supabase-js`: Database security
- `next`: Framework security features

### Security Scanners
- `npm audit`: Dependency vulnerability scanning
- `eslint-plugin-security`: Static code analysis
- Custom security test suite

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Guidelines](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Last Updated**: August 24, 2025  
**Security Review**: Complete  
**Next Review**: September 24, 2025
