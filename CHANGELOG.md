# Changelog

## 1.0.0 — 8 Oct 2026

First release.

- Blocks requests to 56 common ad and tracker domains with `declarativeNetRequest`. Vendor
  domains are blocked only when another site loads them, so their own dashboards keep working.
- Hides leftover ad slots with a small stylesheet.
- Per-tab blocked counter on the toolbar badge.
- Pause or resume blocking per site (subdomains included), or switch it off everywhere.
- Popup with light and dark themes.

Fixed before release (write-ups in [postmortems](https://github.com/exosphere8/postmortems)):

- Pausing a site could reload the page before the new rules were applied.
- The popup and the blocker disagreed about subdomains, so "Resume" could get stuck.
- Embedded frames on a paused site still had ad slots hidden.
- Ad vendors' own websites were blocked from loading their own resources.
