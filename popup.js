const countEl = document.getElementById('count');
const enabledEl = document.getElementById('enabled');
const siteBtn = document.getElementById('site');
const hostEl = document.getElementById('host');

// Save a setting, wait for the background to apply the new rules, then reload the tab.
async function apply(tabId, settings) {
  await chrome.storage.local.set(settings);
  await chrome.runtime.sendMessage({ type: 'sync' });
  await chrome.tabs.reload(tabId);
}

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);

  countEl.textContent = (await chrome.action.getBadgeText({ tabId: tab.id })) || '0';
  enabledEl.checked = enabled;

  let host = null;
  try {
    const url = new URL(tab.url);
    if (url.protocol === 'http:' || url.protocol === 'https:') host = url.hostname;
  } catch {}

  if (!host) {
    siteBtn.disabled = true;
    hostEl.textContent = 'Not available on this page';
  } else {
    // Match subdomains the same way the network rule and content script do.
    const covers = d => host === d || host.endsWith('.' + d);
    const paused = allowlist.some(covers);
    siteBtn.textContent = paused ? 'Resume blocking on this site' : 'Pause on this site';
    hostEl.textContent = allowlist.find(covers) || host;

    siteBtn.addEventListener('click', async () => {
      siteBtn.disabled = true;
      const { allowlist = [] } = await chrome.storage.local.get('allowlist');
      const next = paused ? allowlist.filter(d => !covers(d)) : [...allowlist, host];
      await apply(tab.id, { allowlist: next });
      window.close();
    });
  }

  enabledEl.addEventListener('change', async () => {
    enabledEl.disabled = true;
    await apply(tab.id, { enabled: enabledEl.checked });
    enabledEl.disabled = false;
  });
})();
