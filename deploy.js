const { execSync } = require('child_process');
const fs = require('fs');

console.log('🏗️  Building app for GitHub Pages...');

// Build the app
execSync('npm run build', { stdio: 'inherit' });

// Fix the build output for GitHub Pages
if (fs.existsSync('dist/public')) {
  execSync('cp -r dist/public/* dist/ && rm -rf dist/public', { stdio: 'inherit' });
  console.log('✅ Build output fixed for GitHub Pages');
}

// Deploy with gh-pages
console.log('🚀 Deploying to GitHub Pages...');
execSync('npx gh-pages -d dist -m "Deploy OILDELIVERY v1.3.0 to GitHub Pages"', { stdio: 'inherit' });

console.log('🎉 Successfully deployed to GitHub Pages!');
console.log('📱 Your app will be live at: https://asif1001.github.io/oil-delivery-app');