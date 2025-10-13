import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageCropperProps {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
}

export function ImageCropper({
  imageUrl,
  open,
  onClose,
  onCropComplete,
  aspectRatio = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    setIsCropping(true);
    try {
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropComplete(croppedBlob);
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]" aria-describedby="crop-description">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <p id="crop-description" className="text-sm text-muted-foreground">
            Adjust the crop area and zoom to select the portion of the image you want to use.
          </p>
        </DialogHeader>
        
        <div className="flex-1 relative bg-slate-900 rounded-lg overflow-hidden" style={{ minHeight: "400px" }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Zoom: {zoom.toFixed(1)}x</Label>
            <input
              type="range"
              value={zoom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZoom(Number(e.target.value))}
              min={1}
              max={3}
              step={0.1}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCropping}>
            Cancel
          </Button>
          <Button onClick={createCroppedImage} disabled={isCropping}>
            {isCropping ? "Cropping..." : "Apply Crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg", 0.95);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
