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
      console.log('Checking auth status with Firebase...');
      // For GitHub Pages, we only rely on localStorage session
      console.log('❌ No authenticated user found');
      setUserData(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUserData(null);
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // For GitHub Pages, redirect to login page
    window.location.href = '/login';
  };

  const logout = () => {
    console.log('🔓 Logging out user...');
    
    // Clear local storage
    localStorage.removeItem('currentUser');
    setUserData(null);
    
    // For GitHub Pages, just reload to login page
    window.location.href = '/login';
  };

  return {
    userData,
    isLoading,
    isAuthenticated: !!userData,
    login,
    logout
  };
}