import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react";

// Mock bookings data
const mockBookings = [
  {
    id: "1",
    service: "City Tour",
    date: "2024-01-20",
    time: "10:00 AM",
    location: "Downtown Plaza",
    status: "confirmed",
    price: "$45.00"
  },
  {
    id: "2",
    service: "Airport Transfer",
    date: "2024-01-25",
    time: "6:30 AM",
    location: "Terminal 2",
    status: "pending",
    price: "$35.00"
  },
  {
    id: "3",
    service: "Business Meeting",
    date: "2024-01-15",
    time: "2:00 PM",
    location: "Corporate Center",
    status: "completed",
    price: "$60.00"
  }
];

export default function UserBookings() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <section className="px-4 mb-6">
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold text-gray-800">My Bookings</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary hover:bg-primary/10"
              data-testid="button-new-booking"
            >
              New Booking
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {mockBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No bookings found</p>
              <Button className="mt-3" data-testid="button-create-first-booking">
                Create Your First Booking
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {mockBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-4 hover:bg-gray-50 transition-colors"
                  data-testid={`booking-item-${booking.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1" data-testid={`booking-service-${booking.id}`}>
                        {booking.service}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span data-testid={`booking-date-${booking.id}`}>{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span data-testid={`booking-time-${booking.id}`}>{booking.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span data-testid={`booking-location-${booking.id}`}>{booking.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={`text-xs mb-2 ${getStatusColor(booking.status)}`}
                        data-testid={`booking-status-${booking.id}`}
                      >
                        {getStatusText(booking.status)}
                      </Badge>
                      <p className="font-semibold text-gray-800" data-testid={`booking-price-${booking.id}`}>
                        {booking.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid={`button-view-booking-${booking.id}`}
                    >
                      View Details
                    </Button>
                    {booking.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                        data-testid={`button-cancel-booking-${booking.id}`}
                      >
                        Cancel
                      </Button>
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