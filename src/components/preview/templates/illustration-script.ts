import { ILLUSTRATION_PACKS } from "@/lib/illustration-packs";

// Injects a random inline SVG from /public/ill into every `.ill` slot.
// Colours come from the preview CSS (the --ill-* vars). One pack per preview window, so a page never
// mixes drawing styles; each drawing is used at most once per page.
export const illustrationScript = `
<script>
(function() {
  var packs = ${JSON.stringify(ILLUSTRATION_PACKS)};
  if (!window.__illPack) window.__illPack = packs[Math.floor(Math.random() * packs.length)];
  var pack = window.__illPack;
  var nums = [];
  for (var j = 1; j <= pack.count; j++) nums.push(j);
  for (var k = nums.length - 1; k > 0; k--) {
    var r = Math.floor(Math.random() * (k + 1));
    var tmp = nums[k]; nums[k] = nums[r]; nums[r] = tmp;
  }

  var slots = document.querySelectorAll('.ill');
  slots.forEach(function(slot, i) {
    var n = nums[i % nums.length];
    fetch('/ill/' + pack.id + '-' + (n < 10 ? '0' : '') + n + '.svg')
      .then(function(r) { return r.text(); })
      .then(function(svg) {
        slot.innerHTML = svg;
        var svgEl = slot.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.height = 'auto';
          svgEl.style.maxHeight = slot.dataset.maxH || '320px';
        }
      });
  });
})();
</script>
`;
