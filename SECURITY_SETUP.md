# Security Configuration Guide

## Overview

This application now includes comprehensive security measures:
- ✅ Row Level Security (RLS) enabled on all database tables
- ✅ Authentication tokens required for edge function access
- ✅ Input validation using Zod schemas
- ✅ Rate limiting (10 requests/hour for ML, 50 requests/hour for simulations)
- ✅ Data sanitization before sending to AI services

## Setting Up Authentication Token

### Step 1: Configure Backend Token (Already Done)
The backend edge functions are configured to use the `APP_AUTH_TOKEN` secret you've already set.

### Step 2: Configure Frontend Token
You need to set the same token value in the frontend. You have two options:

#### Option A: Using the Settings UI (Recommended)
1. Navigate to the app
2. Go to **ICM Ruby** tab
3. Click on **Settings**
4. Enter the same token value you set for `APP_AUTH_TOKEN`
5. Click **Save Token**

#### Option B: Using Browser Console
```javascript
localStorage.setItem('AUTH_TOKEN', 'your-token-value-here');
```

### Step 3: Update Default Token (Optional)
For a more permanent solution, you can update the default token in the code:

Edit `src/lib/authToken.ts` and change:
```typescript
const DEFAULT_TOKEN = 'your-actual-token-value-here';
```

⚠️ **Important**: Make sure the token in the frontend matches the `APP_AUTH_TOKEN` secret in your backend!

## Security Features Explained

### 1. Row Level Security (RLS)
- All tables have RLS enabled
- Public read access (anyone can view data)
- Write access restricted to edge functions using service role key
- Prevents direct database manipulation from client

### 2. Authentication Token
- All edge function calls require `x-auth-token` header
- Token is validated before processing requests
- Prevents unauthorized access to AI and simulation features

### 3. Input Validation
- All inputs validated using Zod schemas
- Enforces data types, ranges, and array size limits
- Prevents type confusion attacks and malicious inputs

### 4. Rate Limiting
- ML optimization: 10 requests per hour per IP
- Simulations: 50 requests per hour per IP
- Prevents abuse and resource exhaustion

### 5. Data Sanitization
- Historical data sanitized before sending to AI
- Only essential parameters included
- Sensitive identifiers removed

## Testing Your Setup

1. **Test without token** (should fail):
   - Try using the ML optimizer or simulator without setting the token
   - You should see an "Unauthorized" error

2. **Test with correct token** (should succeed):
   - Set the token in Settings
   - Use the ML optimizer or simulator
   - Operations should complete successfully

3. **Test rate limiting**:
   - Make multiple requests quickly
   - After the limit, you'll see "Rate limit exceeded" message

## For Production Deployment

1. Generate a strong, random token:
   ```bash
   openssl rand -base64 32
   ```

2. Update the `APP_AUTH_TOKEN` secret in your backend

3. Update the frontend token through Settings or code

4. Never commit the production token to version control

## Troubleshooting

### "Unauthorized" Error
- Check that the frontend token matches the backend `APP_AUTH_TOKEN`
- Verify the token is set in Settings or localStorage

### "Rate limit exceeded"
- Wait for the rate limit window to reset (1 hour)
- This is normal protection against abuse

### "Invalid input data"
- Check that your pipe data follows the validation rules:
  - Pipe IDs: 1-50 characters
  - Length: positive, max 10,000m
  - Diameter: positive integer, max 1,000mm
  - Flow: non-negative, max 100 L/s
  - C-factor: 50-150

## Security Considerations

This single-user public app design provides:
- ✅ Protection against database manipulation
- ✅ Rate limiting to prevent abuse
- ✅ Input validation to prevent injection attacks
- ✅ Data sanitization for privacy

However, note that:
- Data is readable by anyone (public read access)
- Authentication token is stored client-side
- Suitable for demo/personal use, not sensitive production data

For multi-user or sensitive data scenarios, consider implementing full user authentication with user-specific RLS policies.
