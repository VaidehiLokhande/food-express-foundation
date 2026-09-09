# Food Express Foundation — Website

## Before you go live
Open `src/data/orgConfig.ts` and set:
- `phone` → the Foundation's real 10-digit mobile/office number
  (used by the "Send Message" button and the floating WhatsApp button)
- `email` → **foodexpressfoundation@gmail.com** (already set)
- `address` → **Food Express Foundation, Public Charitable Trust Office, Maharashtra, India** (already set)
- bank fields if they ever change (used only in the Donate popup)

This one file is the single place to update contact info for the whole site.

Every clickable email on the site (topbar, contact section, donation
popup note, international-donation link) now opens **Outlook Web**
directly (via an `outlook.office.com` compose deep-link) with the
address, subject, and — for the international donation link — a
pre-filled subject, instead of relying on whatever mail app the
visitor's device has set as default.

Bank details shown in the Donate popup are taken from the Foundation's
Axis Bank cheque/PAN (account name, account number, IFSC, branch, PAN) —
double-check them against the physical cheque book before publishing.

## What's included in this update
- Foundation logo icon (blue circle) redrawn with horizontal wave strokes,
  used as the site's brand mark (header, footer, admin panel, login screen).
  (header, footer, admin panel, login screen).
- "FOOD EXPRESS" now shown in peacock green, "FOUNDATION" in black
  (on dark backgrounds like the footer it switches to a lighter
  green/white automatically so it stays readable).
- Every "Donate" / "Donate Now" button (header, hero, campaigns, donate
  box) opens a popup with the Foundation's hardcoded bank transfer
  details, each with a one-tap Copy button.
- The Contact form's "Send Message" button opens the visitor's SMS app
  with the message pre-filled and addressed to the Foundation's number
  (`sms:` link — works on phones; on desktop it prompts to open a
  messaging app or falls back to the Messages/Contacts default handler).
- New extras: a floating WhatsApp chat button, a "share payment proof
  on WhatsApp" shortcut inside the donation popup, a back-to-top
  button, and small toast confirmations for copy actions.

## Run locally
```
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

A ready-made production build is already included in `dist/` from this
session, generated with the same source in `src/`.
