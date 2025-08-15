import { useAuth } from "@/hooks/useAuth";
import TopNavigation from "@/components/layout/top-navigation";
import BottomNavigation from "@/components/layout/bottom-navigation";
import UserProfile from "@/components/user/user-profile";
import UserBookings from "@/components/user/user-bookings";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function UserHome() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not user
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (!isLoading && isAuthenticated && user?.role !== 'user') {
      toast({
        title: "Access Denied",
        description: "User access required",
        variant: "destructive",
      });
      // Redirect to appropriate home page based on role
      const redirectMap = {
        admin: '/admin',
        driver: '/driver',
        business: '/business'
      };
      window.location.href = redirectMap[user?.role as keyof typeof redirectMap] || '/';
    }
  }, [isAuthenticated, isLoading, user, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'user') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="pb-20">
        <div className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Manage your profile, view bookings, and track your activity.</p>
          </div>
        </div>
        
        <UserProfile />
        <UserBookings />
      </main>

      <BottomNavigation />
    </div>
  );
}