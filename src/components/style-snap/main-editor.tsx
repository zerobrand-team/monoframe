'use client';

import { useRef, useState, useCallback, type RefObject } from 'react';
import * as htmlToImage from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import type { AiStyleSuggestionOutput } from '@/ai/flows/ai-style-suggestion-flow';
import { AppHeader } from './header';
import { ControlsSidebar } from './controls-sidebar';
import { CanvasArea } from './canvas-area';
import { AiSuggestionDialog } from './ai-suggestion-dialog';

export type AspectRatio = '9 / 16' | '16 / 9' | '1 / 1' | '4 / 5';

export function MainEditor() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const foregroundInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [foregroundImageName, setForegroundImageName] = useState<string>('your-image');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9 / 16');
  const [scale, setScale] = useState(1);
  const [borderRadius, setBorderRadius] = useState(16);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isCentered, setIsCentered] = useState(true);

  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiStyleSuggestionOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'foreground' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'foreground') {
          setForegroundImage(result);
          setForegroundImageName(file.name.split('.')[0]);
          handleCenter();
        } else {
          setBackgroundImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (type: 'foreground' | 'background') => {
    if (type === 'foreground') {
      setForegroundImage(null);
      if (foregroundInputRef.current) foregroundInputRef.current.value = '';
    } else {
      setBackgroundImage(null);
      if (backgroundInputRef.current) backgroundInputRef.current.value = '';
    }
  };

  const handleCenter = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsCentered(true);
  }, []);

  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setPosition(newPosition);
    setIsCentered(false);
  };
  
  const handleExport = async (format: 'png' | 'jpeg') => {
    if (!canvasRef.current) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Canvas element not found.',
      });
      return;
    }

    try {
      let dataUrl;
      const options = { quality: 0.95, cacheBust: true };
      const filename = `${foregroundImageName}-styled.${format}`;

      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(canvasRef.current, options);
      } else {
        dataUrl = await htmlToImage.toJpeg(canvasRef.current, options);
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Could not export the image. Please try again.',
      });
      console.error('oops, something went wrong!', err);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <ControlsSidebar
            foregroundInputRef={foregroundInputRef}
            backgroundInputRef={backgroundInputRef}
            handleFileChange={handleFileChange}
            clearImage={clearImage}
            hasForeground={!!foregroundImage}
            hasBackground={!!backgroundImage}
            setBackgroundImage={setBackgroundImage}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            scale={scale}
            setScale={setScale}
            borderRadius={borderRadius}
            setBorderRadius={setBorderRadius}
            handleCenter={handleCenter}
            handleExport={handleExport}
            openAiDialog={() => setIsAiDialogOpen(true)}
          />
          <SidebarInset>
            <CanvasArea
              canvasRef={canvasRef as RefObject<HTMLDivElement>}
              foregroundImage={foregroundImage}
              backgroundImage={backgroundImage}
              aspectRatio={aspectRatio}
              scale={scale}
              borderRadius={borderRadius}
              position={position}
              onPositionChange={handlePositionChange}
              isCentered={isCentered}
            />
          </SidebarInset>
        </div>
      </div>
      {foregroundImage && (
        <AiSuggestionDialog
          isOpen={isAiDialogOpen}
          setIsOpen={setIsAiDialogOpen}
          foregroundImage={foregroundImage}
          suggestions={aiSuggestions}
          setSuggestions={setAiSuggestions}
          isLoading={isLoadingAi}
          setIsLoading={setIsLoading}
        />
      )}
    </SidebarProvider>
  );
}
