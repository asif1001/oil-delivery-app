import { Card, CardContent } from "@/components/ui/card";
import { DollarSignIcon, TruckIcon, TrendingUpIcon, UsersIcon } from "lucide-react";

const businessStats = [
  {
    icon: DollarSignIcon,
    color: "bg-business",
    value: "$28.4K",
    label: "Monthly Revenue",
    change: "+12% from last month",
    testId: "stat-monthly-revenue"
  },
  {
    icon: TruckIcon,
    color: "bg-driver",
    value: "24",
    label: "Fleet Vehicles",
    change: "3 active today",
    testId: "stat-fleet-vehicles"
  },
  {
    icon: UsersIcon,
    color: "bg-user",
    value: "156",
    label: "Active Customers",
    change: "+8 this week",
    testId: "stat-active-customers"
  },
  {
    icon: TrendingUpIcon,
    color: "bg-primary",
    value: "94%",
    label: "Service Rating",
    change: "↑ 2.1 points",
    testId: "stat-service-rating"
  }
];

export default function BusinessStats() {
  return (
    <section className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        {businessStats.map((stat) => {
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