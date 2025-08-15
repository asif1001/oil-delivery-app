# OILDELIVERY - Professional Oil Delivery Management System

A comprehensive, mobile-optimized web application for enterprise fleet management, focusing on advanced oil delivery tracking with enhanced driver management and real-time operational insights.

## 🚀 Project Overview

OILDELIVERY is a professional oil delivery management system designed for companies managing oil distribution operations. The application features a clean, mobile-optimized interface with Firebase authentication, comprehensive CRUD operations, and advanced photo management capabilities.

### Key Business Features
- **Multi-role Authentication**: Email/password login for drivers and administrators
- **Supply & Loading Workflows**: Streamlined processes for oil loading and delivery
- **Photo Documentation**: Automatic watermarking with timestamp and location data
- **Real-time Tracking**: Live monitoring of delivery operations and inventory
- **Administrative Dashboard**: Comprehensive management tools for branches, oil types, and drivers
- **CSV Export**: Data export functionality for reporting and analysis

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **shadcn/ui** component library built on Radix UI
- **Tailwind CSS** for responsive styling
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation

### Backend & Database
- **Firebase Firestore** as primary database
- **Firebase Storage** for photo management
- **Firebase Authentication** for user management
- **Express.js** server for API endpoints
- **TypeScript** throughout the stack

### Key Dependencies

#### Core Framework Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "vite": "^4.x",
  "@vitejs/plugin-react": "^4.x"
}
```

#### UI & Styling Dependencies
```json
{
  "@radix-ui/react-dialog": "^1.x",
  "@radix-ui/react-select": "^1.x",
  "@radix-ui/react-toast": "^1.x",
  "@radix-ui/react-label": "^2.x",
  "tailwindcss": "^3.x",
  "class-variance-authority": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^1.x",
  "lucide-react": "^0.x"
}
```

#### Firebase Dependencies
```json
{
  "firebase": "^10.x"
}
```

#### State Management & Forms
```json
{
  "@tanstack/react-query": "^4.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x"
}
```

#### Routing & Navigation
```json
{
  "wouter": "^2.x"
}
```

#### Server Dependencies
```json
{
  "express": "^4.x",
  "@types/express": "^4.x",
  "tsx": "^3.x"
}
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Firebase project with Firestore and Storage enabled

### 1. Clone Repository
```bash
git clone [your-repository-url]
cd oildelivery
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "oil-delivery-[your-id]"
3. Enable Firestore Database
4. Enable Firebase Storage
5. Enable Authentication with Email/Password

#### Setup Authentication
1. In Firebase Console → Authentication → Sign-in method
2. Enable Email/Password authentication
3. Create admin user: `asif.s@ekkanoo.com.bh` / `Admin123!`

#### Get Firebase Configuration
1. Project Settings → General → Your apps
2. Add web app and copy configuration
3. Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Setup Storage Structure
Create these folders in Firebase Storage:
- `delivery-photos/` - For delivery documentation
- `loading-photos/` - For loading workflow photos

### 4. Database Structure

#### Firestore Collections
The app creates these collections automatically:

**users** - User profiles and roles
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  role: 'admin' | 'driver',
  empNo: string,
  active: boolean,
  createdAt: timestamp,
  lastLoginAt: timestamp,
  // Driver-specific fields
  driverLicenceNo?: string,
  tankerLicenceNo?: string,
  licenceExpiryDate?: timestamp
}
```

**branches** - Delivery locations
```javascript
{
  id: string,
  name: string,
  address: string,
  contactPerson: string,
  phone: string,
  active: boolean,
  createdAt: timestamp
}
```

**oilTypes** - Oil product categories
```javascript
{
  id: string,
  name: string,
  viscosity: string,
  density: number,
  active: boolean,
  createdAt: timestamp
}
```

**deliveries** - Completed delivery records
```javascript
{
  id: string,
  loadSessionId: string,
  deliveryOrderId: string,
  branchId: string,
  branchName: string,
  oilTypeId: string,
  oilTypeName: string,
  deliveredLiters: number,
  startMeterReading: number,
  endMeterReading: number,
  photos: {
    tankLevelBefore: string,
    hoseConnection: string,
    tankLevelAfter: string
  },
  actualDeliveryStartTime: timestamp,
  actualDeliveryEndTime: timestamp,
  status: 'completed',
  driverUid: string,
  createdAt: timestamp
}
```

**loadSessions** - Loading operation records
```javascript
{
  loadSessionId: string,
  oilTypeId: string,
  oilTypeName: string,
  totalLoadedLiters: number,
  loadMeterReading: number,
  loadLocationId: string,
  meterReadingPhoto: string,
  timestamp: timestamp,
  driverUid: string
}
```

### 5. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📱 Application Features

### Authentication System
- **Secure Login**: Email/password authentication via Firebase
- **Role-based Access**: Separate dashboards for drivers and administrators
- **Session Management**: Persistent login with secure token handling
- **No Registration**: Admin-controlled user creation only

### Driver Dashboard
- **Supply Workflow**: Complete oil delivery process with validation
- **Loading Workflow**: Oil loading operations with meter readings
- **Photo Documentation**: Required photos with automatic watermarking
- **Real-time Updates**: Live status tracking and notifications

### Admin Dashboard
- **Branch Management**: CRUD operations for delivery locations
- **Oil Type Management**: Product catalog with specifications
- **Driver Management**: User administration and role assignment
- **Analytics**: Delivery statistics and performance metrics
- **CSV Export**: Data export for external reporting
- **Photo Management**: Bulk operations and ZIP downloads

### Photo Management System
- **Automatic Watermarking**: Timestamp, location, and driver information
- **Organized Storage**: Separate folders for different photo types
- **Bulk Operations**: Download ZIP archives and bulk delete
- **Quality Control**: Image compression and consistent formatting

### Validation & Data Integrity
- **Meter Reading Validation**: Start reading cannot exceed finish reading
- **Required Field Validation**: Comprehensive form validation
- **Data Consistency**: Referential integrity across collections
- **Error Handling**: User-friendly error messages and recovery

## 🔒 Security Features

### Authentication Security
- Firebase Authentication with secure token management
- Role-based route protection
- Session timeout and automatic logout
- Admin-controlled user provisioning

### Data Security
- Firestore security rules for role-based access
- Secure photo storage with organized folder structure
- Input validation and sanitization
- HTTPS enforcement in production

## 🚀 Deployment

### Environment Configuration
Create production environment variables:
```env
VITE_FIREBASE_API_KEY=production_api_key
VITE_FIREBASE_PROJECT_ID=production_project_id
VITE_FIREBASE_APP_ID=production_app_id
```

### Build for Production
```bash
npm run build
```

### Deploy to Replit (Recommended)
1. Push code to GitHub repository
2. Import to Replit from GitHub
3. Configure environment variables in Replit Secrets
4. Deploy using Replit's built-in deployment

### Alternative Deployment Options
- **Vercel**: `npm run build` → Deploy dist folder
- **Netlify**: Connect GitHub repository with auto-deploy
- **Firebase Hosting**: `firebase deploy` after firebase-tools setup

## 📊 Database Seeding

### Initial Data Setup
1. Create admin user via Firebase Console
2. Add sample branches via admin dashboard
3. Configure oil types through the admin interface
4. Create driver accounts and assign roles

### Sample Data Structure
```javascript
// Sample Branch
{
  name: "Downtown Branch",
  address: "123 Main Street, Downtown",
  contactPerson: "John Manager",
  phone: "+1234567890",
  active: true
}

// Sample Oil Type
{
  name: "Premium Diesel",
  viscosity: "SAE 15W-40",
  density: 0.85,
  active: true
}
```

## 🛠️ Development Guidelines

### Code Structure
```
├── client/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Route-based page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Firebase and utility functions
│   │   ├── utils/              # Helper utilities
│   │   └── assets/             # Static assets
├── server/                     # Express.js server
├── public/                     # Public static files
└── shared/                     # Shared type definitions
```

### Key Files
- `client/src/lib/firebase.ts` - Firebase configuration and data operations
- `client/src/hooks/useAuth.ts` - Authentication state management
- `client/src/utils/watermark.ts` - Photo watermarking functionality
- `client/src/components/SupplyWorkflow.tsx` - Main delivery workflow
- `client/src/components/LoadingWorkflow.tsx` - Oil loading operations

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
```

## 🔍 Troubleshooting

### Common Issues

**Firebase Connection Issues**
- Verify environment variables are correctly set
- Check Firebase project configuration
- Ensure Firestore and Storage are enabled

**Authentication Problems**
- Confirm user exists in Firebase Authentication
- Check user role assignment in Firestore
- Verify email/password combination

**Photo Upload Failures**
- Check Firebase Storage rules
- Verify storage folder structure
- Ensure proper permissions

**Build Errors**
- Run `npm install` to ensure all dependencies
- Check TypeScript errors with `npm run type-check`
- Verify environment variables in production

### Performance Optimization
- Images are automatically compressed before upload
- Firebase queries are optimized with proper indexing
- Components use React.memo for performance
- Lazy loading implemented for large photo galleries

## 📈 Future Enhancements

### Planned Features
- **GPS Tracking**: Real-time vehicle location tracking
- **Offline Mode**: Local data storage for poor connectivity areas
- **Push Notifications**: Real-time alerts and updates
- **Advanced Analytics**: Detailed reporting and insights
- **API Integration**: Third-party logistics system integration
- **Mobile App**: Native iOS/Android applications

### Scalability Considerations
- Database sharding strategies for large datasets
- CDN integration for photo delivery
- Load balancing for high-traffic scenarios
- Microservices architecture for complex operations

## 📞 Support & Maintenance

### Monitoring
- Firebase Console for database and authentication monitoring
- Error logging through browser developer tools
- Performance monitoring via Firebase Performance

### Backup Strategy
- Firebase automatic backups enabled
- Regular export of critical data
- Version control for code changes
- Documentation updates with feature additions

---

## 🏷️ Version Information

**Current Version**: 2.0.0
**Last Updated**: January 2025
**Node.js**: 18+
**Firebase SDK**: 10.x
**React**: 18.x

For technical support or feature requests, please contact the development team or create an issue in the repository.