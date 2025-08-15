import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon, EditIcon, TrashIcon, DropletIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OilType, InsertOilType } from "@shared/schema";

interface AdminOilTypesProps {
  oilTypes: OilType[];
  onAddOilType: (oilType: InsertOilType) => void;
  onUpdateOilType: (id: string, oilType: Partial<OilType>) => void;
  onDeleteOilType: (id: string) => void;
}

const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' }
];

export default function AdminOilTypes({ 
  oilTypes, 
  onAddOilType, 
  onUpdateOilType, 
  onDeleteOilType
}: AdminOilTypesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOilType, setEditingOilType] = useState<OilType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#f97316'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter an oil type name",
        variant: "destructive"
      });
      return;
    }

    if (editingOilType) {
      onUpdateOilType(editingOilType.id, formData);
      toast({
        title: "Success",
        description: "Oil type updated successfully"
      });
    } else {
      onAddOilType(formData);
      toast({
        title: "Success",
        description: "Oil type added successfully"
      });
    }

    setIsOpen(false);
    setEditingOilType(null);
    setFormData({ name: '', color: '#f97316' });
  };

  const startEdit = (oilType: OilType) => {
    setEditingOilType(oilType);
    setFormData({
      name: oilType.name,
      color: oilType.color || '#f97316'
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Oil Type Management</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
            <Button data-testid="button-add-oil-type">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Oil Type
            </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOilType ? 'Edit Oil Type' : 'Add New Oil Type'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Oil Type Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Syn Oil, Min Oil"
                  data-testid="input-oil-type-name"
                  required
                />
              </div>
              
              <div>
                <Label>Color</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-full h-10 rounded border-2 ${
                        formData.color === color.value ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" data-testid="button-save-oil-type">
                  {editingOilType ? 'Update Oil Type' : 'Add Oil Type'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {oilTypes.map((oilType) => (
          <Card key={oilType.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: oilType.color || '#f97316' }}
                  />
                  <span className="truncate">{oilType.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(oilType)}
                    data-testid={`button-edit-oil-type-${oilType.id}`}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteOilType(oilType.id)}
                    data-testid={`button-delete-oil-type-${oilType.id}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <DropletIcon className="w-4 h-4" />
                  <span>Created {oilType.createdAt ? new Date(oilType.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {oilTypes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <DropletIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No oil types found. Add your first oil type to get started.</p>
            <p className="text-sm mt-2">Examples: Syn Oil, Min Oil, Diesel, etc.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}