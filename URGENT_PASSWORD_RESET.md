# 🔑 URGENT: Password Reset Required

## Issue Identified
**Error Code**: `auth/invalid-credential`
**Root Cause**: The password for `asif.s@ekkanoo.com.bh` doesn't match what you're entering.

## IMMEDIATE FIX - Reset Password in Firebase

### Step 1: Go to Firebase Authentication
1. **Open**: https://console.firebase.google.com/project/oil-delivery-6bcc4/authentication/users
2. **Find user**: `asif.s@ekkanoo.com.bh`
3. **Click the 3 dots** (⋮) next to the user
4. **Select "Reset password"**

### Step 2: Set New Password
Firebase will either:
- **Option A**: Send password reset email to `asif.s@ekkanoo.com.bh`
- **Option B**: Let you set a new password directly

**Recommended new password**: `NewAdmin123!`

### Step 3: Alternative - Create Fresh User
If reset doesn't work:
1. **Delete existing user**: Click user → Delete
2. **Add new user**: Click "Add user"
   - Email: `asif.s@ekkanoo.com.bh`
   - Password: `NewAdmin123!`

### Step 4: Test Login
1. **Go to**: https://oil-delivery-6bcc4.web.app
2. **Login with**:
   - Email: `asif.s@ekkanoo.com.bh`
   - Password: `NewAdmin123!`

## Alternative User Test
Try the other user:
- Email: `kannan.n@ekkanoo.co...` (complete from your Firebase console)
- Password: [whatever you set]

## Expected Result
After password reset, you should see in console:
```
🔐 Attempting login for: asif.s@ekkanoo.com.bh
✅ Firebase Auth successful, UID: [uid]
📄 User document exists: false
📝 Creating new user document...
✅ User document created successfully
```

The login will work and you'll be redirected to the admin dashboard.