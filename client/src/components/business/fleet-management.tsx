import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TruckIcon, UserIcon, MapPinIcon, MoreVerticalIcon } from "lucide-react";

// Mock fleet data
const mockFleet = [
  {
    id: "V001",
    vehicle: "Toyota Camry 2022",
    driver: "John Smith",
    status: "active",
    location: "Downtown Area",
    trips: 5,
    earnings: "$245.00"
  },
  {
    id: "V002",
    vehicle: "Honda Accord 2023",
    driver: "Sarah Johnson",
    status: "maintenance",
    location: "Service Center",
    trips: 0,
    earnings: "$0.00"
  },
  {
    id: "V003",
    vehicle: "Ford Focus 2021",
    driver: "Mike Chen",
    status: "active",
    location: "Airport Zone",
    trips: 8,
    earnings: "$380.00"
  }
];

export default function FleetManagement() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'maintenance': return 'Maintenance';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  return (
    <section className="px-4 mb-6">
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold text-gray-800">Fleet Management</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-business border-business hover:bg-business/10"
              data-testid="button-add-vehicle"
            >
              Add Vehicle
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {mockFleet.length === 0 ? (
            <div className="text-center py-8">
              <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No vehicles in fleet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {mockFleet.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  className="p-4"
                  data-testid={`vehicle-item-${vehicle.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-business rounded-lg w-12 h-12 flex items-center justify-center">
                        <TruckIcon className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800" data-testid={`vehicle-name-${vehicle.id}`}>
                          {vehicle.vehicle}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <UserIcon className="w-4 h-4 mr-1" />
                          <span data-testid={`vehicle-driver-${vehicle.id}`}>{vehicle.driver}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs ${getStatusColor(vehicle.status)}`}
                        data-testid={`vehicle-status-${vehicle.id}`}
                      >
                        {getStatusText(vehicle.status)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-gray-400 hover:text-gray-600"
                        data-testid={`button-vehicle-menu-${vehicle.id}`}
                      >
                        <MoreVerticalIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span data-testid={`vehicle-location-${vehicle.id}`}>{vehicle.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Today's Trips</p>
                      <p className="text-lg font-semibold text-gray-800" data-testid={`vehicle-trips-${vehicle.id}`}>
                        {vehicle.trips}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Today's Earnings</p>
                      <p className="text-lg font-semibold text-gray-800" data-testid={`vehicle-earnings-${vehicle.id}`}>
                        {vehicle.earnings}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-business border-business hover:bg-business/10"
                      data-testid={`button-track-vehicle-${vehicle.id}`}
                    >
                      Track
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-business border-business hover:bg-business/10"
                      data-testid={`button-contact-driver-${vehicle.id}`}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}