# Firebase Hosting Deployment Guide

## Overview
Your OILDELIVERY app is now configured for Firebase Hosting with proper Firestore security rules and indexes.

## Prerequisites
- Firebase CLI is installed (firebase-tools package)
- Firebase project: `oil-delivery-6bcc4`
- Admin access to the Firebase project

## Deployment Steps

### 1. Login to Firebase CLI
```bash
npx firebase login
```
This will open a browser to authenticate with your Firebase account.

### 2. Build the Production App
```bash
npm run build
```
This creates optimized production files in the `dist/public` directory.

### 3. Deploy to Firebase Hosting
```bash
# Deploy everything (hosting + rules + indexes)
npx firebase deploy

# Deploy only hosting
npx firebase deploy --only hosting

# Deploy only Firestore rules
npx firebase deploy --only firestore:rules

# Deploy only Firestore indexes
npx firebase deploy --only firestore:indexes
```

### 4. Local Testing (Optional)
```bash
npm run build
npx firebase serve
```
This serves your app locally using Firebase hosting configuration.

## Configuration Files

### firebase.json
- **hosting.public**: `"dist/public"` - Points to your built React app
- **rewrites**: Routes all requests to `index.html` for SPA routing
- **headers**: Optimized caching for static assets

### firestore.rules
- **User Access**: Users can only access their own data
- **Admin Privileges**: Admins can read all users, manage branches/oil types
- **Task Management**: All authenticated users can manage tasks
- **Security**: Role-based access control implemented

### firestore.indexes.json
- **Performance Indexes**: Optimized queries for tasks, deliveries, complaints
- **Sorting**: Support for date-based and status-based sorting
- **Compound Queries**: Multi-field query optimization

## Post-Deployment

### 1. Update Firebase Auth Settings
After deployment, add your hosting domain to Firebase Auth:
1. Go to Firebase Console → Authentication → Settings
2. Add your hosting URL to "Authorized domains"
3. Format: `your-project-name.web.app` or `your-project-name.firebaseapp.com`

### 2. Test the Deployed App
1. Visit your hosting URL
2. Test login functionality
3. Verify task creation works
4. Check admin dashboard features

### 3. Monitor Performance
- Firebase Console → Hosting → Usage
- Check for any 404 errors or performance issues
- Monitor Firestore usage and query performance

## Hosting URLs
Your app will be available at:
- Primary: `https://oil-delivery-6bcc4.web.app`
- Secondary: `https://oil-delivery-6bcc4.firebaseapp.com`

## Troubleshooting

### Common Issues
1. **Auth Domain Error**: Add hosting URL to Firebase Auth authorized domains
2. **404 Errors**: Check that rewrites are configured for SPA routing
3. **Firestore Permission Denied**: Verify security rules are deployed
4. **Build Errors**: Ensure all environment variables are set for production

### Environment Variables
Make sure these are set in your production environment:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

## Continuous Deployment
Consider setting up GitHub Actions or similar for automated deployment:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: oil-delivery-6bcc4
```

Your oil delivery app is now ready for professional Firebase hosting!