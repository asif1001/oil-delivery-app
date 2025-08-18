import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  getAllComplaints, 
  getAllBranches,
  getAllOilTypes,
  saveTask,
  getAllUsers,
  saveComplaint,
  updateComplaint
} from "@/lib/firebase";
import { 
  CameraIcon, 
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  ClockIcon,
  MessageSquareIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  DropletIcon,
  ImageIcon
} from "lucide-react";
import { Link } from "wouter";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'equipment' | 'delivery' | 'safety' | 'customer' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reportedBy: string;
  reporterName: string;
  assignedTo?: string;
  branchId?: string;
  branchName?: string;
  oilTypeId?: string;
  oilTypeName?: string;
  photos: string[];
  watermarkedPhotos: string[];
  createdAt: Date;
  updatedAt: Date;
  resolution?: string;
  resolvedAt?: Date;
  taskId?: string; // Link to task manager
}

interface CreateComplaint {
  title: string;
  description: string;
  category: 'equipment' | 'delivery' | 'safety' | 'customer' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  branchId?: string;
  oilTypeId?: string;
  photos: string[];
}

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [oilTypes, setOilTypes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { userData } = useAuth();

  const [formData, setFormData] = useState<CreateComplaint>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    branchId: '',
    oilTypeId: '',
    photos: []
  });

  const [resolution, setResolution] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [complaintsData, branchesData, oilTypesData, usersData] = await Promise.all([
        getAllComplaints(),
        getAllBranches(),
        getAllOilTypes(),
        getAllUsers()
      ]);
      
      setComplaints(complaintsData as Complaint[]);
      setBranches(branchesData);
      setOilTypes(oilTypesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load complaint data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        variant: "destructive"
      });
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        // Draw video frame
        context.drawImage(video, 0, 0);
        
        // Add watermark
        addWatermark(context, canvas.width, canvas.height);
        
        // Convert to base64
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        setCapturedPhotos(prev => [...prev, photoDataUrl]);
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, photoDataUrl]
        }));
        
        toast({
          title: "Photo Captured",
          description: "Photo captured with watermark successfully"
        });
      }
    }
  };

  const addWatermark = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const now = new Date();
    const timestamp = now.toLocaleString();
    const location = "OILDELIVERY SYSTEM";
    const reportedBy = userData?.displayName || userData?.email || "Unknown User";
    
    // Semi-transparent background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(10, height - 120, width - 20, 100);
    
    // White text
    context.fillStyle = 'white';
    context.font = 'bold 16px Arial';
    
    // Add text lines
    context.fillText(`Complaint Evidence`, 20, height - 90);
    context.fillText(`Time: ${timestamp}`, 20, height - 70);
    context.fillText(`Reporter: ${reportedBy}`, 20, height - 50);
    context.fillText(`System: ${location}`, 20, height - 30);
    
    // Add border
    context.strokeStyle = 'red';
    context.lineWidth = 3;
    context.strokeRect(5, 5, width - 10, height - 10);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const handleSubmitComplaint = async () => {
    try {
      if (!formData.title || !formData.description) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const complaintData = {
        ...formData,
        reportedBy: userData?.uid || '',
        reporterName: userData?.displayName || userData?.email || 'Unknown',
        status: 'open' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        watermarkedPhotos: capturedPhotos,
        branchName: branches.find(b => b.id === formData.branchId)?.name || '',
        oilTypeName: oilTypes.find(ot => ot.id === formData.oilTypeId)?.name || ''
      };

      // Create complaint in Firebase
      const savedComplaint = await saveComplaint(complaintData);

      // Create associated task in task manager
      const taskData = {
        title: `Complaint: ${formData.title}`,
        description: `Priority: ${formData.priority.toUpperCase()} - ${formData.description}`,
        priority: formData.priority,
        dueDate: new Date(Date.now() + (formData.priority === 'critical' ? 2 : formData.priority === 'high' ? 4 : 7) * 24 * 60 * 60 * 1000),
        assignedTo: '', // Can be assigned later
        status: 'pending' as const
      };

      await saveTask(taskData);

      toast({
        title: "Complaint Submitted",
        description: "Complaint has been submitted and added to task manager"
      });

      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: "Failed to submit complaint",
        variant: "destructive"
      });
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    try {
      if (!resolution) {
        toast({
          title: "Validation Error",
          description: "Please provide resolution details",
          variant: "destructive"
        });
        return;
      }

      // Update complaint status
      await updateComplaint(complaintId, {
        status: 'resolved',
        resolution: resolution,
        resolvedAt: new Date(),
        updatedAt: new Date()
      });

      toast({
        title: "Complaint Resolved",
        description: "Complaint has been marked as resolved"
      });

      setShowComplaintModal(false);
      setResolution('');
      loadData();
    } catch (error) {
      console.error('Error resolving complaint:', error);
      toast({
        title: "Error",
        description: "Failed to resolve complaint",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      branchId: '',
      oilTypeId: '',
      photos: []
    });
    setCapturedPhotos([]);
    stopCamera();
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (activeTab === "all") return true;
    return complaint.status === activeTab;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading complaint data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Complaint Management</h1>
            <p className="text-gray-600">Track and resolve complaints with photo evidence</p>
          </div>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateModal(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Report Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report New Complaint</DialogTitle>
              <DialogDescription>
                Submit a complaint with photo evidence and watermarks
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Complaint Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the complaint"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Branch (Optional)</Label>
                    <Select value={formData.branchId} onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Oil Type (Optional)</Label>
                    <Select value={formData.oilTypeId} onValueChange={(value) => setFormData(prev => ({ ...prev, oilTypeId: value }))}>
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
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitComplaint}>
                    Submit Complaint
                  </Button>
                </div>
              </div>

              {/* Camera Section */}
              <div className="space-y-4">
                <div>
                  <Label>Photo Evidence</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {!isCapturing ? (
                      <div className="text-center">
                        <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <Button onClick={startCamera}>
                          Start Camera
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                          Photos will be automatically watermarked with timestamp and user info
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          className="w-full h-48 bg-black rounded"
                          autoPlay
                          playsInline
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div className="flex justify-center space-x-2">
                          <Button onClick={capturePhoto}>
                            <CameraIcon className="h-4 w-4 mr-2" />
                            Capture Photo
                          </Button>
                          <Button variant="outline" onClick={stopCamera}>
                            Stop Camera
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {capturedPhotos.length > 0 && (
                  <div>
                    <Label>Captured Photos ({capturedPhotos.length})</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {capturedPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={photo} 
                            alt={`Captured ${index + 1}`}
                            className="w-full h-24 object-cover rounded border cursor-pointer"
                            onClick={() => {
                              setSelectedPhoto(photo);
                              setShowPhotoModal(true);
                            }}
                          />
                          <Badge className="absolute top-1 right-1 text-xs">
                            Watermarked
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <AlertTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
                <p className="text-gray-500">
                  {activeTab === "all" ? "No complaints have been reported yet" : `No ${activeTab} complaints found`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComplaints.map((complaint) => (
                <Card key={complaint.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Reported by {complaint.reporterName}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {complaint.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {complaint.createdAt.toLocaleDateString()}
                        </div>
                        {complaint.photos.length > 0 && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {complaint.photos.length} photos
                          </div>
                        )}
                      </div>

                      {complaint.branchName && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPinIcon className="h-3 w-3" />
                          {complaint.branchName}
                        </div>
                      )}

                      {complaint.oilTypeName && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <DropletIcon className="h-3 w-3" />
                          {complaint.oilTypeName}
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowComplaintModal(true);
                        }}
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Complaint Details Modal */}
      <Dialog open={showComplaintModal} onOpenChange={setShowComplaintModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl">{selectedComplaint.title}</DialogTitle>
                    <DialogDescription>
                      Complaint #{selectedComplaint.id}
                    </DialogDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityColor(selectedComplaint.priority)}>
                      {selectedComplaint.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedComplaint.status)}>
                      {selectedComplaint.status}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="mt-1">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Category</Label>
                      <p className="mt-1 capitalize">{selectedComplaint.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Reporter</Label>
                      <p className="mt-1">{selectedComplaint.reporterName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Created</Label>
                      <p className="mt-1">{selectedComplaint.createdAt.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                      <p className="mt-1">{selectedComplaint.updatedAt.toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedComplaint.branchName && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Branch</Label>
                      <p className="mt-1">{selectedComplaint.branchName}</p>
                    </div>
                  )}

                  {selectedComplaint.oilTypeName && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Oil Type</Label>
                      <p className="mt-1">{selectedComplaint.oilTypeName}</p>
                    </div>
                  )}

                  {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'closed' && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Resolve Complaint</h4>
                      
                      <div>
                        <Label>Assign To</Label>
                        <Select value={assignedTo} onValueChange={setAssignedTo}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.filter(user => user.role === 'admin' || user.role === 'manager').map(user => (
                              <SelectItem key={user.uid} value={user.uid}>
                                {user.displayName || user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="resolution">Resolution</Label>
                        <Textarea
                          id="resolution"
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          placeholder="Describe how this complaint was resolved"
                          rows={3}
                        />
                      </div>

                      <Button 
                        onClick={() => handleResolveComplaint(selectedComplaint.id)}
                        className="w-full"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    </div>
                  )}

                  {selectedComplaint.resolution && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium text-gray-600">Resolution</Label>
                      <p className="mt-1">{selectedComplaint.resolution}</p>
                      {selectedComplaint.resolvedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Resolved on {selectedComplaint.resolvedAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Photos Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Photo Evidence ({selectedComplaint.watermarkedPhotos?.length || selectedComplaint.photos.length})
                    </Label>
                    {(selectedComplaint.watermarkedPhotos?.length > 0 || selectedComplaint.photos.length > 0) ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {(selectedComplaint.watermarkedPhotos || selectedComplaint.photos).map((photo, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={photo} 
                              alt={`Evidence ${index + 1}`}
                              className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                setSelectedPhoto(photo);
                                setShowPhotoModal(true);
                              }}
                            />
                            {selectedComplaint.watermarkedPhotos && (
                              <Badge className="absolute top-1 right-1 text-xs">
                                Watermarked
                              </Badge>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
                              <EyeIcon className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">No photos attached</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-4xl">
          <div className="flex justify-center">
            <img 
              src={selectedPhoto} 
              alt="Full size evidence"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}