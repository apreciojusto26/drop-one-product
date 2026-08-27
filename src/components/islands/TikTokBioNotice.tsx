import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  $bioNotice,
  captureSource,
  closeNotice,
  dismissEntryNotice,
  hasDismissedEntryNotice,
  shouldWarn,
} from '@/stores/tiktok-bio';
import { trackCheckoutEvent } from '@/lib/telemetry/client';
import { ICONS } from '@/lib/icons';

/**
 * The only place this notice is rendered. It lives in Base.astro and reads
 * $bioNotice, so the landing, the cart drawer and the sticky bar all share
 * one implementation — the checkout gate is enforced once inside cart.ts
 * checkout(), which every buy button already funnels through.
 *
 * Two modes:
 *   entry    — one-time nudge, dismissible, does not block anything
 *   checkout — shown when the buyer tries to continue, and DOES block, since
 *              continuing from the bio WebView is what breaks
 *
 * No window.open, no intent://, no custom schemes, no automatic redirect:
 * the buyer opens the page in their browser themselves, through the menu
 * their own app provides.
 */
export function TikTokBioNotice() {
  const mode = useStore($bioNotice);

  useEffect(() => {
    captureSource();
    // shouldWarn(), not isTikTokBioSource(): Safari reopens the same URL with
    // the marker still on it when the buyer follows our own instruction, and
    // showing the notice there would contradict the advice we just gave.
    if (shouldWarn() && !hasDismissedEntryNotice()) {
      $bioNotice.set('entry');
    }
  }, []);

  useEffect(() => {
    if (mode) trackCheckoutEvent('tiktok_bio_notice_shown', { detail: `mode=${mode}` });
    if (mode === 'checkout') trackCheckoutEvent('tiktok_bio_checkout_blocked', { phase: 'pre-checkout' });
  }, [mode]);

  // Escape closes the checkout gate the same way the button does: trapping a
  // buyer inside a warning is worse than letting them back to the page.
  useEffect(() => {
    if (!mode) return;
    function onKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') handleSecondary();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleSecondary reads `mode` from this same render
  }, [mode]);

  if (!mode) return null;

  const isCheckout = mode === 'checkout';

  function handleSecondary(): void {
    trackCheckoutEvent('tiktok_bio_notice_dismissed', { detail: `mode=${mode}` });
    // The entry nudge is remembered for the session; the checkout gate is
    // not, so the next attempt is warned again.
    if (isCheckout) closeNotice();
    else dismissEntryNotice();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-graphite/70 p-3 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tiktok-bio-title"
        className="relative w-full max-w-sm rounded-card bg-white p-5 shadow-lift sm:p-6"
      >
        {/* A hint, never the instruction: the menu sits in different corners
            across TikTok versions and platforms, so the text below has to
            stand on its own. aria-hidden for the same reason. */}
        <div className="pointer-events-none absolute -top-8 right-4 flex flex-col items-center" aria-hidden="true">
          <span className="motion-safe:animate-bounce text-2xl leading-none">☝️</span>
        </div>

        <div className="flex size-11 items-center justify-center rounded-full bg-grape-tint">
          <svg viewBox={ICONS.lock.viewBox} className="size-5 text-grape" aria-hidden="true">
            <path fill="currentColor" d={ICONS.lock.path} />
          </svg>
        </div>

        <h2 id="tiktok-bio-title" className="mt-3 font-display text-xl font-extrabold leading-tight text-graphite">
          {isCheckout ? 'Para completar tu compra, ábrela en tu navegador' : 'Abre la tienda en tu navegador'}
        </h2>

        <p className="mt-2 text-sm leading-snug text-steel">
          {isCheckout
            ? 'TikTok abre las webs en su propio navegador y puede interrumpir el pago. Ábrela en Safari o Chrome para terminar sin problemas.'
            : 'TikTok está abriendo esta página dentro de su navegador y puede interrumpir el proceso de compra.'}
        </p>

        <div className="mt-4 rounded-tile bg-bone px-4 py-3">
          <p className="text-eyebrow font-bold uppercase tracking-wider text-steel">Cómo hacerlo</p>
          <p className="mt-1 font-display text-sm font-bold leading-snug text-graphite">
            Pulsa <span className="text-grape">⋯</span> o <span className="text-grape">Compartir</span> y selecciona{' '}
            <span className="text-grape">«Abrir en navegador»</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleSecondary}
          className={
            isCheckout
              ? 'mt-5 flex h-12 w-full items-center justify-center rounded-pill border-2 border-graphite/15 px-6 font-display text-sm font-bold text-graphite transition hover:bg-graphite/5'
              : 'mt-5 flex h-12 w-full items-center justify-center rounded-pill bg-grape px-6 font-display text-sm font-bold tracking-wide text-white shadow-lift transition active:scale-[.99] hover:bg-grape-dark'
          }
        >
          {isCheckout ? 'Volver' : 'Seguir viendo aquí'}
        </button>
      </div>
    </div>
  );
}
