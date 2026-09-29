// Injects a random inline SVG from /public/ill into every `.ill` slot.
// Colours come from the preview CSS (the --ill-* vars). Each drawing is used at most once per page.
export const illustrationScript = `
<script>
(function() {
  // ill-9, 10, 11, 16, 17, 22 and 24 duplicate other drawings
  var skip = [9, 10, 11, 16, 17, 22, 24];
  var nums = [];
  for (var j = 1; j <= 24; j++) if (skip.indexOf(j) < 0) nums.push(j);
  var total = nums.length;
  for (var k = nums.length - 1; k > 0; k--) {
    var r = Math.floor(Math.random() * (k + 1));
    var tmp = nums[k]; nums[k] = nums[r]; nums[r] = tmp;
  }

  var slots = document.querySelectorAll('.ill');
  slots.forEach(function(slot, i) {
    var n = nums[i % total];
    fetch('/ill/ill-' + n + '.svg')
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
