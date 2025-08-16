# Quick Deploy Commands for GitHub Codespaces

Copy and paste these commands one by one in your GitHub Codespaces terminal:

## 1. Install Dependencies
```bash
npm install
```

## 2. Install GitHub Pages Tool
```bash
npm install -g gh-pages
```

## 3. Build and Deploy (One Command)
```bash
npm run build && cp -r dist/public/* dist/ && rm -rf dist/public && npx gh-pages -d dist -m "Deploy OILDELIVERY v1.3.0"
```

## 4. Check Status
```bash
echo "🎉 Deployment complete! Your app will be live at: https://asif1001.github.io/oil-delivery-app"
```

## Alternative: Use Deploy Script
```bash
npm install && node deploy.js
```

That's it! Your app will be live in 5-10 minutes at:
**https://asif1001.github.io/oil-delivery-app**