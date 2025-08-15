# URGENT: Admin User Setup for OILDELIVERY

## Current Status
✅ **App Loading**: Login page displays correctly
❌ **Login Failing**: Admin user not created in Firebase

## Quick Setup Steps

### Step 1: Enable Firebase Authentication

1. **Go to Firebase Console**: https://console.firebase.google.com/project/oil-delivery-6bcc4
2. **Click Authentication** in left sidebar
3. **Go to Sign-in method tab**
4. **Click Email/Password**
5. **Enable** the first option (Email/Password)
6. **Click Save**

### Step 2: Create Admin User

1. **Still in Firebase Console Authentication**
2. **Click Users tab**
3. **Click "Add user" button**
4. **Fill in details**:
   - Email: `asif.s@ekkanoo.com.bh`
   - Password: `Admin123!`
5. **Click "Add user"**
6. **Copy the UID** (you'll need it for next step)

### Step 3: Create User Document in Firestore

1. **Go to Firestore Database** in Firebase Console
2. **Click "Create database"** (if not created)
   - Choose **Production mode**
   - Select location closest to you
3. **Click "Start collection"**
4. **Collection ID**: `users`
5. **Document ID**: Paste the UID from Step 2
6. **Add these fields**:
   ```
   Field: uid          Type: string    Value: [paste UID from step 2]
   Field: email        Type: string    Value: asif.s@ekkanoo.com.bh
   Field: role         Type: string    Value: admin
   Field: displayName  Type: string    Value: asif.s
   Field: active       Type: boolean   Value: true
   Field: createdAt    Type: timestamp Value: [current date/time]
   ```
7. **Click Save**

### Step 4: Update Firestore Security Rules

1. **In Firestore Database**
2. **Click Rules tab**
3. **Replace content with**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow users to read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Allow authenticated users to read all collections
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. **Click Publish**

### Step 5: Test Login

1. **Go to**: https://oil-delivery-6bcc4.web.app
2. **Enter credentials**:
   - Email: `asif.s@ekkanoo.com.bh`
   - Password: `Admin123!`
3. **Click Sign In**

## Expected Result

After completing these steps:
- ✅ Login will succeed
- ✅ User will be redirected to admin dashboard
- ✅ All OILDELIVERY features will be accessible

## Troubleshooting

### If login still fails:
1. Check browser console (F12) for errors
2. Verify the user exists in Firebase Authentication
3. Confirm the Firestore user document has the correct UID
4. Ensure Firestore rules allow authentication

### Common Issues:
- **Email not found**: User not created in Firebase Authentication
- **Wrong password**: Double-check the password is `Admin123!`
- **Permission denied**: Firestore rules not updated
- **User document missing**: Firestore user document not created with correct UID

## Quick Verification

**Firebase Authentication Users should show**:
- ✅ Email: asif.s@ekkanoo.com.bh
- ✅ Provider: Email/Password
- ✅ Created date: Today

**Firestore users collection should have**:
- ✅ Document ID: [matching UID from Authentication]
- ✅ role: admin
- ✅ email: asif.s@ekkanoo.com.bh

Your OILDELIVERY admin login will work once these steps are completed!