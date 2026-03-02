'use client';

import type { RefObject } from 'react';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  GalleryVerticalEnd,
  Plus,
  RectangleVertical,
  RectangleHorizontal,
  Square,
  Sparkles,
  Download,
  LocateFixed,
  Scaling,
  Radius as RadiusIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AspectRatio } from './main-editor';

type ControlsSidebarProps = {
  foregroundInputRef: RefObject<HTMLInputElement>;
  backgroundInputRef: RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'foreground' | 'background') => void;
  clearImage: (type: 'foreground' | 'background') => void;
  hasForeground: boolean;
  hasBackground: boolean;
  setBackgroundImage: (url: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  scale: number;
  setScale: (scale: number) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  handleCenter: () => void;
  handleExport: (format: 'png' | 'jpeg') => void;
  openAiDialog: () => void;
};

const aspectRatios: { name: string; ratio: AspectRatio; icon: React.ElementType }[] = [
  { name: 'Reels', ratio: '9 / 16', icon: RectangleVertical },
  { name: 'YouTube', ratio: '16 / 9', icon: RectangleHorizontal },
  { name: 'Square', ratio: '1 / 1', icon: Square },
];

export function ControlsSidebar({
  foregroundInputRef,
  backgroundInputRef,
  handleFileChange,
  clearImage,
  hasForeground,
  hasBackground,
  setBackgroundImage,
  aspectRatio,
  setAspectRatio,
  scale,
  setScale,
  borderRadius,
  setBorderRadius,
  handleCenter,
  handleExport,
  openAiDialog,
}: ControlsSidebarProps) {

  return (
    <Sidebar>
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

      <SidebarHeader>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => foregroundInputRef.current?.click()} size="lg" className="h-12">
                <Upload />
                <span>Upload Image</span>
              </SidebarMenuButton>
              {hasForeground && (
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => clearImage('foreground')} aria-label="Clear foreground image">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Backgrounds */}
        <SidebarGroup>
          <SidebarGroupLabel className='flex items-center gap-2'>
            <GalleryVerticalEnd />
            <span>Background</span>
          </SidebarGroupLabel>
          <div className="grid grid-cols-3 gap-2 p-2">
            {PlaceHolderImages.map((img) => (
              <button key={img.id} onClick={() => setBackgroundImage(img.imageUrl)} className="focus:outline-none focus:ring-2 focus:ring-ring rounded-md overflow-hidden aspect-square relative group">
                <Image src={img.imageUrl} alt={img.description} fill sizes="10vw" className="object-cover transition-transform group-hover:scale-105" />
              </button>
            ))}
            <Button variant="outline" className="aspect-square h-full w-full" onClick={() => backgroundInputRef.current?.click()} aria-label="Upload custom background">
              <Plus />
            </Button>
          </div>
           {hasBackground && (
              <Button variant="ghost" size="sm" className="w-full mt-1" onClick={() => clearImage('background')}>
                <Trash2 className="mr-2" /> Clear Background
              </Button>
            )}
        </SidebarGroup>

        <SidebarSeparator />

        {/* Adjustments */}
        <SidebarGroup className={!hasForeground ? 'opacity-40 pointer-events-none' : ''}>
           <SidebarGroupLabel className='flex items-center gap-2'>
            <RectangleHorizontal />
            <span>Canvas</span>
          </SidebarGroupLabel>
          <div className="p-2 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Aspect Ratio</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {aspectRatios.map(({ name, ratio, icon: Icon }) => (
                  <Button key={ratio} variant={aspectRatio === ratio ? 'default' : 'outline'} onClick={() => setAspectRatio(ratio)}>
                    <Icon className="mr-2" />
                    {name}
                  </Button>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleCenter}>
              <LocateFixed />
              Center Image
            </Button>

            <div className="space-y-2">
              <Label htmlFor="scale-slider" className="flex items-center gap-2 text-xs text-muted-foreground"><Scaling/> Scale</Label>
              <Slider id="scale-slider" value={[scale]} onValueChange={([v]) => setScale(v)} min={0.1} max={3} step={0.01} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="radius-slider" className="flex items-center gap-2 text-xs text-muted-foreground"><RadiusIcon/> Corner Radius</Label>
              <Slider id="radius-slider" value={[borderRadius]} onValueChange={([v]) => setBorderRadius(v)} min={0} max={200} step={1} />
            </div>
          </div>
        </SidebarGroup>

        <SidebarSeparator />

        {/* AI Suggestions */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={openAiDialog} disabled={!hasForeground} className='text-primary hover:text-primary hover:bg-primary/10 data-[active=true]:text-primary data-[active=true]:bg-primary/10'>
                <Sparkles />
                <span>AI Suggestions</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Export */}
        <SidebarGroup>
          <SidebarGroupLabel className='flex items-center gap-2'><Download /> Export</SidebarGroupLabel>
          <div className="grid grid-cols-2 gap-2 p-2">
            <Button onClick={() => handleExport('png')} disabled={!hasForeground}>Export PNG</Button>
            <Button onClick={() => handleExport('jpeg')} disabled={!hasForeground}>Export JPG</Button>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
