'use client';

import {
  GalleryHorizontal,
  Circle,
  Ratio,
  Download,
  UploadCloud,
  RefreshCcw, // Заменили Maximize на RefreshCcw
} from 'lucide-react';
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
  backgroundInputRef: RefObject<HTMLInputElement | null>;
  onForegroundUpload: () => void;
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
  onForegroundUpload,
}: ControlsProps) {
  const mainControls = [
    { name: 'Background', icon: GalleryHorizontal },
    { name: 'Radius', icon: Circle },
    { name: 'Scale', icon: RefreshCcw }, // Здесь иконка в меню тоже обновится для соответствия
    { name: 'Format', icon: Ratio },
    { name: 'Export', icon: Download, action: handleExport },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] rounded-t-3xl">
      <div className="container mx-auto px-0 max-w-md"> {/* Убран px-4 для корректного скролла от края до края */}
        {isImageUploaded && activeControl && (
          <div className="h-28 py-2 px-4">
            {activeControl === 'Background' && (
              <div className="w-full h-full flex items-center">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-3 py-2">
                    {/* Кнопка замены картинки с новой иконкой */}
                    <Button
                      variant="outline"
                      className="w-20 h-20 flex-shrink-0 rounded-2xl border-dashed border-2 flex flex-col gap-1 text-[11px]"
                      onClick={onForegroundUpload}
                    >
                      <RefreshCcw className="w-5 h-5" />
                      Replace
                    </Button>

                    {/* Разделитель */}
                    <div className="w-[1px] h-12 bg-border self-center mx-1 flex-shrink-0" />

                    {/* Кнопка загрузки своего фона */}
                    <Button
                      variant="outline"
                      className="w-20 h-20 flex-shrink-0 rounded-2xl flex flex-col gap-1 text-[11px]"
                      onClick={() => backgroundInputRef.current?.click()}
                    >
                      <UploadCloud className="w-5 h-5" />
                      BG
                    </Button>
                    
                    {backgroundOptions.map((opt) => {
                      const style: React.CSSProperties =
                        opt.type === 'image'
                          ? {
                              backgroundImage: `url(${opt.thumbnail})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : {
                              background: opt.thumbnail,
                            };

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setBackgroundImage(opt.value)}
                          className="focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl overflow-hidden aspect-square h-20 w-20 flex-shrink-0 relative group"
                        >
                          <div
                            className="w-full h-full transition-transform duration-200 group-hover:scale-105"
                            style={style}
                          />
                        </button>
                      );
                    })}
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
            'flex overflow-x-auto items-center py-2 px-4 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
            activeControl && 'border-t border-border'
          )}
        >
          {mainControls.map((control) => (
            <Button
              key={control.name}
              variant="ghost"
              className={cn(
                'flex flex-col items-center justify-center h-auto gap-1 text-gray-500 rounded-xl py-3 px-0 disabled:text-gray-300 w-[84px] flex-shrink-0',
                activeControl === control.name && 'text-primary bg-gray-50'
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
              <control.icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{control.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}