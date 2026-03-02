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
  { id: 'color-light-gray', type: 'color', value: '#F9F9F9', thumbnail: '#F9F9F9' },
  { id: 'color-gray', type: 'color', value: '#EAEAEA', thumbnail: '#EAEAEA' },
  { id: 'color-dark-gray', type: 'color', value: '#333333', thumbnail: '#333333' },
  { id: 'color-black', type: 'color', value: '#111111', thumbnail: '#111111' },
  { id: 'grad-1', type: 'gradient', value: 'linear-gradient(45deg, #F9F9F9, #EAEAEA)', thumbnail: 'linear-gradient(45deg, #F9F9F9, #EAEAEA)' },
  { id: 'grad-2', type: 'gradient', value: 'linear-gradient(45deg, #111111, #333333)', thumbnail: 'linear-gradient(45deg, #111111, #333333)' },
];

export const backgroundOptions: BackgroundOption[] = [
  ...imageOptions,
  ...colorAndGradientOptions,
];
