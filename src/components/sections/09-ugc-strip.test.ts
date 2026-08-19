import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const galleryDirectory = resolve(process.cwd(), 'public/img/Galeria');
const galleryFiles = [
  'Hands_holding_starry_box_2K_202608190126.jpeg',
  'Projecting_design_onto_child_room_202608190141.jpeg',
  'Removing_hand_from_product_image_202608190134.jpeg',
  'Requesting_realistic_images_with…_2K_202608190137.jpeg',
] as const;

describe('UGC marquee image budget', () => {
  it('covers every JPEG shipped by the gallery directory', () => {
    const shippedJpegs = readdirSync(galleryDirectory)
      .filter((file) => file.endsWith('.jpeg'))
      .sort();

    expect(shippedJpegs).toEqual([...galleryFiles].sort());
  });

  it.each(galleryFiles)('%s stays within the storefront image budget', async (file) => {
    const imagePath = resolve(galleryDirectory, file);
    const metadata = await sharp(imagePath).metadata();

    expect(statSync(imagePath).size).toBeLessThanOrEqual(300_000);
    expect(metadata.width).toBeLessThanOrEqual(768);
    expect(metadata.height).toBeLessThanOrEqual(1_376);
  });
});
