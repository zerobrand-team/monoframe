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
  { id: 'grad-1', type: 'gradient', value: 'linear-gradient(45deg, #F9F9F9, #EAEAEA)', thumbnail: 'linear-gradient(45deg, #F9F9F9, #EAEAEA)' },
  { id: 'color-white', type: 'color', value: '#FFFFFF', thumbnail: '#FFFFFF' },
];

export const backgroundOptions: BackgroundOption[] = [
  ...imageOptions,
  ...colorAndGradientOptions,
];
