"""Download representative Unsplash photos for local hosting (internet required).

Run from the project directory: python download_photos.py
Successful downloads are served locally; failures continue to use their web URLs.
The photos depict Indian cuisine in general and are NOT claimed to show Kurry's dishes.
"""
from pathlib import Path
import html
import json
import re
import urllib.request

root = Path(__file__).resolve().parent
manifest = json.loads((root / 'photo-sources.json').read_text(encoding='utf-8'))
photos = root / 'assets' / 'photos'
photos.mkdir(parents=True, exist_ok=True)
cache = {}
for name, spec in manifest.items():
    destination = photos / spec['file']
    try:
        if not destination.exists() or destination.stat().st_size < 1024:
            req = urllib.request.Request(spec['url'], headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=35) as response:
                content_type = response.headers.get('Content-Type', '')
                data = response.read(12_000_000)
            if not content_type.startswith('image/') or len(data) < 1024:
                raise ValueError('Returned content is not a valid image')
            destination.write_bytes(data)
        cache[name] = 'assets/photos/' + spec['file']
        print(f'OK   {name}: {destination.stat().st_size:,} bytes')
    except Exception as exc:
        print(f'SKIP {name}: {exc}')

if not cache:
    raise SystemExit('No photos downloaded. Check internet access; the existing online links remain in place.')

# Only replace the five large images that are explicitly used by the page;
# in-memory dish imagery is handled through window.KURRYS_LOCAL_PHOTOS below.
page = root / 'index.html'
html_text = page.read_text(encoding='utf-8')
for key in ('hero', 'story', 'samosa', 'dine', 'catering'):
    if key not in cache:
        continue
    url_base = manifest[key]['url'].split('?')[0]
    # Matches that Unsplash photo with any crop/size query string.
    html_text = re.sub(re.escape(url_base) + r'(?:\?[^"\s<>]*)?', cache[key], html_text)
if 'src="local-photo-map.js"' not in html_text:
    html_text = html_text.replace('<script defer src="app.js"></script>', '<script defer src="local-photo-map.js"></script>\n<script defer src="app.js"></script>')
page.write_text(html_text, encoding='utf-8')

categories = ('biryani', 'curry', 'paneer', 'appetizers', 'tandoor', 'dosa', 'bread', 'chinese', 'desserts', 'drinks')
mapping = {cat: cache[cat] for cat in categories if cat in cache}
(root / 'local-photo-map.js').write_text('window.KURRYS_LOCAL_PHOTOS = ' + json.dumps(mapping) + ';\n', encoding='utf-8')
print(f'Finished. {len(cache)}/{len(manifest)} real photos cached. Photos are illustrative, not actual Kurry\'s dish photos.')
