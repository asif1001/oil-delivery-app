# Fix GitHub Codespace npm Error

You got an npm cache error. Here's how to fix it:

## Step 1: Clean npm Cache
```bash
npm cache clean --force
```

## Step 2: Remove node_modules
```bash
rm -rf node_modules package-lock.json
```

## Step 3: Fresh Install
```bash
npm install
```

## Step 4: Build and Deploy
```bash
npm run build
```

## Step 5: Fix Build Output
```bash
cp -r dist/public/* dist/ && rm -rf dist/public
```

## Step 6: Deploy to GitHub Pages
```bash
npx gh-pages -d dist -m "Deploy OILDELIVERY v1.3.0"
```

## Alternative: Use the Deploy Script
```bash
node deploy.js
```

## All Commands in Sequence (Copy & Paste):
```bash
npm cache clean --force && rm -rf node_modules package-lock.json && npm install && npm run build && cp -r dist/public/* dist/ && rm -rf dist/public && npx gh-pages -d dist -m "Deploy OILDELIVERY v1.3.0"
```