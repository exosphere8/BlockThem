// Cosmetic filtering: hides ad containers left behind after the network requests are blocked.

const SELECTORS = [
  'ins.adsbygoogle',
  '[id^="google_ads_"]',
  '[id^="div-gpt-ad"]',
  '[data-ad-slot]',
  '[data-google-query-id]',
  'amp-ad',
  'amp-embed[type="taboola"]',
  'iframe[src*="doubleclick.net"]',
  'iframe[src*="googlesyndication.com"]',
  'iframe[src*="amazon-adsystem.com"]',
  '[id^="taboola-"]',
  '.trc_rbox_container',
  '.OUTBRAIN',
  '[data-widget-id^="outbrain"]',
  '.adsbox',
  '.ad-banner',
  '.ad-container',
  '.ad-slot',
  '.advertisement',
  '.sponsored-content',
  '#ad-banner',
  '#ad-container'
];

(async () => {
  const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);
  // Skip if this frame or any frame above it is on a paused site, matching how the network rule applies.
  const hosts = [location.hostname];
  for (const origin of Array.from(location.ancestorOrigins || [])) {
    try { hosts.push(new URL(origin).hostname); } catch {}
  }
  const paused = hosts.some(h => allowlist.some(d => h === d || h.endsWith('.' + d)));
  if (!enabled || paused) return;

  const style = document.createElement('style');
  style.textContent = SELECTORS.join(',\n') + ' { display: none !important; }';
  (document.head || document.documentElement).appendChild(style);
})();
