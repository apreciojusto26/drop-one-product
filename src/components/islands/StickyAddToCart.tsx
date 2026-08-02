import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { checkout } from '@/stores/cart';
import { $isLightboxOpen } from '@/stores/ui';
import { useSelection } from '@/components/islands/parts/use-selection';
import { PlaceholderShot } from '@/components/islands/parts/PlaceholderShot';
import { formatPrice } from '@/lib/format';
import { packDisplayLabel } from '@/lib/shopify/pricing';
import type { ProductCommerce } from '@/lib/shopify/types';
import type { PricePack } from '@/types/content';
import type { ResolvedImage } from '@/types/content';

interface StickyAddToCartProps {
  commerce: ProductCommerce;
  packs: PricePack[];
  bundleOfferActive: boolean;
  ctaLabel: string;
  checkoutLabel: string;
  thumb: ResolvedImage | null;
  anchorId: string;
  /** R4: sentinel is the END of Hero (#hero-end), NOT #buybox-end. */
  sentinelId: string;
}

export function StickyAddToCart({
  commerce,
  packs,
  bundleOfferActive,
  ctaLabel,
  checkoutLabel,
  thumb,
  anchorId,
  sentinelId,
}: StickyAddToCartProps) {
  const [pastSentinel, setPastSentinel] = useState(false);
  const isLightboxOpen = useStore($isLightboxOpen);
  const { variant, pack, projection, totalCents, cart } = useSelection({ commerce, packs, bundleOfferActive });
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Sentinel out of view above the viewport => scrolled past it => show sticky bar.
        setPastSentinel(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelId]);

  const visible = pastSentinel && !isLightboxOpen;
  const hasCartLine = !!cart?.line;

  const handleClick = () => {
    if (hasCartLine) {
      checkout();
      return;
    }
    const anchor = document.getElementById(anchorId);
    anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    ctaRef.current?.focus({ preventScroll: true });
  };

  return (
    <div
      data-show={visible}
      aria-hidden={!visible}
      inert={!visible ? true : undefined}
      className="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-graphite/10 bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-sticky backdrop-blur transition-transform duration-300 motion-reduce:transition-none data-[show=true]:translate-y-0"
    >
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="size-11 shrink-0 overflow-hidden rounded-tile">
          {thumb ? (
            thumb.placeholder ? (
              <PlaceholderShot ratio="1/1" alt={thumb.alt} rounded="rounded-tile" className="size-full" />
            ) : (
              <img src={thumb.src} alt="" aria-hidden="true" className="size-full object-cover" />
            )
          ) : (
            <PlaceholderShot ratio="1/1" alt={commerce.title} rounded="rounded-tile" className="size-full" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-graphite">{commerce.title}</p>
          <p className="truncate text-xs text-steel">
            {variant.title} · {packDisplayLabel(pack, projection)}
          </p>
        </div>

        <button
          ref={ctaRef}
          type="button"
          onClick={handleClick}
          tabIndex={visible ? 0 : -1}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-pill bg-rust px-4 font-display text-sm font-bold tracking-wide text-white shadow-lift transition active:scale-[.99] hover:bg-rust-dark"
        >
          <span className="tabular-nums">{formatPrice(totalCents)}</span>
          <span>{hasCartLine ? checkoutLabel : ctaLabel}</span>
        </button>
      </div>
    </div>
  );
}
