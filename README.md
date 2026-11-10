# Kurry's Indian Cuisine — Heritage Table Edition

A third, **food-first, fully reworked UI** for Kurry's in Farmington Hills and Troy, Michigan. Warm ivory backgrounds, deep heritage green, saffron/terracotta highlights, graceful serif typography, carefully framed Indian food photographs, restrained motion, and a restaurant-appropriate layout. The visual treatment and markup have been rebuilt from the prior bold midnight / neon design while keeping its JavaScript ordering flow.

## Run the site

1. Extract `Kurrys-Indian-Dining.zip`.
2. In the `Kurrys-Indian-Dining` folder run `python -m http.server 5500` (Python 3), then open `http://localhost:5500`. You can also open `index.html` directly.
3. **Food photography is sourced from real online Unsplash photos, not placeholders or generated illustrations.** The default site requires internet connectivity for the images. To host them locally and avoid dependence on online photo URLs, use an internet-connected computer and run `python download_photos.py` **before deploying**. This will cache successful downloads in `assets/photos/` and update the site to use them.
4. `photo-credits.html` and `photo-sources.json` describe the real photo sources. Photography is illustrative, not verified to depict Kurry's own dishes.

## Preserved working features

- Choose Farmington Hills or Troy; location-specific contacts, maps, and ordering routes.
- **Dine in**: select the restaurant, number of guests, and optionally enter a table number while browsing. Table number required at the demo checkout stage.
- **Pickup**: separate basket with its own demo checkout.
- **Delivery**: link to each restaurant's external ordering provider; demo baskets do not transfer.
- 122 menu entries from publicly posted reference menus; prices are *not live* and offerings may differ by branch.
- Instant menu search, category browsing, vegetarian and popular filters, show more, dish customization (spice, notes, quantity), persistent location/service-specific carts, item adjustments and removal.
- Fully functioning **demo only** order summary / save confirmation. This does **not** send any order to Kurry's, process a payment, or create a real restaurant booking.
- Contact & maps, catering inquiry draft via the visitor's email application, mobile navigation, scroll animations, subtle parallax, sticky mobile basket.

## Mobile optimization

Adaptive navigation at tablet widths; thumb-friendly action buttons and bottom-sheet dialogs on phones; mobile horizontal category chips; one-row food-image cards for easy scanning on small screens; bottom basket control when items are selected; responsive from 320px and accessible reduced-motion handling.

## Important launch notes

This is an independent concept, **not an official or operational Kurry's ordering system**. Confirm access/permission to brand assets and menu content, get the current menu and approved Kurry's product photography, validate opening hours, connect verified POS/kitchen/QR table integrations, and handle authentication, tax, dietary accuracy, payments, privacy, inventory and restaurant confirmation before a production launch. Photos and external ordering partner availability require independent verification.

## Project files

- `index.html` — complete semantic page, order drawers and forms
- `styles.css` — all-new visual design, animations and mobile responsiveness
- `app.js` — preserved ordering, location, filters, cart and demo checkout logic with revised copy
- `data.js` — 122 menu records, locations and reference pricing
- `assets/brand.svg` — custom Kurry's-inspired brand emblem for the concept
- `photo-sources.json` / `photo-credits.html` — Unsplash sources and license information
- `download_photos.py` — local caching and image-link rewrite tool

Menu reference: https://www.kurrys.com/index.html · Troy reference: https://kurrysattroy.com/
