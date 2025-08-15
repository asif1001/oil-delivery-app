# Create Admin User in Firebase

## Issue
Your app is showing blank because no admin user exists in Firebase Authentication.

## Steps to Create Admin User

### Method 1: Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select project: `oil-delivery-6bcc4`

2. **Enable Email/Password Authentication**
   - Go to **Authentication** → **Sign-in method**
   - Click **Email/Password** 
   - Enable it and save

3. **Create Admin User**
   - Go to **Authentication** → **Users**
   - Click **Add user**
   - Email: `asif.s@ekkanoo.com.bh`
   - Password: `Admin123!`
   - Click **Add user**

4. **Set User Role in Firestore**
   - Go to **Firestore Database**
   - Create collection: `users`
   - Create document with User UID as document ID
   - Add fields:
     ```
     uid: [copy from Authentication Users]
     email: asif.s@ekkanoo.com.bh
     role: admin
     displayName: asif.s
     active: true
     createdAt: [current timestamp]
     ```

### Method 2: Using Firebase Admin SDK (Advanced)

Create `create-admin.js`:
```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createAdminUser() {
  try {
    // Create user in Authentication
    const userRecord = await admin.auth().createUser({
      email: 'asif.s@ekkanoo.com.bh',
      password: 'Admin123!',
      displayName: 'asif.s',
      emailVerified: true
    });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: 'asif.s@ekkanoo.com.bh',
      role: 'admin',
      displayName: 'asif.s',
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Admin user created successfully:', userRecord.uid);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
```

Run: `node create-admin.js`

## Required Environment Variables

Make sure your `.env` file contains:
```env
VITE_FIREBASE_API_KEY=AIzaSyChkqfXWJqQr3wbN8jL3qAkmKQEz5Mdr7o
VITE_FIREBASE_PROJECT_ID=oil-delivery-6bcc4
VITE_FIREBASE_APP_ID=1:136339484143:web:7b9c14cd8f5a5c8d5e7b8f
```

## Test Login

After creating the admin user:
1. Visit: https://oil-delivery-6bcc4.web.app
2. Email: `asif.s@ekkanoo.com.bh`
3. Password: `Admin123!`

## Firestore Security Rules

Ensure your `firestore.rules` allows user creation:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Admin can read all users
    match /users/{document} {
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

Deploy rules: `firebase deploy --only firestore:rules`

Your admin user will now be able to access the full OILDELIVERY admin dashboard!