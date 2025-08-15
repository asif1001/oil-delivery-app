# Version Update Guide

## How to Update Version Number

Whenever you make code changes, update the version number in the login page:

### Location
File: `client/src/pages/login.tsx`
Line: `const APP_VERSION = "v1.2.3";`

### Version Number Format
Use semantic versioning: `vMAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes or major feature additions
- **MINOR**: New features or significant updates  
- **PATCH**: Bug fixes or small improvements

### Examples

**Current Version**: `v1.2.3`

**When to Update:**

1. **Bug Fix** → `v1.2.4`
   - Fixed login issue
   - Resolved authentication error
   - UI improvements

2. **New Feature** → `v1.3.0`
   - Added photo management
   - New admin dashboard
   - Driver workflow enhancements

3. **Major Change** → `v2.0.0`
   - Complete redesign
   - New authentication system
   - Breaking API changes

### Quick Update Steps

1. Open `client/src/pages/login.tsx`
2. Find line: `const APP_VERSION = "v1.2.3";`
3. Update to new version: `const APP_VERSION = "v1.2.4";`
4. Save file
5. Version will appear on login page immediately

### Where Version Appears

The version number displays at the bottom of the login page in small, light blue text.

### Recent Updates

- **v1.2.3**: Admin authentication fixed, Firebase Auth working for both admin emails
- **v1.2.2**: Branch management component errors resolved
- **v1.2.1**: Login form authentication system restored