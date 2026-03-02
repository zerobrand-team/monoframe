'use client';

import {
  GalleryHorizontal,
  Circle,
  AspectRatio,
  Download,
  UploadCloud,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import type { RefObject } from 'react';

type AspectRatioValue = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

type ControlsProps = {
  activeControl: string | null;
  setActiveControl: (control: string | null) => void;
  radius: number;
  setRadius: (radius: number) => void;
  aspectRatio: AspectRatioValue;
  setAspectRatio: (ratio: AspectRatioValue) => void;
  setBackgroundImage: (url: string) => void;
  handleExport: () => void;
  isImageUploaded: boolean;
  backgroundInputRef: RefObject<HTMLInputElement>;
};

const formatOptions: { name: string; ratio: AspectRatioValue }[] = [
    { name: '9:16', ratio: '9 / 16' },
    { name: '16:9', ratio: '16 / 9' },
    { name: '3:4', ratio: '3 / 4' },
    { name: '1:1', ratio: '1 / 1' },
];

export function Controls({
  activeControl,
  setActiveControl,
  radius,
  setRadius,
  aspectRatio,
  setAspectRatio,
  setBackgroundImage,
  handleExport,
  isImageUploaded,
  backgroundInputRef,
}: ControlsProps) {
  const mainControls = [
    { name: 'Background', icon: GalleryHorizontal },
    { name: 'Radius', icon: Circle },
    { name: 'Format', icon: AspectRatio },
    { name: 'Export', icon: Download, action: handleExport },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] rounded-t-3xl">
      <div className="container mx-auto px-4 max-w-md">
        <div className="h-28 py-2">
            {isImageUploaded && activeControl === 'Background' && (
              <div className="w-full h-full flex items-center">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-3 py-2">
                     <Button
                      variant="outline"
                      className="w-20 h-20 flex-shrink-0 rounded-2xl"
                      onClick={() => backgroundInputRef.current?.click()}
                    >
                      <UploadCloud className="w-6 h-6" />
                    </Button>
                    {PlaceHolderImages.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setBackgroundImage(img.imageUrl)}
                        className="focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl overflow-hidden aspect-square h-20 w-20 flex-shrink-0 relative group"
                      >
                        <Image
                          src={img.imageUrl}
                          alt={img.description}
                          fill
                          sizes="10vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
             {isImageUploaded && activeControl === 'Radius' && (
                <div className="w-full h-full flex items-center justify-center px-4">
                    <Slider
                        value={[radius]}
                        onValueChange={([v]) => setRadius(v)}
                        min={0}
                        max={200}
                        step={1}
                    />
                </div>
            )}
            {isImageUploaded && activeControl === 'Format' && (
                 <div className="w-full h-full flex items-center justify-center gap-2">
                    {formatOptions.map(opt => (
                         <Button
                            key={opt.name}
                            variant={aspectRatio === opt.ratio ? 'primary' : 'outline'}
                            onClick={() => setAspectRatio(opt.ratio)}
                            className="rounded-xl px-6 py-5 text-base"
                        >
                            {opt.name}
                        </Button>
                    ))}
                </div>
            )}
        </div>
        <div className="flex justify-around items-center border-t border-border py-2">
          {mainControls.map((control) => (
            <Button
              key={control.name}
              variant="ghost"
              className={cn(
                "flex flex-col items-center h-auto gap-1 text-gray-500 rounded-xl px-4 py-2",
                activeControl === control.name && 'text-primary'
              )}
              onClick={() => control.action ? control.action() : setActiveControl(activeControl === control.name ? null : control.name)}
              disabled={!isImageUploaded && control.name !== 'Background'}
            >
              <control.icon className="w-6 h-6" />
              <span className="text-xs">{control.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
