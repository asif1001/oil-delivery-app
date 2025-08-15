import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string | null;
  role: string;
  displayName: string | null;
  firstName?: string;
  lastName?: string;
  active?: boolean;
}

export function useAuth() {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session first
    const checkStoredUser = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('Using stored user session:', parsedUser);
          setUserData(parsedUser as User);
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('currentUser');
        }
      }
      return false;
    };

    // Use stored session if available
    if (checkStoredUser()) {
      return;
    }

    // Check for Replit Auth session
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status with Replit Auth...');
      const response = await fetch('/api/auth/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Found authenticated user:', userData);
        
        // Store in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUserData(userData);
      } else {
        console.log('❌ No authenticated user found');
        setUserData(null);
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUserData(null);
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Redirect to Replit Auth login
    window.location.href = '/api/login';
  };

  const logout = () => {
    console.log('🔓 Logging out user...');
    
    // Clear local storage first
    localStorage.removeItem('currentUser');
    setUserData(null);
    
    // Redirect directly to logout endpoint - let server handle the session cleanup and redirect
    window.location.href = '/api/logout';
  };

  return {
    userData,
    isLoading,
    isAuthenticated: !!userData,
    login,
    logout
  };
}