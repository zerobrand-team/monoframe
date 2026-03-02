'use client';

import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { Canvas } from './canvas';
import { Controls } from './controls';

type AspectRatio = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

export function Editor() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const foregroundInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [radius, setRadius] = useState(32);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9 / 16');
  const [activeControl, setActiveControl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'foreground' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'foreground') {
          setForegroundImage(result);
          setActiveControl('Background');
        } else {
          setBackgroundImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async () => {
    if (!canvasRef.current) {
      toast({ variant: 'destructive', title: 'Error', description: 'Canvas not found.' });
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, { quality: 1.0, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'monoframe-export.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export image.' });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <input
        type="file"
        ref={foregroundInputRef}
        onChange={(e) => handleFileChange(e, 'foreground')}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <input
        type="file"
        ref={backgroundInputRef}
        onChange={(e) => handleFileChange(e, 'background')}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-sm">
             <Canvas
                canvasRef={canvasRef}
                foregroundImage={foregroundImage}
                backgroundImage={backgroundImage}
                radius={radius}
                aspectRatio={aspectRatio}
                onUploadClick={() => foregroundInputRef.current?.click()}
            />
        </div>
      </div>

      <Controls
        activeControl={activeControl}
        setActiveControl={setActiveControl}
        radius={radius}
        setRadius={setRadius}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        setBackgroundImage={setBackgroundImage}
        handleExport={handleExport}
        isImageUploaded={!!foregroundImage}
        backgroundInputRef={backgroundInputRef}
      />
    </div>
  );
}
