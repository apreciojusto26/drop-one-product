import type { ImageMetadata } from 'astro';
import step01 from '@/assets/product/step-01.jpg';
import step02 from '@/assets/product/step-02.jpg';
import step03 from '@/assets/product/step-03.jpg';

/** asset key -> imported ImageMetadata. Every other MediaRef in the data layer sets asset: null. */
export const images: Record<string, ImageMetadata> = {
  'step-01': step01,
  'step-02': step02,
  'step-03': step03,
};
