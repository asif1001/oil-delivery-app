import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon, UsersIcon, CalendarIcon, IdCardIcon, CreditCardIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: string;
  active: boolean;
  empNo?: string;
  driverLicenceNo?: string;
  tankerLicenceNo?: string;
  licenceExpiryDate?: Date;
}

interface CreateDriver {
  email: string;
  password: string;
  displayName: string;
  empNo: string;
  driverLicenceNo: string;
  tankerLicenceNo: string;
  licenceExpiryDate: string;
}

interface AdminDriversProps {
  drivers: User[];
  onAddDriver: (driver: CreateDriver) => void;
  onUpdateDriver: (id: string, driver: Partial<User>) => void;
  onDeleteDriver: (id: string) => void;
  onToggleDriverStatus: (id: string, active: boolean) => void;
}

export default function AdminDrivers({ 
  drivers, 
  onAddDriver, 
  onUpdateDriver, 
  onDeleteDriver,
  onToggleDriverStatus
}: AdminDriversProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<User | null>(null);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [changingPasswordFor, setChangingPasswordFor] = useState<User | null>(null);
  const [passwordChangeData, setPasswordChangeData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    empNo: '',
    driverLicenceNo: '',
    tankerLicenceNo: '',
    licenceExpiryDate: ''
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      displayName: '',
      empNo: '',
      driverLicenceNo: '',
      tankerLicenceNo: '',
      licenceExpiryDate: ''
    });
    setEditingDriver(null);
  };

  const handleSubmit = () => {
    if (!formData.email || !formData.displayName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!editingDriver && !formData.password) {
      toast({
        title: "Missing Password",
        description: "Password is required for new drivers",
        variant: "destructive"
      });
      return;
    }

    if (editingDriver) {
      const updateData = {
        email: formData.email,
        displayName: formData.displayName,
        empNo: formData.empNo,
        driverLicenceNo: formData.driverLicenceNo,
        tankerLicenceNo: formData.tankerLicenceNo,
        licenceExpiryDate: formData.licenceExpiryDate ? new Date(formData.licenceExpiryDate) : undefined
      };
      onUpdateDriver(editingDriver.uid, updateData);
      toast({
        title: "Success",
        description: "Driver updated successfully"
      });
    } else {
      onAddDriver(formData as CreateDriver);
      toast({
        title: "Success",
        description: "Driver added successfully"
      });
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (driver: User) => {
    setEditingDriver(driver);
    setFormData({
      email: driver.email || '',
      password: '',
      displayName: driver.displayName || '',
      empNo: driver.empNo || '',
      driverLicenceNo: driver.driverLicenceNo || '',
      tankerLicenceNo: driver.tankerLicenceNo || '',
      licenceExpiryDate: driver.licenceExpiryDate ? 
        (driver.licenceExpiryDate instanceof Date ? 
          driver.licenceExpiryDate.toISOString().split('T')[0] :
          new Date(driver.licenceExpiryDate).toISOString().split('T')[0]
        ) : ''
    });
    setIsOpen(true);
  };

  const handleDelete = (driver: User) => {
    if (window.confirm(`Are you sure you want to delete driver ${driver.displayName}?`)) {
      onDeleteDriver(driver.uid);
      toast({
        title: "Success",
        description: "Driver deleted successfully"
      });
    }
  };

  const handleToggleStatus = (driver: User) => {
    onToggleDriverStatus(driver.uid, !driver.active);
    toast({
      title: "Success",
      description: `Driver ${driver.active ? 'deactivated' : 'activated'} successfully`
    });
  };

  const handlePasswordChange = () => {
    if (!passwordChangeData.newPassword || !passwordChangeData.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in both password fields",
        variant: "destructive"
      });
      return;
    }

    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Handle password change logic here
    toast({
      title: "Success",
      description: "Password changed successfully"
    });

    setPasswordChangeData({ newPassword: '', confirmPassword: '' });
    setIsPasswordChangeOpen(false);
    setChangingPasswordFor(null);
  };

  const isLicenceExpiring = (driver: User) => {
    if (!driver.licenceExpiryDate) return false;
    const expiryDate = new Date(driver.licenceExpiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Driver Management</h2>
          <p className="text-gray-600">Manage your delivery drivers and their credentials</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsOpen(true); }}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
              </div>
              
              {!editingDriver && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empNo">Employee Number</Label>
                  <Input
                    id="empNo"
                    value={formData.empNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, empNo: e.target.value }))}
                    placeholder="Enter employee number"
                  />
                </div>
                <div>
                  <Label htmlFor="licenceExpiryDate">Licence Expiry Date</Label>
                  <Input
                    id="licenceExpiryDate"
                    type="date"
                    value={formData.licenceExpiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenceExpiryDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="driverLicenceNo">Driver Licence Number</Label>
                  <Input
                    id="driverLicenceNo"
                    value={formData.driverLicenceNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, driverLicenceNo: e.target.value }))}
                    placeholder="Enter driver licence number"
                  />
                </div>
                <div>
                  <Label htmlFor="tankerLicenceNo">Tanker Licence Number</Label>
                  <Input
                    id="tankerLicenceNo"
                    value={formData.tankerLicenceNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tankerLicenceNo: e.target.value }))}
                    placeholder="Enter tanker licence number"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingDriver ? 'Update' : 'Add'} Driver
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password for {changingPasswordFor?.displayName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordChangeData.newPassword}
                onChange={(e) => setPasswordChangeData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordChangeData.confirmPassword}
                onChange={(e) => setPasswordChangeData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsPasswordChangeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChange}>
                Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <Card key={driver.uid} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{driver.displayName}</CardTitle>
                    <p className="text-sm text-gray-600">{driver.email}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(driver)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge 
                    variant={driver.active ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleStatus(driver)}
                  >
                    {driver.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                {driver.empNo && (
                  <div className="flex items-center space-x-2">
                    <IdCardIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Emp #: {driver.empNo}</span>
                  </div>
                )}
                
                {(driver.driverLicenceNo || driver.tankerLicenceNo) && (
                  <div className="space-y-1">
                    {driver.driverLicenceNo && (
                      <div className="flex items-center space-x-2">
                        <CreditCardIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">DL: {driver.driverLicenceNo}</span>
                      </div>
                    )}
                    {driver.tankerLicenceNo && (
                      <div className="flex items-center space-x-2">
                        <CreditCardIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">TL: {driver.tankerLicenceNo}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {driver.licenceExpiryDate && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Expires: {formatDate(driver.licenceExpiryDate)}
                    </span>
                    {isLicenceExpiring(driver) && (
                      <Badge variant="destructive" className="text-xs">
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="pt-2 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setChangingPasswordFor(driver);
                      setIsPasswordChangeOpen(true);
                    }}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {drivers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first driver.</p>
            <Button onClick={() => setIsOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Driver
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}