# BlockThem

A lightweight ad and tracker blocker for Chrome, Edge, Brave, and other Chromium browsers, built on Manifest V3.

## Features

- **Network blocking** — stops requests to major ad and tracking networks (Google Ads/DoubleClick, Amazon Ads, Criteo, Taboola, Outbrain, and more) using Chrome's built-in `declarativeNetRequest` engine, so it's fast and doesn't read your browsing traffic.
- **Cosmetic filtering** — hides the empty boxes and ad slots that are left behind on the page.
- **Live counter** — the toolbar badge shows how many requests were blocked on the current tab.
- **Pause per site** — turn blocking off for a single site in one click, or switch it off everywhere.

## Install

1. Download this repository (**Code → Download ZIP**) and unzip it, or clone it:
   ```bash
   git clone https://github.com/exosphere8/BlockThem.git
   ```
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the `BlockThem` folder.
5. Pin the shield icon to your toolbar.

## Usage

Click the shield icon to:

- see the number of blocked requests on the current tab,
- turn blocking on or off everywhere,
- pause or resume blocking on the current site.

The page reloads automatically after a change so it takes effect right away.

## How it works

| File | Purpose |
| --- | --- |
| `rules.json` | Static blocklist of ad/tracker domains (subdomains included). Top-level page loads are never blocked, so you can still visit these sites directly. |
| `background.js` | Turns the blocklist on or off and adds an "allow everything" rule for paused sites. |
| `content.js` | Injects CSS that hides common ad containers. |
| `popup.html` / `popup.js` | The toolbar popup. |

To block another domain, add it to the `requestDomains` list in `rules.json` and reload the extension.

## Limitations

- Ads served from the same domain as the site (for example YouTube video ads or Facebook sponsored posts) aren't blocked; that needs site-specific scripting.
- The blocklist is intentionally small. For maximum coverage, a filter-list-based blocker such as uBlock Origin Lite is more thorough.

## License

[MIT](LICENSE)
