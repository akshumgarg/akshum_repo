"""Makes src/data/qr.js (the QR code on the back of the console).

Use:
    pip install segno
    python tools/make_qr.py https://your-site.vercel.app/

Run it again whenever the site link changes, then redeploy.
"""
import sys
from pathlib import Path

import segno

if len(sys.argv) != 2:
    sys.exit('Give the link: python tools/make_qr.py https://your-site.vercel.app/')

url = sys.argv[1]
# Error level M (about 15% can be damaged). No micro codes: phones read normal ones best.
qr = segno.make(url, error='m', micro=False, boost_error=False)
rows = [''.join('1' if cell else '0' for cell in row) for row in qr.matrix]
size = len(rows)

out = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'qr.js'
lines = [
    '// Made by tools/make_qr.py. Do not edit by hand.',
    "// Each row is a string of '1' (dark) and '0' (light). The quiet border is added by QrCode.jsx.",
    '',
    'export const qr = {',
    f"  url: '{url}',",
    f'  size: {size},',
    '  rows: [',
    *[f"    '{r}'," for r in rows],
    '  ],',
    '}',
    '',
]
out.write_text('\n'.join(lines), encoding='utf-8')
print(f'Wrote {out} ({size}x{size}) for {url}')