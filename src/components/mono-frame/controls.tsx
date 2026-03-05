'use client';

import {
  Palette,
  ScanLine,
  Square,
  Maximize2,
  RectangleHorizontal,
  Download,
  UploadCloud,
  RefreshCcw,
  Check,
  Loader2,
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
  borderWeight: number;
  setBorderWeight: (weight: number) => void;
  borderOpacity: number;
  setBorderOpacity: (opacity: number) => void;
  borderColor: string;
  setBorderColor: (color: string) => void;
  handleExport: () => void;
  isImageUploaded: boolean;
  isExporting: boolean;
  backgroundInputRef: RefObject<HTMLInputElement | null>;
  onForegroundUpload: () => void;
};

const formatOptions: { name: string; ratio: AspectRatioValue }[] = [
  { name: '9:16', ratio: '9 / 16' },
  { name: '16:9', ratio: '16 / 9' },
  { name: '3:4', ratio: '3 / 4' },
  { name: '1:1', ratio: '1 / 1' },
];

const borderColors = [
  '#FFFFFF', '#000000'
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
  borderWeight,
  setBorderWeight,
  borderOpacity,
  setBorderOpacity,
  borderColor,
  setBorderColor,
  handleExport,
  isImageUploaded,
  isExporting,
  backgroundInputRef,
  onForegroundUpload,
}: ControlsProps) {
  const mainControls = [
    { name: 'Background', icon: Palette },
    { name: 'Radius', icon: ScanLine },
    { name: 'Scale', icon: Maximize2 },
    { name: 'Format', icon: RectangleHorizontal },
    { name: 'Border', icon: Square },
    { name: 'Export', icon: Download, action: handleExport },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] rounded-t-3xl">
      <div className="container mx-auto px-0 max-w-md">
        {isImageUploaded && activeControl && (
          <div className="h-32 py-3 px-4 flex flex-col justify-center">
            {activeControl === 'Background' && (
              <div className="w-full h-full flex items-center">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-3 py-2">
                    {/* Replace image button */}
                    <Button
                      variant="outline"
                      className="w-20 h-20 flex-shrink-0 rounded-2xl border-dashed border-2 flex flex-col gap-1 text-[11px]"
                      onClick={onForegroundUpload}
                    >
                      <RefreshCcw className="w-5 h-5" />
                      Replace
                    </Button>

                    {/* Separator */}
                    <div className="w-[1px] h-12 bg-border self-center mx-1 flex-shrink-0" />

                    {/* Upload custom background button */}
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
              <div className="w-full h-full flex items-center justify-center px-2">
                <div className="flex items-center gap-4 w-full">
                  <span className="text-sm font-semibold text-gray-800 w-16">Radius</span>
                  <Slider
                    className="flex-1"
                    value={[radius]}
                    onValueChange={([v]) => setRadius(v)}
                    min={0}
                    max={200}
                    step={1}
                  />
                  <span className="text-sm font-medium text-gray-500 w-12 text-right">{radius}px</span>
                </div>
              </div>
            )}
            {activeControl === 'Scale' && (
              <div className="w-full h-full flex items-center justify-center px-2">
                <div className="flex items-center gap-4 w-full">
                  <span className="text-sm font-semibold text-gray-800 w-16">Scale</span>
                  <Slider
                    className="flex-1"
                    value={[scale]}
                    onValueChange={([v]) => setScale(v)}
                    min={0.5}
                    max={3}
                    step={0.1}
                  />
                  <span className="text-sm font-medium text-gray-500 w-12 text-right">{scale}x</span>
                </div>
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
            {activeControl === 'Border' && (
              <div className="w-full h-full flex flex-col justify-center gap-4 px-2">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-semibold text-gray-800 w-16">Opacity</span>
                    <Slider
                      className="flex-1"
                      value={[borderOpacity]}
                      onValueChange={([v]) => setBorderOpacity(v)}
                      min={0}
                      max={100}
                      step={1}
                    />
                    <span className="text-[13px] font-medium text-gray-500 w-10 text-right">{borderOpacity}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-semibold text-gray-800 w-16">Weight</span>
                    <Slider
                      className="flex-1"
                      value={[borderWeight]}
                      onValueChange={([v]) => setBorderWeight(v)}
                      min={0}
                      max={40}
                      step={1}
                    />
                    <span className="text-[13px] font-medium text-gray-500 w-10 text-right">{borderWeight}px</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center pt-2">
                  {borderColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBorderColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Border color ${color}`}
                    >
                      {borderColor === color && (
                        <Check
                          className={cn(
                            "w-5 h-5",
                            color === '#FFFFFF' ? "text-black" : "text-white"
                          )}
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            'flex items-center py-2 px-2 overflow-x-auto no-scrollbar',
            activeControl && 'border-t border-border'
          )}
        >
          {mainControls.map((control) => (
            <Button
              key={control.name}
              variant="ghost"
              className={cn(
                'flex flex-col items-center justify-center h-auto gap-1 rounded-xl py-3 px-2 min-w-[80px] flex-shrink-0',
                activeControl === control.name
                  ? 'text-primary bg-gray-50'
                  : isImageUploaded
                    ? 'text-gray-600'
                    : 'text-gray-300',
                'disabled:text-gray-300 disabled:opacity-100'
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
              disabled={(!isImageUploaded && control.name !== 'Export') || isExporting}
            >
              {control.name === 'Export' && isExporting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <control.icon className="w-5 h-5" />
              )}
              <span className="text-[11px] font-medium">
                {control.name === 'Export' && isExporting ? 'Saving...' : control.name}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}