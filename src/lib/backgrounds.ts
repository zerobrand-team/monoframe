import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

export type BackgroundOption = {
  id: string;
  type: 'image' | 'color' | 'gradient';
  value: string;
  thumbnail: string;
};

const imageOptions: BackgroundOption[] = PlaceHolderImages.map((img: ImagePlaceholder) => ({
  id: img.id,
  type: 'image',
  value: img.imageUrl,
  thumbnail: img.imageUrl,
}));

const colorAndGradientOptions: BackgroundOption[] = [
  { id: 'color-white', type: 'color', value: '#FFFFFF', thumbnail: '#FFFFFF' },
  { id: 'color-lightgray', type: 'color', value: '#f3f4f6', thumbnail: '#f3f4f6' },
  { id: 'color-gray', type: 'color', value: '#9ca3af', thumbnail: '#9ca3af' },
  { id: 'color-black', type: 'color', value: '#000000', thumbnail: '#000000' },
];

export const backgroundOptions: BackgroundOption[] = [
  ...imageOptions,
  ...colorAndGradientOptions,
];
