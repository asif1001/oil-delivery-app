import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TruckIcon, FuelIcon, SettingsIcon, AlertTriangleIcon } from "lucide-react";

// Mock vehicle data
const vehicleData = {
  id: "V001",
  make: "Toyota",
  model: "Camry",
  year: "2022",
  licensePlate: "ABC-123",
  status: "active",
  fuelLevel: 78,
  mileage: 45620,
  lastService: "2024-01-10",
  nextService: "2024-04-10"
};

export default function VehicleStatus() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFuelColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 25) return 'bg-orange-500';
    return 'bg-red-500';
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
            <CardTitle className="font-semibold text-gray-800">Vehicle Status</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-driver border-driver hover:bg-driver/10"
              data-testid="button-vehicle-settings"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Vehicle Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-driver rounded-lg w-12 h-12 flex items-center justify-center">
              <TruckIcon className="text-white w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800" data-testid="text-vehicle-name">
                {vehicleData.year} {vehicleData.make} {vehicleData.model}
              </h3>
              <p className="text-sm text-gray-600" data-testid="text-vehicle-plate">
                License: {vehicleData.licensePlate}
              </p>
              <Badge 
                className={`mt-1 text-xs ${getStatusColor(vehicleData.status)}`}
                data-testid="badge-vehicle-status"
              >
                {getStatusText(vehicleData.status)}
              </Badge>
            </div>
          </div>

          {/* Vehicle Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Fuel Level */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FuelIcon className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">Fuel Level</span>
                </div>
                <span className="text-sm font-medium text-gray-800" data-testid="text-fuel-percentage">
                  {vehicleData.fuelLevel}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${getFuelColor(vehicleData.fuelLevel)} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${vehicleData.fuelLevel}%` }}
                  data-testid="bar-fuel-level"
                ></div>
              </div>
            </div>

            {/* Mileage */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Total Mileage</p>
              <p className="text-lg font-semibold text-gray-800" data-testid="text-vehicle-mileage">
                {vehicleData.mileage.toLocaleString()} mi
              </p>
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-800">Service History</h4>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">Last Service</p>
                <p className="text-sm text-gray-600" data-testid="text-last-service">
                  {new Date(vehicleData.lastService).toLocaleDateString()}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 text-xs">
                Completed
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">Next Service Due</p>
                <p className="text-sm text-gray-600" data-testid="text-next-service">
                  {new Date(vehicleData.nextService).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <AlertTriangleIcon className="w-4 h-4 text-orange-500 mr-1" />
                <Badge className="bg-orange-100 text-orange-700 text-xs">
                  Due Soon
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              className="flex-1 text-driver border-driver hover:bg-driver/10"
              data-testid="button-report-issue"
            >
              Report Issue
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-driver border-driver hover:bg-driver/10"
              data-testid="button-schedule-service"
            >
              Schedule Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}