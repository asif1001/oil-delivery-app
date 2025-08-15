import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon, EditIcon, TrashIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Branch, OilType } from "@shared/schema";

interface CreateOilTank {
  capacity: number;
  oilTypeId: string;
  oilTypeName: string;
  currentLevel: number;
}

interface CreateBranch {
  name: string;
  address: string;
  contactNo: string;
  oilTanks: CreateOilTank[];
}

interface AdminBranchesProps {
  branches: Branch[];
  oilTypes: OilType[];
  onAddBranch: (branch: CreateBranch) => void;
  onUpdateBranch: (id: string, branch: Partial<Branch>) => void;
  onDeleteBranch: (id: string) => void;
}

export default function AdminBranches({ 
  branches, 
  oilTypes, 
  onAddBranch, 
  onUpdateBranch, 
  onDeleteBranch 
}: AdminBranchesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNo: '',
    oilTanks: [] as CreateOilTank[]
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.contactNo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingBranch) {
      onUpdateBranch(editingBranch.id, {
        ...formData,
        oilTanks: formData.oilTanks.map((tank, index) => ({
          id: `${editingBranch.id}-tank-${index}`,
          ...tank
        })) as any
      });
      toast({
        title: "Success",
        description: "Branch updated successfully"
      });
    } else {
      onAddBranch(formData);
      toast({
        title: "Success",
        description: "Branch added successfully"
      });
    }

    setIsOpen(false);
    setEditingBranch(null);
    setFormData({ name: '', address: '', contactNo: '', oilTanks: [] });
  };

  const addOilTank = () => {
    setFormData(prev => ({
      ...prev,
      oilTanks: [...prev.oilTanks, {
        capacity: 0,
        oilTypeId: '',
        oilTypeName: '',
        currentLevel: 0
      }]
    }));
  };

  const updateOilTank = (index: number, field: keyof CreateOilTank, value: any) => {
    setFormData(prev => ({
      ...prev,
      oilTanks: prev.oilTanks.map((tank, i) => 
        i === index ? { ...tank, [field]: value } : tank
      )
    }));
  };

  const removeOilTank = (index: number) => {
    setFormData(prev => ({
      ...prev,
      oilTanks: prev.oilTanks.filter((_, i) => i !== index)
    }));
  };

  const startEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      contactNo: branch.contactNo,
      oilTanks: (branch as any).oilTanks?.map((tank: any) => ({
        capacity: tank.capacity,
        oilTypeId: tank.oilTypeId,
        oilTypeName: tank.oilTypeName,
        currentLevel: tank.currentLevel
      })) || []
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Branch Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-branch">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    data-testid="input-branch-name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactNo">Contact Number *</Label>
                  <Input
                    id="contactNo"
                    value={formData.contactNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNo: e.target.value }))}
                    data-testid="input-contact-no"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  data-testid="input-address"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Oil Tanks</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOilTank}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Tank
                  </Button>
                </div>

                {formData.oilTanks.map((tank, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Oil Type</Label>
                        <Select
                          value={tank.oilTypeId}
                          onValueChange={(value) => {
                            const selectedOilType = oilTypes.find(ot => ot.id === value);
                            updateOilTank(index, 'oilTypeId', value);
                            updateOilTank(index, 'oilTypeName', selectedOilType?.name || '');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select oil type" />
                          </SelectTrigger>
                          <SelectContent>
                            {oilTypes.map(oilType => (
                              <SelectItem key={oilType.id} value={oilType.id}>
                                {oilType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Capacity (L)</Label>
                        <Input
                          type="number"
                          value={tank.capacity}
                          onChange={(e) => updateOilTank(index, 'capacity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Current Level (L)</Label>
                        <Input
                          type="number"
                          value={tank.currentLevel}
                          onChange={(e) => updateOilTank(index, 'currentLevel', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => removeOilTank(index)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button type="submit" data-testid="button-save-branch">
                  {editingBranch ? 'Update Branch' : 'Add Branch'}
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
        {branches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5 text-orange-500" />
                  <span>{branch.name}</span>
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(branch)}
                    data-testid={`button-edit-branch-${branch.id}`}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteBranch(branch.id)}
                    data-testid={`button-delete-branch-${branch.id}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{branch.address}</p>
                <p className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {branch.contactNo}
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Oil Tanks ({(branch as any).oilTanks?.length || 0})</h4>
                  {!(branch as any).oilTanks || (branch as any).oilTanks.length === 0 ? (
                    <p className="text-sm text-gray-500">No tanks configured</p>
                  ) : (
                    <div className="space-y-1">
                      {(branch as any).oilTanks.map((tank: any, index: number) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">{tank.oilTypeName}</span>
                            <span>{tank.currentLevel}L / {tank.capacity}L</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min((tank.currentLevel / tank.capacity) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {branches.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <MapPinIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No branches found. Add your first branch to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}