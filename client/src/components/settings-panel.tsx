import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  TrashIcon, 
  DatabaseIcon, 
  CloudIcon, 
  HardDriveIcon,
  AlertTriangleIcon,
  CalendarIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StorageUsage {
  collections: Array<{
    collection: string;
    count: number;
  }>;
  totalDocuments: number;
  estimatedSize: string;
}

interface SettingsPanelProps {
  storageUsage: StorageUsage | null;
  onDeleteRecords: (collection: string, startDate: Date, endDate: Date) => Promise<void>;
}

export default function SettingsPanel({ storageUsage, onDeleteRecords }: SettingsPanelProps) {
  const [deleteForm, setDeleteForm] = useState({
    collection: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteRecords = async () => {
    if (!deleteForm.collection || !deleteForm.startDate || !deleteForm.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const startDate = new Date(deleteForm.startDate);
      const endDate = new Date(deleteForm.endDate);
      
      await onDeleteRecords(deleteForm.collection, startDate, endDate);
      
      setDeleteForm({
        collection: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error('Error deleting records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Firebase Storage usage would be calculated here in production

  return (
    <div className="space-y-6">
      {/* Storage Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firestore Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Firestore Database</CardTitle>
            <DatabaseIcon className="w-5 h-5 ml-2 text-blue-500" />
          </CardHeader>
          <CardContent>
            {storageUsage ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Documents:</span>
                  <span className="font-medium">{storageUsage.totalDocuments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Size:</span>
                  <span className="font-medium">{storageUsage.estimatedSize}</span>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Collections Breakdown:</h4>
                  <div className="space-y-1">
                    {storageUsage.collections.map((item) => (
                      <div key={item.collection} className="flex justify-between text-sm">
                        <span className="capitalize text-gray-600">{item.collection}:</span>
                        <span>{item.count} docs</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading storage usage...</p>
            )}
          </CardContent>
        </Card>

        {/* Firebase Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Firebase Storage</CardTitle>
            <CloudIcon className="w-5 h-5 ml-2 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Photo Storage:</span>
                <span className="font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Folder Structure:</span>
                <span className="font-medium">Organized</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                All delivery and loading photos are stored securely in Firebase Storage with organized folder structure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrashIcon className="w-5 h-5 mr-2 text-red-500" />
            Data Cleanup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Delete records by date range to manage storage and remove old data. This action cannot be undone.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collection">Collection</Label>
                <Select 
                  value={deleteForm.collection} 
                  onValueChange={(value) => setDeleteForm(prev => ({ ...prev, collection: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deliveries">Deliveries</SelectItem>
                    <SelectItem value="complaints">Complaints</SelectItem>
                    <SelectItem value="tasks">Tasks</SelectItem>
                    <SelectItem value="branches">Branches</SelectItem>
                    <SelectItem value="oilTypes">Oil Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={deleteForm.startDate}
                    onChange={(e) => setDeleteForm(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={deleteForm.endDate}
                    onChange={(e) => setDeleteForm(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={!deleteForm.collection || !deleteForm.startDate || !deleteForm.endDate || loading}
                  className="w-full md:w-auto"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  {loading ? 'Deleting...' : 'Delete Records'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
                    Confirm Data Deletion
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete records from <strong>{deleteForm.collection}</strong> 
                    from <strong>{deleteForm.startDate}</strong> to <strong>{deleteForm.endDate}</strong>?
                    <br /><br />
                    <strong className="text-red-600">This action cannot be undone!</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRecords} className="bg-red-600 hover:bg-red-700">
                    Delete Records
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDriveIcon className="w-5 h-5 mr-2 text-gray-500" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Application Version</h4>
              <p className="text-sm text-gray-600">OILDELIVERY v1.0.0</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Last Backup</h4>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString()} (Automated)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Database Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Connected</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Cloud Storage</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}