'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageUp } from 'lucide-react';
import type { AspectRatio } from './main-editor';

type CanvasAreaProps = {
  canvasRef: RefObject<HTMLDivElement>;
  foregroundImage: string | null;
  backgroundImage: string | null;
  aspectRatio: AspectRatio;
  scale: number;
  borderRadius: number;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  isCentered: boolean;
};

export function CanvasArea({
  canvasRef,
  foregroundImage,
  backgroundImage,
  aspectRatio,
  scale,
  borderRadius,
  position,
  onPositionChange,
  isCentered,
}: CanvasAreaProps) {
  const foregroundRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !foregroundRef.current) return;
      onPositionChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!foregroundRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    
    let currentX = position.x;
    let currentY = position.y;

    if (isCentered) {
        const rect = foregroundRef.current.getBoundingClientRect();
        const parentRect = foregroundRef.current.parentElement!.getBoundingClientRect();
        currentX = rect.left - parentRect.left;
        currentY = rect.top - parentRect.top;
    }

    setDragStart({
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-muted/40 h-full overflow-auto">
      <div
        ref={canvasRef}
        className="relative w-full max-w-full max-h-full bg-card shadow-lg overflow-hidden transition-all duration-300"
        style={{ aspectRatio }}
      >
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-secondary"></div>
        )}

        {foregroundImage ? (
          <div
            ref={foregroundRef}
            onMouseDown={handleMouseDown}
            className={cn(
              'absolute cursor-grab active:cursor-grabbing transition-transform duration-200',
              isCentered && 'left-1/2 top-1/2'
            )}
            style={{
              transform: isCentered ? `translate(-50%, -50%) scale(${scale})` : `scale(${scale})`,
              left: isCentered ? '50%' : `${position.x}px`,
              top: isCentered ? '50%' : `${position.y}px`,
              touchAction: 'none'
            }}
          >
            <Image
              src={foregroundImage}
              alt="Foreground"
              width={500}
              height={500}
              className="object-contain pointer-events-none transition-all duration-200"
              style={{
                borderRadius: `${borderRadius}px`,
                maxWidth: '80vw',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
              }}
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <ImageUp className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Upload an Image</h3>
            <p>Start by uploading your main image using the panel on the left.</p>
          </div>
        )}
      </div>
    </div>
  );
}
