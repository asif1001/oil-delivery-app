import { Card, CardContent } from "@/components/ui/card";
import { TruckIcon, DollarSignIcon, ClockIcon, RouteIcon } from "lucide-react";

const driverStats = [
  {
    icon: TruckIcon,
    color: "bg-driver",
    value: "12",
    label: "Active Trips",
    change: "+3 today",
    testId: "stat-active-trips"
  },
  {
    icon: DollarSignIcon,
    color: "bg-green-500",
    value: "$1,245",
    label: "Today's Earnings",
    change: "+$180 from yesterday",
    testId: "stat-earnings"
  },
  {
    icon: ClockIcon,
    color: "bg-blue-500",
    value: "8.5h",
    label: "Hours Driven",
    change: "2h remaining",
    testId: "stat-hours-driven"
  },
  {
    icon: RouteIcon,
    color: "bg-purple-500",
    value: "156",
    label: "Miles Covered",
    change: "+24 miles",
    testId: "stat-miles-covered"
  }
];

export default function DriverStats() {
  return (
    <section className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        {driverStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.testId} className="shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`${stat.color} rounded-lg w-10 h-10 flex items-center justify-center`}>
                    <Icon className="text-white w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1" data-testid={`value-${stat.testId}`}>
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mb-1" data-testid={`label-${stat.testId}`}>
                  {stat.label}
                </p>
                <p className="text-xs text-green-600 font-medium" data-testid={`change-${stat.testId}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}