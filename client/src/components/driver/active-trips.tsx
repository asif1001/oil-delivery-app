import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, ClockIcon, UserIcon, PhoneIcon } from "lucide-react";

// Mock trips data
const mockTrips = [
  {
    id: "1",
    customer: "Sarah Johnson",
    pickup: "123 Main St",
    destination: "Airport Terminal 2",
    scheduledTime: "11:30 AM",
    status: "in_progress",
    fare: "$45.00",
    distance: "12.5 miles"
  },
  {
    id: "2",
    customer: "Mike Chen",
    pickup: "Downtown Plaza",
    destination: "Business District",
    scheduledTime: "2:15 PM",
    status: "scheduled",
    fare: "$28.00",
    distance: "8.2 miles"
  }
];

export default function ActiveTrips() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <section className="px-4 mb-6">
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="p-4 border-b border-gray-100">
          <CardTitle className="font-semibold text-gray-800">Active Trips</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {mockTrips.length === 0 ? (
            <div className="text-center py-8">
              <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No active trips</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {mockTrips.map((trip) => (
                <div 
                  key={trip.id} 
                  className="p-4"
                  data-testid={`trip-item-${trip.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-driver rounded-full w-10 h-10 flex items-center justify-center">
                        <UserIcon className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800" data-testid={`trip-customer-${trip.id}`}>
                          {trip.customer}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span data-testid={`trip-time-${trip.id}`}>{trip.scheduledTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={`text-xs mb-1 ${getStatusColor(trip.status)}`}
                        data-testid={`trip-status-${trip.id}`}
                      >
                        {getStatusText(trip.status)}
                      </Badge>
                      <p className="font-semibold text-gray-800" data-testid={`trip-fare-${trip.id}`}>
                        {trip.fare}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-start">
                      <MapPinIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Pickup</p>
                        <p className="text-sm font-medium text-gray-800" data-testid={`trip-pickup-${trip.id}`}>
                          {trip.pickup}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPinIcon className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Destination</p>
                        <p className="text-sm font-medium text-gray-800" data-testid={`trip-destination-${trip.id}`}>
                          {trip.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Distance: {trip.distance}</span>
                  </div>

                  <div className="flex gap-2">
                    {trip.status === 'in_progress' ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-driver hover:bg-driver/90 text-white flex-1"
                          data-testid={`button-complete-trip-${trip.id}`}
                        >
                          Complete Trip
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-driver border-driver hover:bg-driver/10"
                          data-testid={`button-call-customer-${trip.id}`}
                        >
                          <PhoneIcon className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="bg-driver hover:bg-driver/90 text-white flex-1"
                          data-testid={`button-start-trip-${trip.id}`}
                        >
                          Start Trip
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-driver border-driver hover:bg-driver/10"
                          data-testid={`button-call-customer-${trip.id}`}
                        >
                          <PhoneIcon className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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