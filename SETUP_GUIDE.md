# OILDELIVERY - Quick Setup Guide

This guide will help you quickly set up the OILDELIVERY application on a new system or after cloning from GitHub.

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites Check
```bash
node --version    # Should be 18+
npm --version     # Should be 8+
```

### 2. Clone & Install
```bash
git clone [your-repository-url]
cd oildelivery
npm install
```

### 3. Firebase Setup
1. Create Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Enable Firebase Storage
4. Enable Authentication (Email/Password)

### 4. Environment Variables
Create `.env` file in project root:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 5. Create Admin User
In Firebase Console → Authentication:
- Add user: `asif.s@ekkanoo.com.bh`
- Password: `Admin123!`

### 6. Run Application
```bash
npm run dev
```

Visit `http://localhost:5000` and login with admin credentials.

## 📋 Verification Checklist

After setup, verify these features work:

- [ ] Admin login successful
- [ ] Can create new branch
- [ ] Can create new oil type
- [ ] Can create driver user
- [ ] Driver can access supply workflow
- [ ] Photo capture and watermarking works
- [ ] CSV export functions properly

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript errors
```

## 🔧 Common Setup Issues

### Issue: Firebase connection error
**Solution**: Check environment variables are correctly set

### Issue: Photo upload fails
**Solution**: Verify Firebase Storage is enabled and has proper rules

### Issue: Authentication not working
**Solution**: Ensure Email/Password authentication is enabled in Firebase

### Issue: Build errors
**Solution**: Run `npm install` and `npm run type-check`

## 📱 Testing the Application

### Admin Functions
1. Login with admin credentials
2. Navigate to "Manage Branches" and add a test branch
3. Go to "Manage Oil Types" and add a test oil type
4. Check CSV export functionality

### Driver Functions
1. Create a driver user through admin panel
2. Login as driver
3. Test Supply Workflow with photo capture
4. Test Loading Workflow
5. Verify meter reading validation

## 🚀 Production Deployment

### Replit Deployment (Recommended)
1. Push to GitHub
2. Import to Replit
3. Set environment variables in Replit Secrets
4. Deploy with Replit's deployment system

### Manual Deployment
1. `npm run build`
2. Deploy `dist` folder to your hosting provider
3. Configure environment variables on hosting platform
4. Ensure HTTPS is enabled

## 📊 Sample Data for Testing

### Test Branch
```json
{
  "name": "Test Branch",
  "address": "123 Test Street",
  "contactPerson": "Test Manager",
  "phone": "+1234567890"
}
```

### Test Oil Type
```json
{
  "name": "Test Oil",
  "viscosity": "SAE 10W-30",
  "density": 0.85
}
```

### Test Driver User
```json
{
  "email": "driver@test.com",
  "role": "driver",
  "displayName": "Test Driver",
  "empNo": "D001",
  "driverLicenceNo": "DL123456",
  "tankerLicenceNo": "TL123456"
}
```

## 💡 Tips for Success

1. **Start with Admin Setup**: Always create branches and oil types before testing driver workflows
2. **Test Photo Features**: Ensure camera permissions are granted in browser
3. **Check Network**: Firebase requires stable internet connection
4. **Use Chrome/Edge**: Best compatibility for camera and photo features
5. **Mobile Testing**: Test on actual mobile devices for best user experience

## 🆘 Need Help?

1. Check the main README.md for comprehensive documentation
2. Review Firebase Console for authentication and database issues
3. Use browser developer tools to check for JavaScript errors
4. Verify all environment variables are correctly set

---

**Ready to start? Run `npm run dev` and visit http://localhost:5000!**