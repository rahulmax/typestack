# Extracts colorways from Alex Cristache's palette graphics (downloaded with
# gallery-dl) into src/data/alex-cristache-colorways.json.
#
# Each image is clustered in OKLab. A cluster only counts as a colour if it is
# flat: most of its pixels sit right on its centre. Gradient slices spread out
# across their cell and drop away, so a gradient poster yields nothing and a
# flat arch or block composition yields its exact paints. The background is the
# colour that owns the image border; the rest become foreground and accents by
# area. Images with fewer than three flat colours are skipped.
#
#   python3 scripts/extract-alex-cristache.py [image-dir]
#
# Needs numpy and Pillow. Videos in the folder are ignored.

import json
import os
import sys
from multiprocessing import Pool

import numpy as np
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    '~/Projects/palettes/gallery-dl/twitter/AlexCristache')
OUT = 'src/data/alex-cristache-colorways.json'

THUMB = 300         # analyse at this size
K = 12              # clusters per image
TIGHT = 0.03        # OKLab distance for a pixel to belong to a flat colour
CORE = 0.012        # ...and to sit right on it
MIN_CORE = 0.6      # share of a cluster that must sit on its centre to be flat
MIN_SHARE = 0.015   # a colour must cover this much of the image
MERGE = 0.05        # colours closer than this are one colour
MIN_COLOURS = 3     # background plus two or more inks
MAX_INKS = 5
SAME_COLORWAY = 0.03


def to_oklab(rgb):
    c = rgb / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    m1 = np.array([[0.4122214708, 0.5363325363, 0.0514459929],
                   [0.2119034982, 0.6806757139, 0.1073588880],
                   [0.0883024619, 0.2817188376, 0.6299787005]])
    m2 = np.array([[0.2104542553, 0.7936177850, -0.0040720468],
                   [1.9779984951, -2.4285922050, 0.4505937099],
                   [0.0259040371, 0.7827717662, -0.8086757660]])
    return np.cbrt(c @ m1.T) @ m2.T


def kmeans(x, k, iters=20, seed=0):
    rng = np.random.default_rng(seed)
    c = [x[rng.integers(len(x))]]
    for _ in range(k - 1):
        d = np.min(((x[:, None] - np.array(c)[None]) ** 2).sum(-1), 1)
        c.append(x[rng.choice(len(x), p=d / d.sum())] if d.sum() > 0 else x[rng.integers(len(x))])
    c = np.array(c)
    for _ in range(iters):
        lbl = np.argmin(((x[:, None] - c[None]) ** 2).sum(-1), 1)
        for j in range(k):
            m = x[lbl == j]
            if len(m):
                c[j] = m.mean(0)
    return c, np.argmin(((x[:, None] - c[None]) ** 2).sum(-1), 1)


def hexof(rgb):
    return '#%02x%02x%02x' % tuple(int(round(v)) for v in np.clip(rgb, 0, 255))


def flat_colours(path):
    im = Image.open(path).convert('RGBA').convert('RGB')
    im.thumbnail((THUMB, THUMB), Image.BILINEAR)
    w, h = im.size
    rgb = np.asarray(im).reshape(-1, 3).astype(float)
    lab = to_oklab(rgb)
    centres, lbl = kmeans(lab, K)

    found = []
    for j, centre in enumerate(centres):
        mem = lbl == j
        if not mem.any():
            continue
        d = np.sqrt(((lab[mem] - centre) ** 2).sum(-1))
        tight = mem.copy()
        tight[mem] = d < TIGHT
        if tight.sum() < 5 or (d < CORE).mean() < MIN_CORE:
            continue
        found.append({'lab': lab[tight].mean(0), 'rgb': rgb[tight].mean(0), 'mask': tight})

    merged = []
    for c in sorted(found, key=lambda c: -c['mask'].sum()):
        for m in merged:
            if np.linalg.norm(m['lab'] - c['lab']) < MERGE:
                n1, n2 = m['mask'].sum(), c['mask'].sum()
                m['rgb'] = (m['rgb'] * n1 + c['rgb'] * n2) / (n1 + n2)
                m['lab'] = (m['lab'] * n1 + c['lab'] * n2) / (n1 + n2)
                m['mask'] = m['mask'] | c['mask']
                break
        else:
            merged.append(dict(c))

    ring = np.zeros((h, w), bool)
    bw = max(2, int(min(h, w) * 0.04))
    ring[:bw] = ring[-bw:] = True
    ring[:, :bw] = ring[:, -bw:] = True
    ring = ring.reshape(-1)
    out = []
    for m in merged:
        share = m['mask'].mean()
        if share >= MIN_SHARE:
            out.append({'hex': hexof(m['rgb']), 'lab': m['lab'], 'share': share,
                        'border': (m['mask'] & ring).sum() / ring.sum()})
    return out


# Naming ------------------------------------------------------------------

GREYS = [(0.25, 'Ink'), (0.38, 'Charcoal'), (0.52, 'Slate'), (0.68, 'Stone'),
         (0.82, 'Fog'), (0.93, 'Bone'), (1.01, 'Paper')]
# hue ceiling (degrees, OKLCH) -> names for dark, mid, light
HUES = [
    (15, ('Oxblood', 'Raspberry', 'Blush')),
    (40, ('Maroon', 'Poppy', 'Coral')),
    (60, ('Rust', 'Terracotta', 'Peach')),
    (80, ('Umber', 'Tangerine', 'Apricot')),
    (100, ('Bronze', 'Marigold', 'Sand')),
    (115, ('Olive', 'Mustard', 'Butter')),
    (135, ('Moss', 'Chartreuse', 'Lime')),
    (165, ('Forest', 'Fern', 'Mint')),
    (200, ('Deep Teal', 'Jade', 'Seafoam')),
    (230, ('Petrol', 'Teal', 'Aqua')),
    (255, ('Navy', 'Cerulean', 'Sky')),
    (280, ('Midnight', 'Cobalt', 'Periwinkle')),
    (305, ('Aubergine', 'Violet', 'Lavender')),
    (335, ('Plum', 'Orchid', 'Lilac')),
    (360, ('Wine', 'Magenta', 'Rose')),
]


def lch(lab):
    L, a, b = lab
    return L, float(np.hypot(a, b)), float(np.degrees(np.arctan2(b, a)) % 360)


def colour_name(lab):
    L, C, H = lch(lab)
    if C < 0.035:
        return next(n for top, n in GREYS if L < top)
    names = next(n for top, n in HUES if H < top)
    return names[0] if L < 0.45 else names[1] if L < 0.75 else names[2]


def tags(bg, inks):
    L, _, _ = lch(bg)
    chromas = [lch(c)[1] for c in [bg, *inks]]
    warm = [c for c in [bg, *inks] if lch(c)[1] > 0.035]
    hues = [lch(c)[2] for c in warm]
    warmth = sum(1 if (h < 110 or h > 330) else -1 for h in hues)
    out = ['light' if L > 0.7 else 'dark' if L < 0.4 else 'mid']
    if warm:
        out.append('warm' if warmth > 0 else 'cool' if warmth < 0 else 'mixed')
    out.append('saturated' if max(chromas) > 0.15 else 'muted')
    return out


def slug(s):
    return '-'.join(''.join(ch if ch.isalnum() else ' ' for ch in s.lower()).split())


# Main --------------------------------------------------------------------

def colorway(fname):
    colours = flat_colours(os.path.join(SRC, fname))
    if len(colours) < MIN_COLOURS:
        return None
    # The background owns the border; if nothing clearly does, the biggest area.
    edge = max(colours, key=lambda c: c['border'])
    bg = edge if edge['border'] >= 0.4 else max(colours, key=lambda c: c['share'])
    inks = sorted((c for c in colours if c is not bg), key=lambda c: -c['share'])[:MAX_INKS]
    return {'file': fname, 'bg': bg, 'inks': inks}


def same(a, b):
    ca, cb = [a['bg'], *a['inks']], [b['bg'], *b['inks']]
    if len(ca) != len(cb) or np.linalg.norm(a['bg']['lab'] - b['bg']['lab']) > SAME_COLORWAY:
        return False
    return all(min(np.linalg.norm(x['lab'] - y['lab']) for y in cb) < SAME_COLORWAY for x in ca)


def main():
    files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(('.jpg', '.jpeg', '.png')))
    with Pool() as pool:
        results = pool.map(colorway, files, chunksize=8)

    kept, names = [], {}
    for r in results:
        if r is None:
            continue
        dup = next((k for k in kept if same(k, r)), None)
        if dup:
            dup['files'].append(r['file'])
            continue
        r['files'] = [r['file']]
        kept.append(r)

    colorways = []
    for r in kept:
        bg, inks = r['bg'], r['inks']
        # Name by the inks that stand out most from the background.
        loud = sorted(inks, key=lambda c: -np.linalg.norm(c['lab'] - bg['lab']))
        words = list(dict.fromkeys(colour_name(c['lab']) for c in loud))[:2]
        base = f"{' & '.join(words)} on {colour_name(bg['lab'])}"
        names[base] = names.get(base, 0) + 1
        name = base if names[base] == 1 else f'{base} {names[base]}'
        colorways.append({
            'id': slug(name),
            'name': name,
            'classification': 'very-good',
            'background': bg['hex'],
            'foreground': [inks[0]['hex']],
            'accents': [c['hex'] for c in inks[1:]],
            'swatches': [bg['hex'], *(c['hex'] for c in inks)],
            'tags': tags(bg['lab'], [c['lab'] for c in inks]),
            'sources': [{'image': os.path.splitext(f)[0], 'path': f'twitter/AlexCristache/{f}',
                         'panel': 'whole image'} for f in r['files']],
        })

    doc = {
        'description': 'Colorways extracted from Alex Cristache\'s palette graphics '
                       '(@AlexCristache on X), by scripts/extract-alex-cristache.py. '
                       'Only flat colours count; gradients are ignored. Contrast was not checked.',
        'classifications': {
            'very-good': 'Three or more colors used together in one graphic: '
                         'a background plus two or more type/accent colors.'},
        'counts': {'colorways': len(colorways), 'images': len(files),
                   'images_used': sum(len(r['files']) for r in kept)},
        'colorways': colorways,
    }
    with open(OUT, 'w') as f:
        json.dump(doc, f, indent=2)
        f.write('\n')
    print(f"{len(colorways)} colorways from {doc['counts']['images_used']} of {len(files)} images -> {OUT}")


if __name__ == '__main__':
    main()
