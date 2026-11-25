// Detects the built-in browsers inside apps (Telegram, WhatsApp, Instagram, Facebook, X, TikTok…).
// Social logins (Google, X, Apple…) use a pop-up that can't report back from these browsers,
// and Google blocks sign-in inside many of them. Email login works everywhere.

const IN_APP = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Line\/|MicroMessenger|Snapchat|TikTok|musical_ly|BytedanceWebview|Twitter|Telegram|WhatsApp|LinkedInApp|GSA\/|; wv\)/i;

export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (IN_APP.test(ua)) return true;
  // iOS in-app web views lack "Safari" in the user agent while real Safari / Chrome on iOS have it.
  const iOS = /iPhone|iPad|iPod/i.test(ua);
  return iOS && !/Safari\//i.test(ua);
}

export function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
}

/** Android: an intent link that opens the current page in Chrome. */
export function chromeIntentUrl(href: string): string {
  const u = new URL(href);
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(href)};end`;
}
