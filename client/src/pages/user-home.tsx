import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserIcon, 
  ClockIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  SettingsIcon,
  HelpCircleIcon,
  BellIcon,
  EyeIcon
} from "lucide-react";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

interface UserHomeProps {
  user: User;
}

export default function UserHome({ user }: UserHomeProps) {
  // Mock data for general user dashboard
  const userActivity = {
    recentLogins: 15,
    accountAge: 45, // days
    lastLogin: new Date('2024-01-16T10:30:00'),
    profileCompletion: 85
  };

  const notifications = [
    { 
      id: '1', 
      title: 'Profile Update Required', 
      message: 'Please update your contact information',
      type: 'warning',
      time: '2 hours ago'
    },
    { 
      id: '2', 
      title: 'System Maintenance', 
      message: 'Scheduled maintenance on Sunday 2 AM - 4 AM',
      type: 'info',
      time: '1 day ago'
    },
    { 
      id: '3', 
      title: 'Welcome to OILDELIVERY', 
      message: 'Thank you for joining our platform',
      type: 'success',
      time: '3 days ago'
    }
  ];

  const recentActivity = [
    { action: 'Logged in', time: '10:30 AM today', status: 'success' },
    { action: 'Updated profile', time: 'Yesterday 3:45 PM', status: 'success' },
    { action: 'Password changed', time: '3 days ago', status: 'success' },
    { action: 'Account created', time: '45 days ago', status: 'success' }
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircleIcon className="h-4 w-4" />;
      case 'info': return <BellIcon className="h-4 w-4" />;
      case 'success': return <CheckCircleIcon className="h-4 w-4" />;
      case 'error': return <AlertCircleIcon className="h-4 w-4" />;
      default: return <BellIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.displayName}!</h1>
            <p className="text-indigo-100">Member since {userActivity.accountAge} days ago</p>
            <p className="text-indigo-100 text-sm">Last login: {userActivity.lastLogin.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userActivity.profileCompletion}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${userActivity.profileCompletion}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userActivity.recentLogins}</div>
            <p className="text-xs text-muted-foreground">
              last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="h-5 w-5 text-blue-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-lg ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs mt-1">{notification.message}</p>
                      <p className="text-xs mt-2 opacity-75">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <SettingsIcon className="h-6 w-6 mb-2" />
              Account Settings
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <EyeIcon className="h-6 w-6 mb-2" />
              View Profile
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <BellIcon className="h-6 w-6 mb-2" />
              Notifications
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <HelpCircleIcon className="h-6 w-6 mb-2" />
              Help & Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircleIcon className="h-5 w-5 text-purple-500" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <HelpCircleIcon className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-medium mb-2">User Guide</h3>
              <p className="text-sm text-gray-600 mb-3">Learn how to use the platform effectively</p>
              <Button variant="outline" size="sm">View Guide</Button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <BellIcon className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-medium mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-3">Get help from our support team</p>
              <Button variant="outline" size="sm">Contact Us</Button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <CheckCircleIcon className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-medium mb-2">FAQ</h3>
              <p className="text-sm text-gray-600 mb-3">Find answers to common questions</p>
              <Button variant="outline" size="sm">View FAQ</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}