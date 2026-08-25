import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { product } from '@/data/product';

/**
 * The marquee renders every photo TWICE per track and the track twice again,
 * so one oversized file is paid for four times over. This guards the assets
 * the strip actually ships — it used to guard public/img/Galeria, which the
 * strip stopped reading once it moved to astro:assets.
 */
const assetDirectory = resolve(process.cwd(), 'src/assets/product');
const MAX_BYTES = 300_000;
const MAX_LONG_EDGE = 1_600;

// flatMap, not map+filter: `as const satisfies Product` narrows asset to a
// literal union, which a `key is string` predicate cannot widen to.
const stripAssets = product.ugcStrip.flatMap((media) => (media.asset ? [media.asset] : []));

describe('UGC marquee image budget', () => {
  it('every strip entry points at a real asset key', () => {
    expect(stripAssets).toHaveLength(product.ugcStrip.length);
  });

  it.each(stripAssets)('%s stays within the storefront image budget', async (key) => {
    const imagePath = resolve(assetDirectory, `${key}.jpg`);
    const metadata = await sharp(imagePath).metadata();

    expect(statSync(imagePath).size).toBeLessThanOrEqual(MAX_BYTES);
    expect(Math.max(metadata.width ?? 0, metadata.height ?? 0)).toBeLessThanOrEqual(MAX_LONG_EDGE);
  });
});
