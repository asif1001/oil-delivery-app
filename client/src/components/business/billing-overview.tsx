import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCardIcon, FileTextIcon, CalendarIcon, AlertCircleIcon } from "lucide-react";

// Mock billing data
const billingData = {
  currentPlan: "Business Pro",
  monthlyFee: "$299.00",
  nextBillingDate: "2024-02-01",
  status: "active",
  usage: {
    trips: 245,
    limit: 500,
    percentage: 49
  }
};

const recentInvoices = [
  {
    id: "INV-001",
    date: "2024-01-01",
    amount: "$299.00",
    status: "paid",
    description: "Monthly Subscription - Business Pro"
  },
  {
    id: "INV-002",
    date: "2023-12-01",
    amount: "$299.00",
    status: "paid",
    description: "Monthly Subscription - Business Pro"
  },
  {
    id: "INV-003",
    date: "2023-11-01",
    amount: "$299.00",
    status: "overdue",
    description: "Monthly Subscription - Business Pro"
  }
];

export default function BillingOverview() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'active': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'overdue': return 'Overdue';
      case 'active': return 'Active';
      default: return status;
    }
  };

  return (
    <section className="px-4 mb-6">
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="font-semibold text-gray-800">Billing Overview</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-business border-business hover:bg-business/10"
              data-testid="button-manage-billing"
            >
              Manage Billing
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Current Plan */}
          <div className="bg-gradient-to-r from-business/10 to-business/5 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800" data-testid="text-current-plan">
                  {billingData.currentPlan}
                </h3>
                <p className="text-sm text-gray-600">Current subscription plan</p>
              </div>
              <Badge 
                className={`text-xs ${getStatusColor(billingData.status)}`}
                data-testid="badge-billing-status"
              >
                {getStatusText(billingData.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Monthly Fee</p>
                <p className="text-xl font-bold text-gray-800" data-testid="text-monthly-fee">
                  {billingData.monthlyFee}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Billing</p>
                <p className="text-sm font-medium text-gray-800" data-testid="text-next-billing">
                  {new Date(billingData.nextBillingDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">Monthly Usage</h4>
              <span className="text-sm text-gray-600" data-testid="text-usage-count">
                {billingData.usage.trips} / {billingData.usage.limit} trips
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-business h-2 rounded-full transition-all duration-300"
                style={{ width: `${billingData.usage.percentage}%` }}
                data-testid="bar-usage-progress"
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {billingData.usage.limit - billingData.usage.trips} trips remaining this month
            </p>
          </div>

          {/* Recent Invoices */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">Recent Invoices</h4>
              <Button
                variant="ghost"
                size="sm"
                className="text-business hover:text-business/80 p-0 h-auto"
                data-testid="button-view-all-invoices"
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-2">
              {recentInvoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  data-testid={`invoice-item-${invoice.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white rounded-lg w-10 h-10 flex items-center justify-center">
                      {invoice.status === 'overdue' ? (
                        <AlertCircleIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <FileTextIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800" data-testid={`invoice-id-${invoice.id}`}>
                        {invoice.id}
                      </p>
                      <p className="text-xs text-gray-600" data-testid={`invoice-description-${invoice.id}`}>
                        {invoice.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        <span data-testid={`invoice-date-${invoice.id}`}>
                          {new Date(invoice.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800" data-testid={`invoice-amount-${invoice.id}`}>
                      {invoice.amount}
                    </p>
                    <Badge 
                      className={`text-xs mt-1 ${getStatusColor(invoice.status)}`}
                      data-testid={`invoice-status-${invoice.id}`}
                    >
                      {getStatusText(invoice.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              className="flex-1 text-business border-business hover:bg-business/10"
              data-testid="button-upgrade-plan"
            >
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-business border-business hover:bg-business/10"
              data-testid="button-payment-method"
            >
              Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}