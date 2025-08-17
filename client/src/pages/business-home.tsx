import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TruckIcon, 
  DollarSignIcon, 
  BarChart3Icon, 
  CalendarIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from "lucide-react";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

interface BusinessHomeProps {
  user: User;
}

export default function BusinessHome({ user }: BusinessHomeProps) {
  // Mock data for business dashboard
  const businessStats = {
    monthlyRevenue: 45200,
    revenueGrowth: 12.5,
    activeFleets: 8,
    completedDeliveries: 156,
    pendingOrders: 23,
    customerSatisfaction: 94.2
  };

  const recentOrders = [
    { id: '1', customer: 'ABC Corp', amount: 2500, status: 'delivered', date: '2024-01-15' },
    { id: '2', customer: 'XYZ Ltd', amount: 1800, status: 'in-transit', date: '2024-01-15' },
    { id: '3', customer: 'Global Inc', amount: 3200, status: 'pending', date: '2024-01-16' },
    { id: '4', customer: 'Local Business', amount: 950, status: 'delivered', date: '2024-01-16' },
  ];

  const fleetPerformance = [
    { fleetId: 'F001', driver: 'John Smith', deliveries: 12, efficiency: 96.5, status: 'active' },
    { fleetId: 'F002', driver: 'Sarah Johnson', deliveries: 10, efficiency: 94.2, status: 'active' },
    { fleetId: 'F003', driver: 'Mike Wilson', deliveries: 8, efficiency: 91.8, status: 'maintenance' },
    { fleetId: 'F004', driver: 'Lisa Brown', deliveries: 15, efficiency: 98.1, status: 'active' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Business Dashboard</h1>
        <p className="text-purple-100">Welcome back, {user.displayName}! Monitor your fleet operations and business performance</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${businessStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUpIcon className="h-3 w-3 mr-1" />
              +{businessStats.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fleets</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessStats.activeFleets}</div>
            <p className="text-xs text-muted-foreground">
              fleets operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessStats.completedDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessStats.customerSatisfaction}%</div>
            <p className="text-xs text-muted-foreground">
              average rating
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{order.customer}</p>
                    <p className="text-xs text-gray-600">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${order.amount.toLocaleString()}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-green-500" />
              Fleet Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fleetPerformance.map((fleet) => (
                <div key={fleet.fleetId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{fleet.fleetId} - {fleet.driver}</p>
                    <p className="text-xs text-gray-600">{fleet.deliveries} deliveries</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{fleet.efficiency}% efficiency</p>
                    <Badge className={getStatusColor(fleet.status)}>
                      {fleet.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Fleet Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-orange-500" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Fleet F003 scheduled for maintenance</p>
                  <p className="text-xs text-gray-600">Due in 2 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TruckIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">23 pending orders awaiting assignment</p>
                  <p className="text-xs text-gray-600">Requires immediate attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Monthly targets achieved</p>
                  <p className="text-xs text-gray-600">Great job team!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <CalendarIcon className="h-6 w-6 mb-2" />
                Schedule Delivery
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <TruckIcon className="h-6 w-6 mb-2" />
                Fleet Status
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <BarChart3Icon className="h-6 w-6 mb-2" />
                View Reports
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <DollarSignIcon className="h-6 w-6 mb-2" />
                Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}