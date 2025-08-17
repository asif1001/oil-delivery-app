# 🔧 Firebase Console Setup - Step by Step

## Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Click on your project: **oil-delivery-6bcc4**

## Step 2: Navigate to Authentication Settings
1. In the left sidebar, click **"Authentication"**
2. Click on the **"Settings"** tab (next to Users, Sign-in method, etc.)
3. Scroll down to find **"Authorized domains"** section

## Step 3: Add Your Domains
Click **"Add domain"** button and add these domains one by one:

```
asif1001.github.io
oil-delivery-tracking-app.asif1001.repl.co
localhost
127.0.0.1
```

## Step 4: Save Changes
- Click **"Save"** after adding each domain
- Wait 2-3 minutes for changes to propagate

## Step 5: Test Your App
1. Visit: https://asif1001.github.io/oil-delivery-app
2. Try logging in with:
   - **Admin**: asif1001@gmail.com
   - **Admin**: asif.s@ekkanoo.com.bh

## What This Fixes:
- ✅ GitHub Pages login authentication
- ✅ Replit preview login authentication
- ✅ Local development login

## Current Status:
- 🟢 Routing: **FIXED** (stays within app)
- 🔴 Authentication: **NEEDS FIREBASE SETUP** (this checklist)

After completing these steps, your OILDELIVERY app will work perfectly on both GitHub Pages and Replit!