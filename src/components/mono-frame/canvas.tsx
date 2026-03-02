'use client';

import Image from 'next/image';
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
  onUploadClick: () => void;
};

export function Canvas({
  canvasRef,
  foregroundImage,
  backgroundImage,
  radius,
  aspectRatio,
  onUploadClick,
}: CanvasProps) {
  return (
    <div
      ref={canvasRef}
      className="relative shadow-lg overflow-hidden transition-all duration-300 bg-white"
      style={{ aspectRatio }}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      )}
      {foregroundImage ? (
        <div
          className="absolute inset-0 flex items-center justify-center p-4"
        >
          <div className="relative w-full h-full">
            <Image
              src={foregroundImage}
              alt="Foreground"
              fill
              className="object-contain"
              style={{
                borderRadius: `${radius}px`,
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
