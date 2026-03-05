'use client';

import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { Canvas } from './canvas';
import { Controls } from './controls';
import { backgroundOptions } from '@/lib/backgrounds';
import { Loader2 } from 'lucide-react';

type AspectRatio = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

export function Editor() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const foregroundInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [foregroundType, setForegroundType] = useState<'image' | 'video' | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(backgroundOptions[0]?.value || '#FFFFFF');
  const [radius, setRadius] = useState(32);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9 / 16');
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [borderWeight, setBorderWeight] = useState(0);
  const [borderOpacity, setBorderOpacity] = useState(100);
  const [borderColor, setBorderColor] = useState('#FFFFFF');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'foreground' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'foreground') {
          setForegroundImage(result);
          setForegroundType(isVideo ? 'video' : 'image');
        } else {
          setBackgroundImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async () => {
    if (!canvasRef.current) {
      toast({ variant: 'destructive', title: 'Error', description: 'Canvas not found.' });
      return;
    }

    if (isExporting) return;

    try {
      if (foregroundType === 'video' && foregroundImage) {
        setIsExporting(true);
        toast({ title: 'Rendering Video', description: 'Please wait, exporting in real-time...' });
        let isRunning = true;

        try {
          const container = canvasRef.current;
          const videoEl = container.querySelector('video');
          if (!videoEl) throw new Error('Video element missing');

          const pr = 1.5; // Slightly lower pixel ratio for smoother rendering
          const rect = container.getBoundingClientRect();

          const canvas = document.createElement('canvas');
          canvas.width = rect.width * pr;
          canvas.height = rect.height * pr;
          const ctx = canvas.getContext('2d')!;

          // Pre-load background image if any
          let bgImg: HTMLImageElement | null = null;
          if (backgroundImage && (backgroundImage.startsWith('http') || backgroundImage.startsWith('data:') || backgroundImage.startsWith('/'))) {
            bgImg = new Image();
            bgImg.crossOrigin = 'anonymous';
            bgImg.src = backgroundImage;
            await new Promise((r) => { bgImg!.onload = r as any; bgImg!.onerror = r as any; });
          }

          const stream = canvas.captureStream(30);

          // Try to capture audio from the video
          try {
            const vStream = (videoEl as any).captureStream ? (videoEl as any).captureStream() : (videoEl as any).mozCaptureStream ? (videoEl as any).mozCaptureStream() : null;
            if (vStream && vStream.getAudioTracks().length > 0) {
              stream.addTrack(vStream.getAudioTracks()[0]);
            }
          } catch (e) { console.warn('Audio capture not supported', e) }

          let mimeType = 'video/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp9';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = 'video/webm';
            }
          }

          const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
          const chunks: Blob[] = [];
          recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

          await new Promise<void>((resolve, reject) => {
            let rafId: number;

            recorder.onstop = () => {
              const blob = new Blob(chunks, { type: mimeType });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `monoframe-export.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
              a.click();
              URL.revokeObjectURL(url);
              resolve();
            };

            recorder.onerror = e => reject(e);

            const draw = () => {
              if (!isRunning) return;

              if (videoEl.duration) {
                const progress = Math.min(100, Math.floor((videoEl.currentTime / videoEl.duration) * 100));
                setExportProgress(progress);
              }

              ctx.clearRect(0, 0, canvas.width, canvas.height);

              // Draw Background
              if (bgImg) {
                const aspect = canvas.width / canvas.height;
                const imgAspect = bgImg.width / bgImg.height;
                let dx = 0, dy = 0, dw = canvas.width, dh = canvas.height;
                if (aspect > imgAspect) {
                  dh = canvas.width / imgAspect;
                  dy = (canvas.height - dh) / 2;
                } else {
                  dw = canvas.height * imgAspect;
                  dx = (canvas.width - dw) / 2;
                }
                ctx.drawImage(bgImg, dx, dy, dw, dh);
              } else {
                ctx.fillStyle = backgroundImage || '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }

              // Draw video with scale, border radius and border
              const vRect = videoEl.getBoundingClientRect();
              const vx = (vRect.left - rect.left) * pr;
              const vy = (vRect.top - rect.top) * pr;
              const vw = vRect.width * pr;
              const vh = vRect.height * pr;
              const rb = radius * pr;

              if (vw > 0 && vh > 0) {
                ctx.save();

                // Draw border
                if (borderWeight > 0) {
                  const w = borderWeight * pr;
                  const r = parseInt(borderColor.slice(1, 3), 16);
                  const g = parseInt(borderColor.slice(3, 5), 16);
                  const b = parseInt(borderColor.slice(5, 7), 16);
                  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${borderOpacity / 100})`;
                  ctx.beginPath();
                  ctx.roundRect(vx - w, vy - w, vw + w * 2, vh + w * 2, rb + w);
                  ctx.fill();
                }

                // Clip inner bounds
                ctx.beginPath();
                ctx.roundRect(vx, vy, vw, vh, rb);
                ctx.clip();

                // Draw natural video to mimic object-contain
                const nw = videoEl.videoWidth;
                const nh = videoEl.videoHeight;
                if (nw > 0 && nh > 0) {
                  const va = nw / nh;
                  const ba = vw / vh;
                  let dx = vx, dy = vy, dw = vw, dh = vh;
                  if (va > ba) {
                    dh = vw / va;
                    dy = vy + (vh - dh) / 2;
                  } else {
                    dw = vh * va;
                    dx = vx + (vw - dw) / 2;
                  }
                  ctx.drawImage(videoEl, dx, dy, dw, dh);
                }

                ctx.restore();
              }

              rafId = requestAnimationFrame(draw);
            };

            videoEl.pause();
            videoEl.currentTime = 0;
            videoEl.loop = false;

            const onPlay = () => {
              recorder.start();
              draw();
              videoEl.removeEventListener('play', onPlay);
            };

            const onEnded = () => {
              isRunning = false;
              cancelAnimationFrame(rafId);
              recorder.stop();
              videoEl.loop = true;
              videoEl.play();
              videoEl.removeEventListener('ended', onEnded);
            };

            videoEl.addEventListener('play', onPlay);
            videoEl.addEventListener('ended', onEnded);

            setTimeout(() => videoEl.play().catch(reject), 300);
          });

          toast({ title: 'Export Complete!', description: 'Your video has been exported successfully.' });
        } catch (err) {
          console.error('Video recording error:', err);
          throw err;
        } finally {
          isRunning = false;
          setIsExporting(false);
          setTimeout(() => setExportProgress(0), 500); // Reset progress after animation
        }
      } else {
        // For images: use html-to-image to capture the canvas with background and borders
        const dataUrl = await htmlToImage.toPng(canvasRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true,
          skipAutoScale: true,
        });
        const link = document.createElement('a');
        link.download = 'monoframe-export.png';
        link.href = dataUrl;
        link.click();

        toast({ title: 'Exported!', description: 'Image exported as PNG.' });
      }
    } catch (err) {
      console.error('Export error:', err);
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export. Please try again.' });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      <input
        type="file"
        ref={foregroundInputRef}
        onChange={(e) => handleFileChange(e, 'foreground')}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, video/mp4, video/webm, video/quicktime"
      />
      <input
        type="file"
        ref={backgroundInputRef}
        onChange={(e) => handleFileChange(e, 'background')}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-sm">
          <Canvas
            canvasRef={canvasRef}
            foregroundImage={foregroundImage}
            foregroundType={foregroundType}
            backgroundImage={backgroundImage}
            radius={radius}
            aspectRatio={aspectRatio}
            scale={scale}
            borderWeight={borderWeight}
            borderOpacity={borderOpacity}
            borderColor={borderColor}
            onUploadClick={() => foregroundInputRef.current?.click()}
          />
        </div>
      </div>

      <Controls
        activeControl={activeControl}
        setActiveControl={setActiveControl}
        radius={radius}
        setRadius={setRadius}
        scale={scale}
        setScale={setScale}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        setBackgroundImage={setBackgroundImage}
        borderWeight={borderWeight}
        setBorderWeight={setBorderWeight}
        borderOpacity={borderOpacity}
        setBorderOpacity={setBorderOpacity}
        borderColor={borderColor}
        setBorderColor={setBorderColor}
        handleExport={handleExport}
        isImageUploaded={!!foregroundImage}
        isExporting={isExporting}
        backgroundInputRef={backgroundInputRef}
        onForegroundUpload={() => foregroundInputRef.current?.click()}
      />

      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl flex flex-col items-center max-w-[280px] w-full text-center shadow-xl">
            <Loader2 className="w-10 h-10 animate-spin text-zinc-900 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exporting Video</h3>
            <p className="text-sm text-gray-500 mb-4 leading-snug">Please keep this tab open. Rendering in real-time...</p>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-zinc-900 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-xs font-medium text-gray-700 mt-2">{exportProgress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}