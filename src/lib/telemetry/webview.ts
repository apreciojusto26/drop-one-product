/**
 * In-app browser detection from the User-Agent. Runs on BOTH sides: the
 * client tags its own events, and the server re-derives the same answer from
 * the request header so a tampered client payload cannot rewrite history.
 *
 * TELEMETRY ONLY for now — nothing in the checkout branches on this. Keep it
 * that way until a real TikTok run says which phase actually breaks.
 *
 * User-Agent strings are advisory: they are client-controlled and vendors
 * change them without notice. Treat a positive as a hint, never as proof.
 */

export type DetectedBrowser =
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'safari'
  | 'chrome'
  | 'firefox'
  | 'edge'
  | 'other-webview'
  | 'unknown';

/** Markers TikTok/ByteDance ship in their in-app WebView UA. */
const TIKTOK_MARKERS = ['tiktok', 'musical_ly', 'bytedancewebview', 'bytedance', 'trill'];

export function isTikTokWebView(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return TIKTOK_MARKERS.some((marker) => ua.includes(marker));
}

/**
 * Coarse classification, ordered so in-app browsers win over the engine they
 * embed — every iOS WebView reports Safari, and Instagram/Facebook report
 * Chrome on Android, so checking the engines first would hide them.
 */
export function detectBrowser(userAgent: string | null | undefined): DetectedBrowser {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();

  if (isTikTokWebView(ua)) return 'tiktok';
  if (ua.includes('instagram')) return 'instagram';
  if (ua.includes('fban') || ua.includes('fbav') || ua.includes('fb_iab')) return 'facebook';
  // `wv` is Android's WebView marker; `; wv)` avoids matching stray words.
  if (ua.includes('; wv)') || ua.includes('webview')) return 'other-webview';

  if (ua.includes('edg/')) return 'edge';
  if (ua.includes('firefox/') || ua.includes('fxios')) return 'firefox';
  if (ua.includes('chrome/') || ua.includes('crios')) return 'chrome';
  if (ua.includes('safari/')) return 'safari';

  return 'unknown';
}

/**
 * Bounded, non-identifying UA summary. The full string is a fingerprinting
 * vector and is never stored; this keeps just enough to tell platforms apart
 * when the classification above says 'unknown'.
 */
export function summarizeUserAgent(userAgent: string | null | undefined): string {
  if (!userAgent) return '';
  return userAgent.slice(0, 180);
}
