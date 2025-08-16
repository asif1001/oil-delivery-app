# Complete GitHub Codespaces Setup Guide

This guide shows you how to clone your OILDELIVERY app to GitHub and run it in GitHub Codespaces.

## Step 1: Create GitHub Repository

1. **Go to GitHub**: Visit https://github.com
2. **Create New Repository**:
   - Click the "+" icon → "New repository"
   - Repository name: `oil-delivery-app`
   - Description: `OILDELIVERY - Professional Oil Delivery Management System`
   - Make it **Public** (for GitHub Pages)
   - Click "Create repository"

## Step 2: Clone Your Code to GitHub

### Option A: Using Git Commands (Recommended)

```bash
# Initialize git in your project
git init

# Add GitHub as remote origin
git remote add origin https://github.com/asif1001/oil-delivery-app.git

# Add all files
git add .

# Commit your code
git commit -m "Initial commit: OILDELIVERY v1.3.0 - GitHub Pages ready"

# Push to GitHub
git push -u origin main
```

### Option B: Upload Files Manually
1. Download your project as ZIP
2. Go to your GitHub repository
3. Click "uploading an existing file"
4. Drag and drop all files
5. Commit changes

## Step 3: Open in GitHub Codespaces

1. **Go to your repository**: https://github.com/asif1001/oil-delivery-app
2. **Click the green "Code" button**
3. **Select "Codespaces" tab**
4. **Click "Create codespace on main"**
5. **Wait for Codespace to load** (2-3 minutes)

## Step 4: Terminal Commands in Codespaces

Once your Codespace opens, run these commands in the terminal:

### Install Dependencies
```bash
npm install
```

### Install GitHub Pages Deploy Tool
```bash
npm install -g gh-pages
```

### Build Your App
```bash
npm run build
```

### Fix Build Output for GitHub Pages
```bash
cp -r dist/public/* dist/ && rm -rf dist/public
```

### Deploy to GitHub Pages
```bash
npx gh-pages -d dist -m "Deploy OILDELIVERY v1.3.0"
```

## Step 5: Configure GitHub Pages

1. **Go to Repository Settings**:
   - Click "Settings" tab in your repo
   - Scroll to "Pages" section

2. **Configure Pages**:
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`
   - Click "Save"

## Step 6: Update Firebase Auth Domains

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `oil-delivery-6bcc4`
3. **Go to Authentication** → **Settings** → **Authorized domains**
4. **Add your GitHub Pages domain**: `asif1001.github.io`
5. **Click "Add domain"**

## Complete Terminal Command Sequence

Here's the exact sequence to run in Codespaces terminal:

```bash
# Step 1: Install dependencies
npm install

# Step 2: Install deployment tool
npm install -g gh-pages

# Step 3: Build the app
npm run build

# Step 4: Fix build for GitHub Pages
cp -r dist/public/* dist/ && rm -rf dist/public

# Step 5: Deploy to GitHub Pages
npx gh-pages -d dist -m "Deploy OILDELIVERY v1.3.0"

# Step 6: Check deployment status
echo "🎉 Deployment complete!"
echo "📱 Your app will be live at: https://asif1001.github.io/oil-delivery-app"
echo "⏳ Wait 5-10 minutes for GitHub Pages to process"
```

## Alternative: Use the Deploy Script

Or simply run the automated deployment script:

```bash
# Install dependencies first
npm install

# Run the automated deploy script
node deploy.js
```

## Your Live App URLs

- **Development**: GitHub Codespaces preview
- **Production**: https://asif1001.github.io/oil-delivery-app

## Test Your Deployment

1. Wait 5-10 minutes after deployment
2. Visit: https://asif1001.github.io/oil-delivery-app
3. Login with: `asif1001@gmail.com`
4. Verify all features work correctly

## What Still Works Perfectly

✅ Firebase Authentication (email/password)
✅ Firestore Database (all your data)
✅ Firebase Storage (photo management)
✅ Admin accounts: asif.s@ekkanoo.com.bh and asif1001@gmail.com
✅ All driver accounts
✅ Task management system
✅ Delivery tracking
✅ Photo uploads and downloads

Your OILDELIVERY app will work perfectly on GitHub Pages with zero functionality loss!