'use client';

import { useEffect, useState } from 'react';
import { chromeIntentUrl, isAndroid, isInAppBrowser } from '@/lib/inAppBrowser';

/** Shown only inside an app's built-in browser, where Google/X login can't return to the site. */
export function InAppBanner() {
  const [show, setShow] = useState(false);
  const [android, setAndroid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShow(isInAppBrowser());
    setAndroid(isAndroid());
  }, []);

  if (!show) return null;

  return (
    <div role="status" className="border-b border-amber-400/20 bg-amber-400/10 text-amber-100">
      <div className="container-x flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          You&apos;re in an app&apos;s built-in browser. <strong>Email login works here</strong>; for Google, X or Apple, open the
          site in {android ? 'Chrome' : 'Safari'}.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {android ? (
            <a href={chromeIntentUrl(window.location.href)} className="rounded-lg bg-amber-300 px-3 py-1.5 font-semibold text-ink-950">
              Open in Chrome
            </a>
          ) : (
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                } catch {
                  /* clipboard blocked */
                }
              }}
              className="rounded-lg bg-amber-300 px-3 py-1.5 font-semibold text-ink-950"
            >
              {copied ? 'Link copied — paste in Safari' : 'Copy link for Safari'}
            </button>
          )}
          <button onClick={() => setShow(false)} aria-label="Dismiss" className="px-2 py-1 text-amber-200/70 hover:text-amber-100">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
