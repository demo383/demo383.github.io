# Krishna Restaurant — Hybrid Demo

This build keeps the **first design's visual identity and image set**, while adopting the **second build's more balanced dimensions and responsive sizing**.

## Main improvements
- Original visual design retained.
- Larger, better-proportioned hero and content spacing from the newer layout.
- More consistent card/image dimensions across desktop and mobile.
- Seamless ticker loop with no empty gap/restart flash.
- Mobile navigation menu.
- Mobile sticky order bar when the cart has items.
- Cart persistence with localStorage.
- Remote image resolver with fallbacks to other original image URLs, then a local decorative fallback so a broken image never leaves an empty block.
- No second-build food imagery was used.

## Run
```bash
python -m http.server 5500
```
Open `http://localhost:5500` from this folder.

## Before production
Replace demo prices with verified restaurant pricing, use owner-approved photography, and connect checkout/catering forms to the restaurant's ordering/POS/email systems.
