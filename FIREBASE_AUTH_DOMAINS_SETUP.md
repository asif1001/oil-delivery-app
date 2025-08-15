# Firebase Authentication Domains Setup

## Why Authentication Fails on Firebase Hosting

Firebase Authentication works on Replit but fails on Firebase Hosting because Firebase Auth only allows authentication from **authorized domains**. Each environment needs to be explicitly added.

## Current Configuration Status

✅ **Working on Replit**: `*.replit.dev` domain
❌ **May fail on Firebase Hosting**: Need to add hosting domains

## Required Firebase Console Setup

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project: `oil-delivery-6bcc4`
3. Go to **Authentication** → **Settings** → **Authorized domains**

### Step 2: Add Required Domains

**Current Authorized Domains** (should include):
- `localhost` (for local development)
- `*.replit.dev` (for Replit development)
- `oil-delivery-6bcc4.web.app` (for Firebase Hosting)
- `oil-delivery-6bcc4.firebaseapp.com` (alternative Firebase domain)

**If you have a custom domain**, also add:
- `yourdomain.com`
- `www.yourdomain.com`

### Step 3: Verify Configuration

Your Firebase config in `client/src/lib/firebase.ts` is correctly set:
```javascript
authDomain: "oil-delivery-6bcc4.firebaseapp.com"
```

## Deployment Checklist

Before deploying to Firebase Hosting:

1. ✅ Build the project: `npm run build`
2. ✅ Verify authorized domains are set in Firebase Console
3. ✅ Deploy: `firebase deploy`
4. ✅ Test authentication on the live site

## Common Issues and Solutions

### Issue: "auth/unauthorized-domain" error
**Solution**: Add the hosting domain to Firebase Auth authorized domains

### Issue: Authentication works locally but not on hosting
**Solution**: Verify the hosting domain matches exactly what's in authorized domains

### Issue: Different behavior between environments
**Solution**: Ensure Firebase config environment variables are consistent

## Testing Steps

1. **Test on Replit**: Should work (currently working ✅)
2. **Deploy to Firebase Hosting**: `firebase deploy`
3. **Test on hosting URL**: Login with admin accounts
4. **Verify**: Both `asif1001@gmail.com` and `asif.s@ekkanoo.com.bh` should work

## Environment Variables

The app correctly uses environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

These are properly configured and should work on both Replit and Firebase Hosting.