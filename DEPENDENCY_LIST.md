# OILDELIVERY - Complete Dependency List

This document provides a comprehensive list of all dependencies required for the OILDELIVERY application.

## 📦 Production Dependencies

### Core Framework
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.2",
  "vite": "^4.4.5"
}
```

### Firebase Integration
```json
{
  "firebase": "^10.1.0"
}
```

### UI Components & Styling
```json
{
  "@radix-ui/react-accordion": "^1.1.2",
  "@radix-ui/react-alert-dialog": "^1.0.4",
  "@radix-ui/react-aspect-ratio": "^1.0.3",
  "@radix-ui/react-avatar": "^1.0.3",
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-collapsible": "^1.0.3",
  "@radix-ui/react-context-menu": "^2.1.4",
  "@radix-ui/react-dialog": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.0.5",
  "@radix-ui/react-hover-card": "^1.0.6",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-menubar": "^1.0.3",
  "@radix-ui/react-navigation-menu": "^1.1.3",
  "@radix-ui/react-popover": "^1.0.6",
  "@radix-ui/react-progress": "^1.0.3",
  "@radix-ui/react-radio-group": "^1.1.3",
  "@radix-ui/react-scroll-area": "^1.0.4",
  "@radix-ui/react-select": "^1.2.2",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-slider": "^1.1.2",
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-switch": "^1.0.3",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.4",
  "@radix-ui/react-toggle": "^1.0.3",
  "@radix-ui/react-toggle-group": "^1.0.4",
  "@radix-ui/react-tooltip": "^1.0.6",
  "tailwindcss": "^3.3.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^1.14.0",
  "lucide-react": "^0.263.1"
}
```

### State Management & Data Fetching
```json
{
  "@tanstack/react-query": "^4.32.6"
}
```

### Form Handling & Validation
```json
{
  "react-hook-form": "^7.45.2",
  "@hookform/resolvers": "^3.1.1",
  "zod": "^3.21.4"
}
```

### Routing
```json
{
  "wouter": "^2.11.0"
}
```

### Date Handling
```json
{
  "date-fns": "^2.30.0"
}
```

### Charts & Visualization
```json
{
  "recharts": "^2.7.2"
}
```

### Backend Server
```json
{
  "express": "^4.18.2"
}
```

## 🛠️ Development Dependencies

### Build Tools
```json
{
  "@vitejs/plugin-react": "^4.0.3",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.24",
  "tsx": "^3.12.7",
  "esbuild": "^0.18.10"
}
```

### TypeScript Support
```json
{
  "@types/react": "^18.2.15",
  "@types/react-dom": "^18.2.7",
  "@types/express": "^4.17.17",
  "@types/node": "^20.4.4"
}
```

### Development Tools
```json
{
  "components.json": "configuration file for shadcn/ui components",
  "tailwind.config.ts": "Tailwind CSS configuration",
  "tsconfig.json": "TypeScript configuration",
  "vite.config.ts": "Vite build configuration",
  "postcss.config.js": "PostCSS configuration"
}
```

## 📋 Installation Commands

### All Dependencies at Once
```bash
npm install react react-dom typescript vite @vitejs/plugin-react
npm install firebase
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-toast @radix-ui/react-label
npm install tailwindcss autoprefixer postcss class-variance-authority clsx tailwind-merge
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install wouter
npm install lucide-react
npm install date-fns
npm install recharts
npm install express
npm install --save-dev @types/react @types/react-dom @types/express @types/node tsx
```

### Or Simply
```bash
npm install
```
(This will install everything from package.json)

## 🌐 CDN Alternatives (For Quick Testing)

If you want to test without npm install, you can use CDN versions:

### React (CDN)
```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

### Firebase (CDN)
```html
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"></script>
```

## 🔍 Dependency Explanations

### Core Dependencies
- **React**: UI framework for building component-based interfaces
- **TypeScript**: Type safety and better development experience
- **Vite**: Fast build tool and development server
- **Firebase**: Backend-as-a-service for authentication, database, and storage

### UI Dependencies
- **Radix UI**: Headless, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Modern icon library with React components
- **Class Variance Authority**: Utility for conditional CSS classes

### State Management
- **TanStack Query**: Data fetching, caching, and synchronization
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation

### Utilities
- **Wouter**: Lightweight router for React applications
- **Date-fns**: Modern JavaScript date utility library
- **Recharts**: Composable charting library for React

## 🏗️ Build Dependencies

The build process requires these tools:
- **Vite**: Build tool and dev server
- **TypeScript Compiler**: Type checking and compilation
- **PostCSS**: CSS processing and Tailwind compilation
- **ESBuild**: Fast JavaScript bundler

## 🔒 Security Dependencies

All dependencies are regularly updated for security:
- Firebase SDK includes built-in security features
- Radix UI components follow accessibility standards
- TypeScript provides compile-time type safety
- Regular security audits with `npm audit`

## 📱 Mobile Dependencies

For mobile optimization:
- Responsive design via Tailwind CSS
- Touch-friendly UI components from Radix UI
- Optimized photo capture APIs
- Progressive Web App capabilities

## 🚀 Performance Dependencies

For optimal performance:
- React 18 with concurrent features
- Vite for fast hot module replacement
- TanStack Query for efficient data caching
- Lazy loading and code splitting via Vite

---

**Total Dependencies**: ~60 packages
**Bundle Size**: ~2.5MB (optimized)
**Node.js Version**: 18+
**Browser Support**: Modern browsers (Chrome 80+, Firefox 75+, Safari 13+)