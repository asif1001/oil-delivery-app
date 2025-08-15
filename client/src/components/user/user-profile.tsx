import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserIcon, EditIcon, CameraIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <section className="px-4 mb-6">
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="p-4 border-b border-gray-100">
          <CardTitle className="font-semibold text-gray-800">My Profile</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <img 
                src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=100&h=100&fit=crop&crop=face"} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover border-4 border-gray-200"
                data-testid="img-profile-avatar"
              />
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-white p-0"
                data-testid="button-edit-avatar"
              >
                <CameraIcon className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800" data-testid="text-profile-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
              </h3>
              <p className="text-sm text-gray-600" data-testid="text-profile-email">{user?.email}</p>
              <Badge className="mt-1 bg-user text-user-foreground text-xs" data-testid="badge-user-role">
                {user?.role || 'user'}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary hover:bg-primary/10"
              data-testid="button-edit-profile"
            >
              <EditIcon className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Member Since</p>
              <p className="text-sm font-medium text-gray-800" data-testid="text-member-since">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-800" data-testid="text-last-updated">
                {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Account Settings</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                data-testid="button-change-password"
              >
                Change Password
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                data-testid="button-notification-settings"
              >
                Notification Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                data-testid="button-privacy-settings"
              >
                Privacy Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}