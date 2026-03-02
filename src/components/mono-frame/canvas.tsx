'use client';

import type { RefObject } from 'react';
// Добавил импорт иконки Upload для кнопки
import { UploadCloud, Upload } from 'lucide-react'; 
import { Button } from '@/components/ui/button';

type AspectRatio = '9 / 16' | '16 / 9' | '3 / 4' | '1 / 1';

type CanvasProps = {
  canvasRef: RefObject<HTMLDivElement | null>;
  foregroundImage: string | null;
  backgroundImage: string | null;
  radius: number;
  aspectRatio: AspectRatio;
  scale: number;
  onUploadClick: () => void;
};

export function Canvas({
  canvasRef,
  foregroundImage,
  backgroundImage,
  radius,
  aspectRatio,
  scale,
  onUploadClick,
}: CanvasProps) {
  // Добавили проверку на '/' для локальных картинок
  const isUrl = backgroundImage?.startsWith('http') || backgroundImage?.startsWith('data:') || backgroundImage?.startsWith('/');

  const backgroundStyle: React.CSSProperties = {
    aspectRatio,
  };

  // Применяем выбранный фон ТОЛЬКО если картинка уже загружена
  if (foregroundImage) {
    if (isUrl) {
      backgroundStyle.backgroundImage = `url(${backgroundImage})`;
      backgroundStyle.backgroundSize = 'cover';
      backgroundStyle.backgroundPosition = 'center';
    } else {
      backgroundStyle.background = backgroundImage || '#FFFFFF';
    }
  } else {
    // Жестко ставим белый фон, пока картинки нет
    backgroundStyle.background = '#FFFFFF';
  }

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
            {/* Изменения здесь:
              1. Убрали div с overflow-hidden
              2. Перенесли border-radius прямо на <img>
              3. Заменили w-full h-full на max-w-full max-h-full
            */}
            <img
              src={foregroundImage}
              alt="Uploaded content"
              className="max-w-full max-h-full transition-all duration-200 shadow-md"
              style={{
                backgroundImage: `url(${foregroundImage})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                borderRadius: `${radius}px`,
              }}
            />
          </div>
         </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-white">
          {/* Убран h-full, добавлен bg-white, padding заменен на py-10 */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-[28px] py-10 px-4 flex flex-col items-center justify-center text-center w-full shadow-sm">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            
            <p className="text-lg font-semibold text-gray-900 mb-5">
              Choose image
            </p>
            
            {/* Темная кнопка с иконкой */}
            <Button 
              onClick={onUploadClick} 
              className="rounded-xl px-8 py-5 bg-zinc-900 text-white hover:bg-zinc-800 font-medium text-base flex items-center gap-2"
            >
              <Upload className="w-[18px] h-[18px]" />
              Browse File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
