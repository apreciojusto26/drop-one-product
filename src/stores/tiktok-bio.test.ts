import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  $bioNotice,
  captureSource,
  closeNotice,
  dismissEntryNotice,
  hasDismissedEntryNotice,
  isTikTokBioSource,
  shouldBlockCheckout,
} from '@/stores/tiktok-bio';

function setLocation(search: string): void {
  vi.stubGlobal('window', {
    location: { search },
    sessionStorage: store,
  });
}

let store: Storage;

beforeEach(() => {
  const map = new Map<string, string>();
  store = {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
    clear: () => map.clear(),
    key: () => null,
    length: 0,
  } as unknown as Storage;
  setLocation('');
  $bioNotice.set(null);
});

describe('captureSource', () => {
  it('latches the bio marker so it survives navigation away from the landing', () => {
    setLocation('?source=tiktokbio');
    captureSource();

    // The marker is gone from the URL on the next page, but the source holds.
    setLocation('');
    expect(isTikTokBioSource()).toBe(true);
  });

  it('ignores any other source', () => {
    setLocation('?source=instagram');
    captureSource();
    expect(isTikTokBioSource()).toBe(false);
  });

  it('does nothing without the marker', () => {
    captureSource();
    expect(isTikTokBioSource()).toBe(false);
  });
});

describe('shouldBlockCheckout', () => {
  it('lets normal traffic through untouched', () => {
    expect(shouldBlockCheckout()).toBe(false);
    expect($bioNotice.get()).toBeNull();
  });

  it('blocks bio traffic and raises the checkout notice', () => {
    setLocation('?source=tiktokbio');
    captureSource();

    expect(shouldBlockCheckout()).toBe(true);
    expect($bioNotice.get()).toBe('checkout');
  });

  it('keeps blocking after the entry notice was dismissed', () => {
    setLocation('?source=tiktokbio');
    captureSource();
    dismissEntryNotice();

    // Dismissing the one-time nudge must NOT buy a pass through the gate:
    // continuing from this WebView is the thing that breaks.
    expect(shouldBlockCheckout()).toBe(true);
  });

  it('keeps blocking on a second attempt after closing the gate', () => {
    setLocation('?source=tiktokbio');
    captureSource();

    expect(shouldBlockCheckout()).toBe(true);
    closeNotice();
    expect(shouldBlockCheckout()).toBe(true);
  });
});

describe('entry notice', () => {
  it('is remembered for the session once dismissed', () => {
    setLocation('?source=tiktokbio');
    captureSource();

    expect(hasDismissedEntryNotice()).toBe(false);
    dismissEntryNotice();
    expect(hasDismissedEntryNotice()).toBe(true);
    expect($bioNotice.get()).toBeNull();
  });
});
