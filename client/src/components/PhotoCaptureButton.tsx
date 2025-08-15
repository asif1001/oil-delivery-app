import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CameraCapture } from './CameraCapture';

interface PhotoCaptureButtonProps {
  onCapture: (imageBlob: Blob, timestamp: string) => void;
  className?: string;
  children: ReactNode;
  title?: string;
  branchName?: string;
}

export function PhotoCaptureButton({ 
  onCapture, 
  className, 
  children, 
  title = "Take Photo",
  branchName
}: PhotoCaptureButtonProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handlePhotoCapture = (imageBlob: Blob, timestamp: string) => {
    onCapture(imageBlob, timestamp);
    setIsCameraOpen(false);
  };

  return (
    <>
      <Button 
        onClick={handleOpenCamera}
        className={className}
        data-testid="button-take-photo"
      >
        {children}
      </Button>

      <CameraCapture
        isOpen={isCameraOpen}
        onClose={handleCloseCamera}
        onCapture={handlePhotoCapture}
        title={title}
        branchName={branchName}
      />
    </>
  );
}