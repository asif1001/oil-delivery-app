# Deployment Scripts for OILDELIVERY App

Since package.json editing is restricted, here are the commands to run manually:

## Build Commands
```bash
# Development build
npm run build

# Production build with optimizations
NODE_ENV=production npm run build
```

## Firebase Commands
```bash
# Login to Firebase
npx firebase login

# Deploy everything (hosting + rules + indexes)
npx firebase deploy

# Deploy only hosting
npx firebase deploy --only hosting

# Deploy only Firestore rules
npx firebase deploy --only firestore:rules

# Deploy only Firestore indexes  
npx firebase deploy --only firestore:indexes

# Local testing with Firebase
npx firebase serve
```

## Git Commands for Deployment
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Deploy to production"

# Push to GitHub
git push origin main

# Create release tag
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

## Quick Deploy Script
Create `deploy.sh` file:
```bash
#!/bin/bash
echo "Building production app..."
NODE_ENV=production npm run build

echo "Deploying to Firebase..."
npx firebase deploy

echo "Deployment complete!"
echo "Live at: https://oil-delivery-6bcc4.web.app"
```

Run with: `chmod +x deploy.sh && ./deploy.sh`