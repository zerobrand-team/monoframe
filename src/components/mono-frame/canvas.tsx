'use client';

import type { RefObject } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AspectRatio = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

type CanvasProps = {
  canvasRef: RefObject<HTMLDivElement>;
  foregroundImage: string | null;
  backgroundImage: string | null;
  radius: number;
  aspectRatio: AspectRatio;
  scale: number;
  onUploadClick: () => void;
};

export function Canvas({
  canvasRef,
  foregroundImage,
  backgroundImage,
  radius,
  aspectRatio,
  scale,
  onUploadClick,
}: CanvasProps) {
  const isUrl = backgroundImage?.startsWith('http') || backgroundImage?.startsWith('data:');

  const backgroundStyle: React.CSSProperties = {
    aspectRatio,
  };

  if (isUrl) {
    backgroundStyle.backgroundImage = `url(${backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  } else {
    backgroundStyle.background = backgroundImage || '#FFFFFF';
  }

  return (
    <div
      ref={canvasRef}
      className="relative shadow-lg overflow-hidden transition-all duration-300"
      style={backgroundStyle}
    >
      {foregroundImage ? (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="relative w-full h-full transition-transform duration-200"
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                borderRadius: `${radius}px`,
                backgroundImage: `url(${foregroundImage})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
          <UploadCloud className="w-16 h-16 mb-4 text-gray-300" />
          <Button onClick={onUploadClick} size="lg" className="rounded-2xl">
            Upload Image
          </Button>
        </div>
      )}
    </div>
  );
}
