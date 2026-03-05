'use client';

import type { RefObject } from 'react';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AspectRatio = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

type CanvasProps = {
  canvasRef: RefObject<HTMLDivElement | null>;
  foregroundImage: string | null;
  foregroundType: 'image' | 'video' | null;
  backgroundImage: string | null;
  radius: number;
  aspectRatio: AspectRatio;
  scale: number;
  borderWeight: number;
  borderOpacity: number;
  borderColor: string;
  onUploadClick: () => void;
};

export function Canvas({
  canvasRef,
  foregroundImage,
  foregroundType,
  backgroundImage,
  radius,
  aspectRatio,
  scale,
  borderWeight,
  borderOpacity,
  borderColor,
  onUploadClick,
}: CanvasProps) {
  const isUrl = backgroundImage?.startsWith('http') || backgroundImage?.startsWith('data:') || backgroundImage?.startsWith('/');

  const backgroundStyle: React.CSSProperties = {
    aspectRatio,
  };

  if (foregroundImage) {
    if (isUrl) {
      backgroundStyle.backgroundImage = `url(${backgroundImage})`;
      backgroundStyle.backgroundSize = 'cover';
      backgroundStyle.backgroundPosition = 'center';
    } else {
      backgroundStyle.background = backgroundImage || '#FFFFFF';
    }
  } else {
    backgroundStyle.background = '#FFFFFF';
  }

  // Convert hex to rgba for border opacity
  const getBorderColorWithOpacity = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const contentStyle: React.CSSProperties = {
    borderRadius: `${radius}px`,
    border: borderWeight > 0 ? `${borderWeight}px solid ${getBorderColorWithOpacity(borderColor, borderOpacity)}` : 'none',
  };

  return (
    <div
      ref={canvasRef}
      className="relative overflow-hidden transition-all duration-300"
      style={backgroundStyle}
    >
      {foregroundImage ? (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="relative flex items-center justify-center w-full h-full transition-transform duration-200"
            style={{
              transform: `scale(${scale})`,
            }}
          >
            {foregroundType === 'video' ? (
              <video
                src={foregroundImage}
                className="max-w-full max-h-full transition-all duration-200 shadow-md object-contain"
                style={contentStyle}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={foregroundImage}
                alt="Uploaded content"
                className="max-w-full max-h-full transition-all duration-200 shadow-md object-contain"
                style={contentStyle}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-white">
          <div className="border-2 border-dashed border-gray-300 rounded-[28px] py-10 px-4 flex flex-col items-center justify-center text-center w-full">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ImagePlus className="w-6 h-6 text-gray-400" />
            </div>

            <div className="space-y-0.5 mb-5">
              <p className="text-lg font-semibold text-gray-800 leading-tight">
                Add background to your
              </p>
              <p className="text-lg font-semibold text-gray-800 leading-tight">
                image or video
              </p>
            </div>

            <Button
              onClick={onUploadClick}
              className="rounded-xl px-8 py-5 bg-zinc-900 text-white hover:bg-zinc-800 font-medium text-base flex items-center gap-2"
            >
              <ImagePlus className="w-[18px] h-[18px]" />
              Browse File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
