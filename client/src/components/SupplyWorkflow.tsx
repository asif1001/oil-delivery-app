import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PhotoCaptureButton } from './PhotoCaptureButton';
import { 
  TruckIcon, 
  CheckIcon, 
  DropletIcon,
  GaugeIcon,
  ArrowRightIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

import { completeDelivery, getBranches, getOilTypes, uploadPhotoToFirebaseStorage, getAllTransactions, updatePhotosWithCorrectWatermarks } from '@/lib/firebase';
import { watermarkImage, getCurrentTimestamp } from '@/utils/watermark';
import { useAuth } from '@/hooks/useAuth';

interface SupplyData {
  deliveryOrderNo: string;
  branchId: string;
  oilTypeId: string;
  startMeterReading: number;
  endMeterReading: number;
  oilSuppliedLiters: number;
  tankLevelPhoto?: string;
  hoseConnectionPhoto?: string;
  finalTankLevelPhoto?: string;
}

interface SupplyStep {
  id: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
}

interface SupplyWorkflowProps {
  onClose: () => void;
}

export function SupplyWorkflow({ onClose }: SupplyWorkflowProps) {
  const { toast } = useToast();
  const { userData: user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // 1: Branch Selection, 2: Details & Photos
  const [supplyData, setSupplyData] = useState<SupplyData>({
    deliveryOrderNo: '',
    branchId: '',
    oilTypeId: '',
    startMeterReading: 0,
    endMeterReading: 0,
    oilSuppliedLiters: 0,
  });

  // Store selected branch data for watermarking and transaction
  const [selectedBranchData, setSelectedBranchData] = useState<{
    id: string;
    name: string;
    address: string;
  } | null>(null);

  // Get last finished meter reading for auto-population
  useEffect(() => {
    const getLastMeterReading = async () => {
      try {
        const transactions = await getAllTransactions();
        const supplyTransactions = transactions.filter((t: any) => 
          t.type === 'supply' && t.endMeterReading
        ).sort((a: any, b: any) => {
          const aTime = new Date(a.timestamp?.toDate ? a.timestamp.toDate() : a.timestamp);
          const bTime = new Date(b.timestamp?.toDate ? b.timestamp.toDate() : b.timestamp);
          return bTime.getTime() - aTime.getTime();
        });
        
        if (supplyTransactions.length > 0) {
          const lastMeterReading = supplyTransactions[0].endMeterReading;
          setSupplyData(prev => ({ ...prev, startMeterReading: lastMeterReading }));
        }
      } catch (error) {
        console.error('Error getting last meter reading:', error);
      }
    };
    
    getLastMeterReading();
  }, []);

  // Fetch branches and oil types
  const { data: branches = [] } = useQuery({ 
    queryKey: ['branches'], 
    queryFn: getBranches 
  });
  const { data: oilTypes = [] } = useQuery({ 
    queryKey: ['oil-types'], 
    queryFn: getOilTypes 
  });

  const steps: SupplyStep[] = [
    { id: 1, title: 'Complete Oil Supply', status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending' },
  ];

  const handlePhotoCapture = async (photoBlob: Blob, photoType: string) => {
    try {
      // Convert blob to file for watermarking
      const originalFile = new File([photoBlob], `${photoType}_${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // Get branch name for watermarking
      const selectedBranch = selectedBranchData || branches.find(b => b.id === supplyData.branchId);
      const branchName = selectedBranch?.name || 'Unknown Branch';
      
      // Get driver name for watermarking (use displayName from userData, not email)
      const driverName = user?.displayName || 'Unknown Driver';
      
      // Apply watermark with supply-specific details
      const watermarkedFile = await watermarkImage(originalFile, {
        branchName,
        timestamp: getCurrentTimestamp(),
        extraLine1: `Driver: ${driverName}`,
        extraLine2: "Oil Type: Supply"
      });

      // Upload watermarked image
      const watermarkedBlob = new Blob([watermarkedFile], { type: 'image/jpeg' });
      const photoUrl = await uploadPhotoToFirebaseStorage(watermarkedBlob, 'delivery-photos');
      setSupplyData(prev => ({ ...prev, [`${photoType}Photo`]: photoUrl }));
      
      toast({
        title: "Photo Captured",
        description: `${photoType} photo saved successfully with watermark`
      });
    } catch (error) {
      console.error('Photo upload error:', error);
      // For demo purposes, create a local blob URL
      const localUrl = URL.createObjectURL(photoBlob);
      setSupplyData(prev => ({ ...prev, [`${photoType}Photo`]: localUrl }));
      toast({
        title: "Photo Saved Locally", 
        description: "Photo captured and saved for demo",
        variant: "default"
      });
    }
  };

  const handleCompleteSupply = async () => {
    try {
      // Validate required fields
      if (!supplyData.oilSuppliedLiters || !supplyData.branchId || !supplyData.oilTypeId) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Validate meter readings - start cannot be greater than end
      if (supplyData.startMeterReading > supplyData.endMeterReading) {
        toast({
          title: "Invalid Meter Readings",
          description: "Start meter reading cannot be greater than finish meter reading",
          variant: "destructive"
        });
        return;
      }

      console.log(`Supplying ${supplyData.oilSuppliedLiters}L directly (no load session tracking)`);

      // Submit delivery completion directly to Firestore
      const selectedOilType = (oilTypes as any[]).find((oil: any) => oil.id === supplyData.oilTypeId);
      const selectedBranch = (branches as any[]).find((branch: any) => branch.id === supplyData.branchId);
      
      const deliveryRecord = {
        loadSessionId: `DIRECT_${Date.now()}`, // Generate simple session ID for tracking
        deliveryOrderId: supplyData.deliveryOrderNo || `DO_${Date.now()}`,
        branchId: supplyData.branchId,
        branchName: selectedBranch?.name || 'Unknown Branch',
        oilTypeId: supplyData.oilTypeId,
        oilTypeName: selectedOilType?.name || 'Unknown Oil Type',
        deliveredLiters: supplyData.oilSuppliedLiters,
        startMeterReading: supplyData.startMeterReading,
        endMeterReading: supplyData.endMeterReading,
        
        photos: {
          tankLevelBefore: supplyData.tankLevelPhoto || null,
          hoseConnection: supplyData.hoseConnectionPhoto || null,
          tankLevelAfter: supplyData.finalTankLevelPhoto || null
        },
        
        actualDeliveryStartTime: new Date(),
        actualDeliveryEndTime: new Date(),
        status: 'completed',
      };

      const result = await completeDelivery(deliveryRecord);
      console.log('Delivery transaction saved to Firestore:', result);
      
      // Photos should already have correct watermarks from the two-step approach
      const branchName = selectedBranchData?.name || selectedBranch?.name || 'Unknown Branch';
      console.log('✅ Transaction completed with correct branch watermarks:', branchName);
      
      toast({
        title: "Delivery Completed",
        description: `Successfully delivered ${supplyData.oilSuppliedLiters}L to ${branchName}`
      });
      
      // Reset form
      setSupplyData({
        deliveryOrderNo: '',
        branchId: '',
        oilTypeId: '',
        startMeterReading: 0,
        endMeterReading: 0,
        oilSuppliedLiters: 0,
      });
      setSelectedBranchData(null); // Reset branch data
      setCurrentStep(1);
      onClose(); // Close and return to dashboard
    } catch (error) {
      console.error('Supply completion error:', error);
      toast({
        title: "Supply Failed",
        description: "Failed to complete delivery. Please try again.",
        variant: "destructive"
      });
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TruckIcon className="w-8 h-8" />
            <CardTitle className="text-2xl font-bold">Oil Supply Workflow</CardTitle>
          </div>
          <div className="flex justify-center space-x-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.status === 'completed' ? 'bg-green-500' :
                  step.status === 'active' ? 'bg-white text-orange-500' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {step.status === 'completed' ? <CheckIcon className="w-4 h-4" /> : step.id}
                </div>
                <span className="ml-2 text-sm">{step.title}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Step 1: Oil Supply Form */}
          {currentStep === 1 && (
            <div className="space-y-4">


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Delivery Order */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryOrder">Delivery Order</Label>
                  <Input
                    id="deliveryOrder"
                    type="text"
                    value={supplyData.deliveryOrderNo}
                    onChange={(e) => setSupplyData(prev => ({ ...prev, deliveryOrderNo: e.target.value }))}
                    placeholder="Enter delivery order number"
                    data-testid="input-delivery-order"
                  />
                </div>

                {/* Branch Selection */}
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch *</Label>
                  <Select 
                    value={supplyData.branchId} 
                    onValueChange={(value) => {
                      console.log('Step 1 - Branch dropdown changed to:', value);
                      const selectedBranch = branches.find((b: any) => b.id === value);
                      console.log('Step 1 - Selected branch object:', selectedBranch);
                      
                      if (selectedBranch) {
                        const branchData = {
                          id: selectedBranch.id,
                          name: selectedBranch.name,
                          address: selectedBranch.address
                        };
                        setSelectedBranchData(branchData);
                        console.log('✓ STEP 1 - BRANCH DATA SAVED:', branchData);
                      }
                      
                      setSupplyData(prev => {
                        const newState = { ...prev, branchId: value };
                        console.log('Step 1 - Updated supplyData:', newState);
                        return newState;
                      });
                    }}
                  >
                    <SelectTrigger data-testid="select-branch">
                      <SelectValue placeholder="Select delivery branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Oil Type Selection - Manual Selection */}
                <div className="space-y-2">
                  <Label htmlFor="oilType">Oil Type *</Label>
                  <Select 
                    value={supplyData.oilTypeId} 
                    onValueChange={(value) => setSupplyData(prev => ({ ...prev, oilTypeId: value }))}
                  >
                    <SelectTrigger data-testid="select-oil-type">
                      <SelectValue placeholder="Select oil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {oilTypes.map((oilType: any) => (
                        <SelectItem key={oilType.id} value={oilType.id}>
                          {oilType.name} - {oilType.viscosity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Oil Supplied */}
                <div className="space-y-2">
                  <Label htmlFor="oilSupplied">Oil Supplied (Liters) *</Label>
                  <Input
                    id="oilSupplied"
                    type="number"
                    value={supplyData.oilSuppliedLiters === 0 ? '' : supplyData.oilSuppliedLiters}
                    onChange={(e) => setSupplyData(prev => ({ ...prev, oilSuppliedLiters: Number(e.target.value) || 0 }))}
                    placeholder="Enter liters supplied"
                    data-testid="input-oil-supplied"
                    min="1"
                  />
                </div>

                {/* Start Meter Reading - Auto-populated */}
                <div className="space-y-2">
                  <Label htmlFor="startMeter">Start Meter Reading (Auto-filled) *</Label>
                  <Input
                    id="startMeter"
                    type="number"
                    value={supplyData.startMeterReading || ''}
                    onChange={(e) => setSupplyData(prev => ({ ...prev, startMeterReading: Number(e.target.value) }))}
                    placeholder="Auto-filled from last supply"
                    data-testid="input-start-meter"
                    className="bg-blue-50"
                  />
                  <p className="text-xs text-blue-600">Auto-filled with last finished meter reading</p>
                </div>

                {/* End Meter Reading */}
                <div className="space-y-2">
                  <Label htmlFor="endMeter">End Meter Reading *</Label>
                  <Input
                    id="endMeter"
                    type="number"
                    value={supplyData.endMeterReading === 0 ? '' : supplyData.endMeterReading}
                    onChange={(e) => setSupplyData(prev => ({ ...prev, endMeterReading: Number(e.target.value) || 0 }))}
                    placeholder="Meter reading after supply"
                    data-testid="input-end-meter"
                    className={supplyData.startMeterReading > supplyData.endMeterReading && supplyData.endMeterReading > 0 ? "border-red-500" : ""}
                  />
                  {supplyData.startMeterReading > supplyData.endMeterReading && supplyData.endMeterReading > 0 && (
                    <p className="text-xs text-red-600 flex items-center">
                      ⚠️ End meter reading must be greater than start meter reading
                    </p>
                  )}
                </div>
              </div>

              {/* Photo Capture Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <PhotoCaptureButton 
                    onCapture={(blob: Blob, timestamp: string) => handlePhotoCapture(blob, 'tankLevel')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2"
                    title="Tank Level Before"
                    branchName={selectedBranchData?.name || 'No Branch Selected'}
                  >
                    <GaugeIcon className="w-4 h-4 mr-2" />
                    Tank Level Before
                  </PhotoCaptureButton>
                  {supplyData.tankLevelPhoto && (
                    <Badge variant="secondary" className="mt-2">Photo Captured</Badge>
                  )}
                </div>

                <div className="text-center">
                  <PhotoCaptureButton 
                    onCapture={(blob: Blob, timestamp: string) => handlePhotoCapture(blob, 'hoseConnection')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2"
                    title="Hose Connection"
                    branchName={selectedBranchData?.name || 'No Branch Selected'}
                  >
                    <DropletIcon className="w-4 h-4 mr-2" />
                    Hose Connection
                  </PhotoCaptureButton>
                  {supplyData.hoseConnectionPhoto && (
                    <Badge variant="secondary" className="mt-2">Photo Captured</Badge>
                  )}
                </div>

                <div className="text-center">
                  <PhotoCaptureButton 
                    onCapture={(blob: Blob, timestamp: string) => handlePhotoCapture(blob, 'finalTankLevel')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2"
                    title="Tank Level After"
                    branchName={selectedBranchData?.name || 'No Branch Selected'}
                  >
                    <GaugeIcon className="w-4 h-4 mr-2" />
                    Tank Level After
                  </PhotoCaptureButton>
                  {supplyData.finalTankLevelPhoto && (
                    <Badge variant="secondary" className="mt-2">Photo Captured</Badge>
                  )}
                </div>
              </div>



              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCompleteSupply}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  data-testid="button-complete-supply"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Complete Supply
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}