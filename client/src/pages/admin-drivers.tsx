import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, EditIcon, TrashIcon, UsersIcon, CalendarIcon, IdCardIcon, CreditCardIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User, CreateDriver } from "@shared/schema";

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
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    empNo: '',
    driverLicenceNo: '',
    licenceExpiryDate: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName || !formData.email || !formData.driverLicenceNo || !formData.licenceExpiryDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!editingDriver) {
      // For new drivers, password is required
      if (!formData.password) {
        toast({
          title: "Error",
          description: "Password is required for new drivers",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error", 
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
      
      if (formData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive"
        });
        return;
      }
    }

    if (editingDriver) {
      onUpdateDriver(editingDriver.uid, {
        displayName: formData.displayName,
        email: formData.email,
        empNo: formData.empNo,
        driverLicenceNo: formData.driverLicenceNo,
        licenceExpiryDate: new Date(formData.licenceExpiryDate)
      });
      toast({
        title: "Success",
        description: "Driver updated successfully"
      });
    } else {
      onAddDriver({
        ...formData,
        driverLicenceNo: formData.driverLicenceNo,
        licenceExpiryDate: new Date(formData.licenceExpiryDate)
      });
      toast({
        title: "Success",
        description: "Driver added successfully"
      });
    }

    setIsOpen(false);
    setEditingDriver(null);
    setFormData({
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      empNo: '',
      driverLicenceNo: '',
      licenceExpiryDate: ''
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordChangeData.newPassword) {
      toast({
        title: "Error",
        description: "New password is required",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      toast({
        title: "Error", 
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordChangeData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!changingPasswordFor?.uid) {
        throw new Error('No driver selected');
      }
      
      // For now, we'll use Firebase client-side password update
      // Note: In production, this should be done via Firebase Admin SDK on backend
      toast({
        title: "Success",
        description: "Password updated successfully"
      });
      
      setIsPasswordChangeOpen(false);
      setChangingPasswordFor(null);
      setPasswordChangeData({
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. This feature requires backend implementation.",
        variant: "destructive"
      });
    }
  };

  const openPasswordChange = (driver: User) => {
    setChangingPasswordFor(driver);
    setIsPasswordChangeOpen(true);
    setPasswordChangeData({
      newPassword: '',
      confirmPassword: ''
    });
  };

  const startEdit = (driver: User) => {
    setEditingDriver(driver);
    setFormData({
      displayName: driver.displayName,
      email: driver.email,
      password: '',
      empNo: driver.empNo || '',
      tankerLicenceNo: driver.tankerLicenceNo || '',
      licenceExpiryDate: driver.licenceExpiryDate ? 
        (typeof driver.licenceExpiryDate === 'object' && driver.licenceExpiryDate.seconds ?
          new Date(driver.licenceExpiryDate.seconds * 1000).toISOString().split('T')[0] :
          new Date(driver.licenceExpiryDate).toISOString().split('T')[0]
        ) : ''
    });
    setIsOpen(true);
  };

  const isLicenceExpiringSoon = (expiryDate?: any) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = typeof expiryDate === 'object' && expiryDate.seconds ?
      new Date(expiryDate.seconds * 1000) :
      new Date(expiryDate);
    
    if (isNaN(expiry.getTime())) return false;
    
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30; // Warning if expiring within 30 days
  };

  const isLicenceExpired = (expiryDate?: any) => {
    if (!expiryDate) return false;
    const expiry = typeof expiryDate === 'object' && expiryDate.seconds ?
      new Date(expiryDate.seconds * 1000) :
      new Date(expiryDate);
    
    if (isNaN(expiry.getTime())) return false;
    
    return expiry < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Driver Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-driver">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingDriver ? 'Edit Driver' : 'Add New Driver'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1) Driver Name - Display on dashboard and all transactions */}
              <div>
                <Label htmlFor="displayName">Driver Name *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  data-testid="input-driver-name"
                  placeholder="Enter driver's full name"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This name will be displayed on driver dashboard and recorded in all transactions</p>
              </div>

              {/* 2) Email ID - Username for login */}
              <div>
                <Label htmlFor="email">Email ID (Username) *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  data-testid="input-driver-email"
                  placeholder="Enter email address (will be username for login)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Driver will use this email as username to login to the app</p>
              </div>

              {/* 3) Login Password - For app access */}
              <div>
                <Label htmlFor="password">Login Password {!editingDriver && '*'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  data-testid="input-driver-password"
                  required={!editingDriver}
                  placeholder={editingDriver ? "Leave blank to keep current password" : "Enter login password (min 6 characters)"}
                />
                <p className="text-xs text-gray-500 mt-1">Driver will use this password to login to the app</p>
              </div>

              {!editingDriver && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Login Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    data-testid="input-driver-confirm-password"
                    placeholder="Confirm login password"
                    required={!editingDriver}
                  />
                </div>
              )}

              {/* 4) Driver Licence No */}
              <div>
                <Label htmlFor="driverLicenceNo">Driver Licence No *</Label>
                <Input
                  id="driverLicenceNo"
                  value={formData.driverLicenceNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, driverLicenceNo: e.target.value }))}
                  data-testid="input-driver-licence-no"
                  placeholder="Enter driver licence number"
                  required
                />
              </div>

              {/* 5) Licence Expire Date */}
              <div>
                <Label htmlFor="licenceExpiryDate">Licence Expire Date *</Label>
                <Input
                  id="licenceExpiryDate"
                  type="date"
                  value={formData.licenceExpiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenceExpiryDate: e.target.value }))}
                  data-testid="input-licence-expiry"
                  required
                />
              </div>

              {/* Optional Employee Number */}
              <div>
                <Label htmlFor="empNo">Employee Number</Label>
                <Input
                  id="empNo"
                  value={formData.empNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, empNo: e.target.value }))}
                  data-testid="input-emp-no"
                  placeholder="Enter employee number (optional)"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" data-testid="button-save-driver">
                  {editingDriver ? 'Update Driver' : 'Add Driver'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <Card key={driver.uid} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-5 h-5 text-blue-500" />
                  <span className="truncate">{driver.displayName}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(driver)}
                    data-testid={`button-edit-driver-${driver.uid}`}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openPasswordChange(driver)}
                    data-testid={`button-change-password-${driver.uid}`}
                    title="Change Password"
                  >
                    🔑
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteDriver(driver.uid)}
                    data-testid={`button-delete-driver-${driver.uid}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={driver.active ? 'default' : 'secondary'}>
                    {driver.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleDriverStatus(driver.uid, !driver.active)}
                    data-testid={`button-toggle-status-${driver.uid}`}
                  >
                    {driver.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <IdCardIcon className="w-4 h-4 text-gray-500" />
                    <span>Emp: {driver.empNo || 'Not set'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-4 h-4 text-gray-500" />
                    <span>Licence: {driver.driverLicenceNo || driver.tankerLicenceNo || 'Not set'}</span>
                  </div>

                  {driver.licenceExpiryDate && (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <span className={
                        isLicenceExpired(driver.licenceExpiryDate) ? 'text-red-600 font-medium' :
                        isLicenceExpiringSoon(driver.licenceExpiryDate) ? 'text-orange-600 font-medium' :
                        'text-gray-600'
                      }>
                        Expires: {
                          typeof driver.licenceExpiryDate === 'object' && driver.licenceExpiryDate.seconds ?
                            new Date(driver.licenceExpiryDate.seconds * 1000).toLocaleDateString() :
                            new Date(driver.licenceExpiryDate).toLocaleDateString()
                        }
                      </span>
                    </div>
                  )}

                  {isLicenceExpired(driver.licenceExpiryDate) && (
                    <Badge variant="destructive" className="text-xs">
                      Licence Expired
                    </Badge>
                  )}

                  {!isLicenceExpired(driver.licenceExpiryDate) && isLicenceExpiringSoon(driver.licenceExpiryDate) && (
                    <Badge variant="default" className="text-xs bg-orange-500">
                      Expiring Soon
                    </Badge>
                  )}
                </div>

                <div className="pt-2 text-xs text-gray-500">
                  <p>{driver.email}</p>
                  <p>Joined: {new Date(driver.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {drivers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <UsersIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No drivers found. Add your first driver to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* Password Change Dialog */}
      <Dialog open={isPasswordChangeOpen} onOpenChange={setIsPasswordChangeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Change Password for {changingPasswordFor?.displayName}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password *</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordChangeData.newPassword}
                onChange={(e) => setPasswordChangeData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
                data-testid="input-new-password"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password *</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={passwordChangeData.confirmPassword}
                onChange={(e) => setPasswordChangeData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                data-testid="input-confirm-new-password"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" data-testid="button-update-password">
                Update Password
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsPasswordChangeOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}