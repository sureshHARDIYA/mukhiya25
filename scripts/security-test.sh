#!/bin/bash

# Security Testing Script for Portfolio Chatbot
# This script tests various security vulnerabilities

echo "🔐 Portfolio Chatbot Security Testing"
echo "======================================"

BASE_URL=${1:-"http://localhost:3000"}
API_KEY=${2:-"test-key"}

echo "Testing against: $BASE_URL"
echo ""

# Test 1: XSS Injection in Chat
echo "🧪 Test 1: XSS Injection in Chat"
curl -s -X POST "$BASE_URL/api/chat/respond" \
  -H "Content-Type: application/json" \
  -d '{"query":"<script>alert(\"XSS\")</script>"}' | \
  jq -r '.error // "❌ XSS test failed - input not properly sanitized"'
echo ""

# Test 2: SQL Injection
echo "🧪 Test 2: SQL Injection Attempt"
curl -s -X POST "$BASE_URL/api/chat/respond" \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT * FROM users; DROP TABLE responses;"}' | \
  jq -r '.error // "❌ SQL injection test failed"'
echo ""

# Test 3: JavaScript Protocol Injection
echo "🧪 Test 3: JavaScript Protocol Injection"
curl -s -X POST "$BASE_URL/api/chat/respond" \
  -H "Content-Type: application/json" \
  -d '{"query":"javascript:alert(1)"}' | \
  jq -r '.error // "❌ JavaScript protocol test failed"'
echo ""

# Test 4: Rate Limiting
echo "🧪 Test 4: Rate Limiting (sending 35 requests rapidly)"
for i in {1..35}; do
  response=$(curl -s -X POST "$BASE_URL/api/chat/respond" \
    -H "Content-Type: application/json" \
    -d '{"query":"test"}')
  
  if echo "$response" | grep -q "Rate limit exceeded"; then
    echo "✅ Rate limiting working - blocked at request $i"
    break
  fi
  
  if [ $i -eq 35 ]; then
    echo "❌ Rate limiting not working - all 35 requests succeeded"
  fi
done
echo ""

# Test 5: Admin API without Authentication
echo "🧪 Test 5: Admin API Access without Authentication"
response=$(curl -s -X GET "$BASE_URL/api/admin/responses")
if echo "$response" | grep -q "Unauthorized"; then
  echo "✅ Admin API properly protected"
else
  echo "❌ Admin API not properly protected"
fi
echo ""

# Test 6: CSRF Protection
echo "🧪 Test 6: Cross-Origin Request"
curl -s -X POST "$BASE_URL/api/chat/respond" \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil-site.com" \
  -d '{"query":"test"}' | \
  grep -q "Forbidden" && echo "✅ CORS protection working" || echo "❌ CORS protection needs improvement"
echo ""

# Test 7: Security Headers
echo "🧪 Test 7: Security Headers"
headers=$(curl -s -I "$BASE_URL")

echo "Checking security headers:"
echo "$headers" | grep -q "X-Content-Type-Options" && echo "✅ X-Content-Type-Options present" || echo "❌ X-Content-Type-Options missing"
echo "$headers" | grep -q "X-Frame-Options" && echo "✅ X-Frame-Options present" || echo "❌ X-Frame-Options missing"
echo "$headers" | grep -q "X-XSS-Protection" && echo "✅ X-XSS-Protection present" || echo "❌ X-XSS-Protection missing"
echo "$headers" | grep -q "Content-Security-Policy" && echo "✅ Content-Security-Policy present" || echo "❌ Content-Security-Policy missing"
echo ""

# Test 8: Input Length Limits
echo "🧪 Test 8: Input Length Limits"
long_input=$(printf 'A%.0s' {1..1500})
curl -s -X POST "$BASE_URL/api/chat/respond" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"$long_input\"}" | \
  jq -r '.error // "❌ Input length limit not enforced"'
echo ""

# Test 9: HTML Tag Injection
echo "🧪 Test 9: HTML Tag Injection"
curl -s -X POST "$BASE_URL/api/chat/respond" \
  -H "Content-Type: application/json" \
  -d '{"query":"<iframe src=\"javascript:alert(1)\"></iframe>"}' | \
  jq -r '.error // "❌ HTML tag injection test failed"'
echo ""

# Test 10: Markdown Link Injection
echo "🧪 Test 10: Malicious Markdown Link"
curl -s -X POST "$BASE_URL/api/chat/respond" \
  -H "Content-Type: application/json" \
  -d '{"query":"Click [here](javascript:alert(1)) for more info"}' | \
  jq -r '.response // "✅ Test completed"' | grep -q "javascript:" && echo "❌ Malicious markdown link not filtered" || echo "✅ Malicious markdown links filtered"
echo ""

echo "🏁 Security Testing Complete"
echo "================================"
echo "Review the results above and fix any failing tests."
echo ""
echo "💡 Additional Security Recommendations:"
echo "- Implement proper session management"
echo "- Add two-factor authentication for admin"
echo "- Use HTTPS in production"
echo "- Regular security audits and dependency updates"
echo "- Monitor logs for suspicious activity"
echo "- Implement proper backup and recovery procedures"
