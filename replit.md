# Simple Login App

## Overview

OILDELIVERY is a professional oil delivery management system. The application features a clean, mobile-optimized login interface with email/password authentication, Firebase Firestore database integration, and Firebase Storage for photo management. It supports a multi-role system for drivers and admins, with comprehensive CRUD operations for branches, oil types, and drivers. Key functionalities include a task management system, advanced settings panel, real-time oil tank inventory control, comprehensive delivery tracking system supporting complex load sessions, and full photo management with modal viewing capabilities. The business vision is to provide a robust, reliable platform for managing oil delivery operations efficiently.

## User Preferences

Preferred communication style: Simple, everyday language.
Integration requirements: Firebase Firestore database and Firebase Storage for image management.
Authentication: Firebase Authentication with email/password login (original working system).
User access: Restricted to pre-authorized company users only.
User roles: Drivers and admins with separate dashboards and permissions.
Future plans: Clone to GitHub for further development.
Documentation requirements: Comprehensive README.md with complete setup instructions and dependency lists.
Recent Success: December 2024 - Original working authentication system restored, login issues resolved. January 2025 - Logout functionality fully restored and working correctly. August 2025 - All individual admin pages restored as requested by user, maintaining both integrated dashboards and individual management pages. Driver dashboard recent transactions visibility fixed with proper Firebase data loading. Comprehensive complaint management system with photo watermarks and camera capture functionality implemented. Complaint status tracking and admin resolution workflow with task manager integration completed.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **UI Library**: shadcn/ui built on Radix UI, styled with Tailwind CSS.
- **Routing**: Wouter for client-side routing.
- **State Management**: TanStack Query for server state management.
- **Form Handling**: React Hook Form with Zod for validation.
- **Authentication**: Restored original Replit Auth system with OAuth redirect flow.
- **UI/UX Decisions**: Clean, responsive design optimized for mobile devices, professional styling, animated logout transitions, and visual indicators for tank balance.

### Backend Architecture
- **Framework**: Express.js with TypeScript for REST API.
- **Authentication**: Replit Auth integration with OpenID Connect (RESTORED - Working perfectly).
- **Session Management**: Express sessions with PostgreSQL storage.
- **Database ORM**: Drizzle ORM for type-safe queries.
- **API Design**: RESTful endpoints with role-based authorization middleware.

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless connection.
- **Schema Management**: Drizzle Kit for migrations.
- **Key Tables**: `users` (with role-based access), `sessions`, and schema for deliveries, complaints, branches, oil types.
- **Role System**: Enum-based, hierarchical role management (admin, user, driver, business).

### Authentication & Authorization
- **Provider**: Firebase Authentication with email/password credentials.
- **Login Flow**: Email/password form → Firebase Auth → authenticated dashboard.
- **Session Strategy**: Server-side sessions with secure cookies.
- **Role-Based Access**: Four-tier role system and middleware-based route protection.
- **Fixed Issues**: Removed Firebase auth complexity, password credential issues resolved. Logout flow fixed with proper session destruction.

### Technical Implementations & Feature Specifications
- **Tank Balance System**: Completely removed from application for simplified interface.
- **Delivery Tracking**: Supports multi-delivery load sessions, different drivers for loading/delivery, and transaction histories.
- **Image Handling**: Automatic image compression and timestamp overlays before Firebase upload.
- **Data Integrity**: Cascading deletes for related transactions upon branch/oil type removal.
- **Meter Reading Validation**: Start meter reading cannot exceed finish meter reading in supply workflow.
- **Complaint Management**: Comprehensive complaint system with photo watermarks, camera capture, status tracking (open, in-progress, resolved, closed), admin resolution workflow, and task manager integration.
- **Transaction Visibility**: Fixed driver dashboard recent transactions with proper Firebase data loading and display.
- **Photo Evidence System**: Complaint photo evidence mirrors driver workflow with automatic timestamp and user watermarks.
- **Comprehensive Documentation**: Complete README.md with setup instructions, dependencies, and architecture details.

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: TypeScript-first ORM.
- **Firebase Firestore**: Database for user data and other relevant application data.
- **Firebase Storage**: For photo management with organized folder structures.
- **Firebase Hosting**: Production hosting platform with CDN and SSL.

### Authentication Services
- **Replit Auth**: Integrated authentication provider.
- **connect-pg-simple**: PostgreSQL-backed session storage.

### UI & Component Libraries
- **Radix UI**: Headless component primitives.
- **shadcn/ui**: Pre-built component library.
- **Lucide React**: Icon library.
- **Tailwind CSS**: Utility-first CSS framework.

### Development Tools
- **Vite**: Fast build tool.
- **TypeScript**: Type checking.
- **TanStack Query**: Data fetching and caching.
- **React Hook Form**: Form handling.
- **Zod**: Runtime type validation.

### Runtime & Hosting
- **Node.js**: Server runtime.
- **Express.js**: Web framework.
- **ws package**: For WebSocket support.
- **Replit Platform**: Integrated hosting and development environment.