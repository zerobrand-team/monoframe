'use client';

import {
  GalleryHorizontal,
  Circle,
  Ratio,
  Download,
  UploadCloud,
  Maximize,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { backgroundOptions } from '@/lib/backgrounds';
import { cn } from '@/lib/utils';
import type { RefObject } from 'react';

type AspectRatioValue = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

type ControlsProps = {
  activeControl: string | null;
  setActiveControl: (control: string | null) => void;
  radius: number;
  setRadius: (radius: number) => void;
  scale: number;
  setScale: (scale: number) => void;
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
  scale,
  setScale,
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
    { name: 'Scale', icon: Maximize },
    { name: 'Format', icon: Ratio },
    { name: 'Export', icon: Download, action: handleExport },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] rounded-t-3xl">
      <div className="container mx-auto px-4 max-w-md">
        {isImageUploaded && activeControl && (
          <div className="h-28 py-2">
            {activeControl === 'Background' && (
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
                    {backgroundOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setBackgroundImage(opt.value)}
                        className="focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl overflow-hidden aspect-square h-20 w-20 flex-shrink-0 relative group"
                      >
                        {opt.type === 'image' ? (
                          <Image
                            src={opt.thumbnail}
                            alt="Background option"
                            fill
                            sizes="80px"
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full transition-transform duration-200 group-hover:scale-105"
                            style={{ background: opt.thumbnail }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
            {activeControl === 'Radius' && (
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
            {activeControl === 'Scale' && (
              <div className="w-full h-full flex items-center justify-center px-4">
                <Slider
                  value={[scale]}
                  onValueChange={([v]) => setScale(v)}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>
            )}
            {activeControl === 'Format' && (
              <div className="w-full h-full flex items-center justify-center gap-2">
                {formatOptions.map((opt) => (
                  <Button
                    key={opt.name}
                    variant={
                      aspectRatio === opt.ratio ? 'default' : 'outline'
                    }
                    onClick={() => setAspectRatio(opt.ratio)}
                    className="rounded-xl px-6 py-5 text-base"
                  >
                    {opt.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
        <div
          className={cn(
            'flex justify-around items-center py-2',
            activeControl && 'border-t border-border'
          )}
        >
          {mainControls.map((control) => (
            <Button
              key={control.name}
              variant="ghost"
              className={cn(
                'flex flex-col items-center h-auto gap-1 text-gray-500 rounded-xl px-4 py-2 disabled:text-gray-300',
                activeControl === control.name && 'text-primary'
              )}
              onClick={() => {
                if (control.action) {
                  control.action();
                } else {
                  setActiveControl(
                    activeControl === control.name ? null : control.name
                  );
                }
              }}
              disabled={!isImageUploaded && control.name !== 'Export'}
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
