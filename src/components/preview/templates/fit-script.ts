// Sizes every `[data-fit]` element's first child so it spans the element's width exactly. The
// size goes on the element too: letter-spacing and line-height in em resolve against the
// element's own font size, which at a large scale would otherwise crush and push the word.
// Refits when the preview CSS, the fonts or the window change, since the preview swaps
// styles without reloading. `data-fit-max` caps the size in px, or as a multiple of the
// element's width with a `w` suffix ("0.9w").
export const fitScript = `
<script>
(function() {
  function fit() {
    document.querySelectorAll('[data-fit]').forEach(function(el) {
      var word = el.firstElementChild;
      if (!word) return;
      el.style.fontSize = word.style.fontSize = '100px';
      var w = word.getBoundingClientRect().width;
      if (!w) return;
      var size = Math.floor(100 * el.clientWidth / w * 0.99);
      var cap = el.getAttribute('data-fit-max') || '0';
      var max = parseFloat(cap) * (/w$/.test(cap) ? el.clientWidth : 1);
      if (max) size = Math.min(size, max);
      el.style.fontSize = word.style.fontSize = Math.max(24, size) + 'px';
    });
  }
  if (window.__fitObserver) window.__fitObserver.disconnect();
  var styles = document.getElementById('typestack-styles');
  if (styles) {
    window.__fitObserver = new MutationObserver(fit);
    window.__fitObserver.observe(styles, { childList: true, characterData: true, subtree: true });
  }
  if (!window.__fitBound) {
    window.__fitBound = true;
    window.addEventListener('resize', function() { window.__fit && window.__fit(); });
    document.fonts.addEventListener('loadingdone', function() { window.__fit && window.__fit(); });
  }
  window.__fit = fit;
  fit();
  document.fonts.ready.then(fit);
})();
</script>
`;
