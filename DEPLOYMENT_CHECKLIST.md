# OILDELIVERY Deployment Checklist

## Pre-Deployment Checklist

### ✅ 1. Environment Variables
Create `.env` file in your project root:
```env
VITE_FIREBASE_API_KEY=AIzaSyChkqfXWJqQr3wbN8jL3qAkmKQEz5Mdr7o
VITE_FIREBASE_PROJECT_ID=oil-delivery-6bcc4
VITE_FIREBASE_APP_ID=1:136339484143:web:7b9c14cd8f5a5c8d5e7b8f
```

### ✅ 2. Firebase Authentication Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `oil-delivery-6bcc4`
3. **Authentication** → **Sign-in method** → Enable **Email/Password**
4. **Authentication** → **Users** → **Add user**:
   - Email: `asif.s@ekkanoo.com.bh`
   - Password: `Admin123!`

### ✅ 3. Firestore Database Setup
1. **Firestore Database** → Create database in production mode
2. Create collection: `users`
3. Add document with User UID from Authentication:
   ```json
   {
     "uid": "[USER_UID_FROM_AUTH]",
     "email": "asif.s@ekkanoo.com.bh",
     "role": "admin",
     "displayName": "asif.s",
     "active": true,
     "createdAt": "[CURRENT_TIMESTAMP]"
   }
   ```

### ✅ 4. Firebase Storage Setup
1. **Storage** → Get started
2. Set security rules to allow authenticated uploads
3. Create folders: `deliveries/`, `tasks/`, `complaints/`

### ✅ 5. Build & Deploy Commands
```bash
# Install dependencies
npm install

# Build production app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

## Post-Deployment Verification

### ✅ 1. Check Hosting URL
- Visit: https://oil-delivery-6bcc4.web.app
- Should show login page (not blank)

### ✅ 2. Test Admin Login
- Email: `asif.s@ekkanoo.com.bh`
- Password: `Admin123!`
- Should redirect to admin dashboard

### ✅ 3. Verify Core Features
- [ ] Login/logout functionality
- [ ] Admin dashboard loads with data
- [ ] Task creation works
- [ ] Driver management accessible
- [ ] Branch and oil type management
- [ ] Photo upload functionality
- [ ] Mobile responsive design

### ✅ 4. Browser Console Check
- Press F12 → Console tab
- Should see: "Firebase initialized successfully"
- No critical error messages

### ✅ 5. Firebase Console Verification
- **Authentication**: Admin user exists
- **Firestore**: Collections created properly
- **Storage**: Bucket accessible
- **Hosting**: App deployed successfully

## Common Issues & Solutions

### Issue: Blank Page
**Cause**: Missing environment variables or Firebase config
**Solution**: 
1. Verify `.env` file exists with correct values
2. Rebuild and redeploy: `npm run build && firebase deploy --only hosting`

### Issue: Login Fails
**Cause**: Admin user not created or wrong credentials
**Solution**:
1. Check Firebase Authentication for user existence
2. Verify Firestore user document has correct role

### Issue: 404 Errors
**Cause**: Firebase hosting configuration
**Solution**: 
1. Check `firebase.json` has proper rewrites
2. Redeploy: `firebase deploy --only hosting`

### Issue: Permission Denied
**Cause**: Firestore security rules not deployed
**Solution**: `firebase deploy --only firestore:rules`

## Environment Validation Commands

```bash
# Check if environment variables are loaded
echo $VITE_FIREBASE_API_KEY
echo $VITE_FIREBASE_PROJECT_ID
echo $VITE_FIREBASE_APP_ID

# Verify build output
ls -la dist/public/
cat dist/public/index.html

# Test Firebase connection
firebase projects:list
firebase use oil-delivery-6bcc4
```

## Success Criteria

Your deployment is successful when:
1. ✅ App loads at hosting URL (not blank)
2. ✅ Admin can login successfully
3. ✅ All dashboard features work
4. ✅ Mobile responsive
5. ✅ No console errors
6. ✅ Firebase services connected

## Support URLs

- **Live App**: https://oil-delivery-6bcc4.web.app
- **Firebase Console**: https://console.firebase.google.com/project/oil-delivery-6bcc4
- **GitHub Repository**: https://github.com/asif1001/oil-delivery-app

Your OILDELIVERY app is production-ready when all items are checked!