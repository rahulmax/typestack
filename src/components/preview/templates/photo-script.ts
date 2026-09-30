// Fills every `.photo` slot with a photo from /public/photos that suits the page colours.
// Matching reads --bg-color, --tone-base (headings) and --fg-color (body) from the preview CSS
// and compares them with each photo's measured OKLab profile in photos/manifest.json.
// A slot's data-kind ("scene" or "people") limits it to that kind of photo. Among the closest
// matches, the page's data-seed (the copy set) picks which one, so a new copy set brings new photos
// while the same set keeps its photos steady.
// The preview swaps CSS without reloading, so the pick re-runs whenever the styles change.
export const photoScript = `
<script>
(function() {
  function parse(v) {
    var m = /oklch\\(([\\d.]+)%\\s+([\\d.]+)\\s+([\\d.]+)/.exec(v || '');
    if (!m) return null;
    var c = +m[2], h = m[3] * Math.PI / 180;
    return { L: m[1] / 100, c: c, h: +m[3], a: c * Math.cos(h), b: c * Math.sin(h) };
  }

  // How much of the photo sits near hue h: its 30° histogram bins, weighted by
  // distance from h (full weight at the bin centre, none beyond 45°)
  function hueMass(p, h) {
    var sum = 0;
    for (var i = 0; i < 12; i++) {
      var d = Math.abs(i * 30 + 15 - h) % 360;
      if (d > 180) d = 360 - d;
      if (d < 45) sum += p.hues[i] * (1 - d / 45);
    }
    return sum;
  }

  // Lower is better. The most colourful of the three page colours sets the hue;
  // the page background sets the mood (dark page, low-key photo).
  function scorer(photos, bg, target) {
    if (target.c < 0.03) return function(p) { return p.c * 5 + Math.abs(p.L - bg.L) * 0.5; };
    var max = Math.max.apply(null, photos.map(function(p) { return hueMass(p, target.h); })) || 1;
    return function(p) { return 1 - hueMass(p, target.h) / max + Math.abs(p.L - bg.L) * 0.3; };
  }

  // How many of the closest colour matches the seed chooses between
  var TOP = 6;

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function place(slot, p) {
    var current = slot.querySelector('img');
    if (current && current.dataset.file === p.file) return;
    var img = document.createElement('img');
    img.src = '/photos/' + p.file;
    img.alt = p.alt;
    img.title = 'Photo: ' + p.photographer + ' / Pexels';
    img.dataset.file = p.file;
    img.decoding = 'async';
    img.onload = function() {
      slot.querySelectorAll('img').forEach(function(old) { if (old !== img) old.remove(); });
      img.style.opacity = '1';
    };
    slot.appendChild(img);
  }

  function pick() {
    var slots = document.querySelectorAll('.photo');
    var photos = window.__photoManifest;
    if (!slots.length || !photos) return;
    var s = getComputedStyle(document.documentElement);
    var bg = parse(s.getPropertyValue('--bg-color'));
    if (!bg) return;
    var colours = [bg, parse(s.getPropertyValue('--tone-base')), parse(s.getPropertyValue('--fg-color'))].filter(Boolean);
    var target = colours.reduce(function(best, c) { return c.c > best.c ? c : best; });
    var seedEl = document.querySelector('[data-seed]');
    var seed = hash(seedEl ? seedEl.dataset.seed : '');
    slots.forEach(function(slot, i) {
      var kind = slot.dataset.kind;
      var pool = kind ? photos.filter(function(p) { return p.kind === kind; }) : photos;
      if (!pool.length) pool = photos;
      var score = scorer(pool, bg, target);
      var top = pool.slice().sort(function(x, y) { return score(x) - score(y); }).slice(0, TOP);
      place(slot, top[(seed + i) % top.length]);
    });
  }

  if (window.__photoObserver) window.__photoObserver.disconnect();
  var styles = document.getElementById('typestack-styles');
  if (styles) {
    window.__photoObserver = new MutationObserver(pick);
    window.__photoObserver.observe(styles, { childList: true, characterData: true, subtree: true });
  }

  if (window.__photoManifest) pick();
  else fetch('/photos/manifest.json')
    .then(function(r) { return r.json(); })
    .then(function(list) { window.__photoManifest = list; pick(); });
})();
</script>
`;
