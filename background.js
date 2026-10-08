// Keeps the network rules in sync with the settings stored by the popup.

const ALLOW_RULE_ID = 1;

chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true });

async function sync() {
  const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);

  await chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled ? { enableRulesetIds: ['ads'] } : { disableRulesetIds: ['ads'] }
  );

  // One high-priority rule that lets everything through on paused sites (and their subdomains).
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ALLOW_RULE_ID],
    addRules: allowlist.length
      ? [{
          id: ALLOW_RULE_ID,
          priority: 100,
          action: { type: 'allowAllRequests' },
          condition: { requestDomains: allowlist, resourceTypes: ['main_frame', 'sub_frame'] }
        }]
      : []
  });

  await chrome.action.setBadgeBackgroundColor({ color: enabled ? '#c0392b' : '#888888' });
}

// Run syncs one at a time so overlapping updates can't fight over the rules.
let queue = Promise.resolve();
function queueSync() {
  queue = queue.then(sync).catch(err => console.error('BlockThem: sync failed', err));
  return queue;
}

chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get('enabled');
  if (enabled === undefined) await chrome.storage.local.set({ enabled: true, allowlist: [] });
  await queueSync();
});
chrome.runtime.onStartup.addListener(() => { queueSync(); });
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && ('enabled' in changes || 'allowlist' in changes)) queueSync();
});

// The popup waits for this before reloading the tab, so the new rules apply to the reload.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === 'sync') {
    queueSync().then(() => sendResponse({ ok: true }));
    return true;
  }
});
