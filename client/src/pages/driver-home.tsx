import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  NavigationIcon,
  FuelIcon,
  UserIcon
} from "lucide-react";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
}

interface DriverHomeProps {
  user: User;
}

export default function DriverHome({ user }: DriverHomeProps) {
  // Mock data for driver dashboard
  const driverStats = {
    todayDeliveries: 5,
    completedDeliveries: 3,
    remainingDeliveries: 2,
    totalDistance: 180,
    fuelEfficiency: 15.2,
    onTimeDeliveries: 94.5
  };

  const todaySchedule = [
    { 
      id: '1', 
      customer: 'ABC Manufacturing', 
      address: '123 Industrial St, City', 
      time: '09:00 AM',
      oilType: 'Diesel',
      quantity: 500,
      status: 'completed'
    },
    { 
      id: '2', 
      customer: 'XYZ Factory', 
      address: '456 Factory Ave, City', 
      time: '11:30 AM',
      oilType: 'Motor Oil',
      quantity: 300,
      status: 'completed'
    },
    { 
      id: '3', 
      customer: 'Global Corp', 
      address: '789 Business Blvd, City', 
      time: '02:00 PM',
      oilType: 'Hydraulic Oil',
      quantity: 750,
      status: 'in-progress'
    },
    { 
      id: '4', 
      customer: 'Local Garage', 
      address: '321 Service Rd, City', 
      time: '04:30 PM',
      oilType: 'Engine Oil',
      quantity: 200,
      status: 'pending'
    },
    { 
      id: '5', 
      customer: 'Tech Industries', 
      address: '654 Tech Park, City', 
      time: '06:00 PM',
      oilType: 'Diesel',
      quantity: 400,
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'in-progress': return <ClockIcon className="h-4 w-4" />;
      case 'pending': return <AlertCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Good morning, {user.displayName}!</h1>
            <p className="text-blue-100">You have {driverStats.remainingDeliveries} deliveries remaining today</p>
          </div>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverStats.completedDeliveries}/{driverStats.todayDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              {driverStats.remainingDeliveries} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance Covered</CardTitle>
            <NavigationIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverStats.totalDistance} km</div>
            <p className="text-xs text-muted-foreground">
              {driverStats.fuelEfficiency} km/L efficiency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{driverStats.onTimeDeliveries}%</div>
            <p className="text-xs text-muted-foreground">
              this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-500" />
            Today's Delivery Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaySchedule.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    {getStatusIcon(delivery.status)}
                  </div>
                  <div>
                    <p className="font-semibold">{delivery.customer}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      {delivery.address}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {delivery.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <FuelIcon className="h-4 w-4" />
                        {delivery.oilType} - {delivery.quantity}L
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status.replace('-', ' ')}
                  </Badge>
                  {delivery.status === 'pending' && (
                    <Button size="sm">
                      Start Delivery
                    </Button>
                  )}
                  {delivery.status === 'in-progress' && (
                    <Button size="sm" variant="outline">
                      Navigate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <NavigationIcon className="h-6 w-6 mb-2" />
                Navigation
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <ClockIcon className="h-6 w-6 mb-2" />
                Check In
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <AlertCircleIcon className="h-6 w-6 mb-2" />
                Report Issue
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <TruckIcon className="h-6 w-6 mb-2" />
                Vehicle Status
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Check oil quality before delivery</p>
                <p className="text-xs text-blue-600">Ensure product meets customer specifications</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Confirm delivery quantities</p>
                <p className="text-xs text-green-600">Double-check meter readings for accuracy</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Safety first</p>
                <p className="text-xs text-yellow-600">Follow all safety protocols during delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}