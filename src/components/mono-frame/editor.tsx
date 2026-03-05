'use client';

import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { Canvas } from './canvas';
import { Controls } from './controls';
import { backgroundOptions } from '@/lib/backgrounds';

type AspectRatio = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

export function Editor() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const foregroundInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [foregroundType, setForegroundType] = useState<'image' | 'video' | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(backgroundOptions[0]?.value || '#FFFFFF');
  const [radius, setRadius] = useState(32);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9 / 16');
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'foreground' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'foreground') {
          setForegroundImage(result);
          setForegroundType(isVideo ? 'video' : 'image');
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
      const dataUrl = await htmlToImage.toPng(canvasRef.current, { quality: 1.0, pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'monoframe-export.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export image.' });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      <input
        type="file"
        ref={foregroundInputRef}
        onChange={(e) => handleFileChange(e, 'foreground')}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, video/mp4, video/webm, video/quicktime"
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
            foregroundType={foregroundType}
            backgroundImage={backgroundImage}
            radius={radius}
            aspectRatio={aspectRatio}
            scale={scale}
            onUploadClick={() => foregroundInputRef.current?.click()}
          />
        </div>
      </div>

      <Controls
        activeControl={activeControl}
        setActiveControl={setActiveControl}
        radius={radius}
        setRadius={setRadius}
        scale={scale}
        setScale={setScale}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        setBackgroundImage={setBackgroundImage}
        handleExport={handleExport}
        isImageUploaded={!!foregroundImage}
        backgroundInputRef={backgroundInputRef}
        onForegroundUpload={() => foregroundInputRef.current?.click()}
      />
    </div>
  );
}