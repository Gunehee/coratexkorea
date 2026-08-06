/* Quick fixes JS (compat-first)
   - Back to top (smooth, consistent across pages)
   - Works even on browsers that don't support addEventListener options objects.
*/

(function () {
  // --- tiny helpers (ES5-safe) ---
  function onReady(fn) {
    if (document.readyState === 'loading') {
      if (document.addEventListener) document.addEventListener('DOMContentLoaded', fn, false);
      else if (window.attachEvent) window.attachEvent('onload', fn);
      else window.onload = fn;
    } else {
      fn();
    }
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  function getScrollY() {
    return (
      window.pageYOffset ||
      (document.documentElement && document.documentElement.scrollTop) ||
      (document.body && document.body.scrollTop) ||
      0
    );
  }

  function setScrollY(y) {
    try { window.scrollTo(0, y); } catch (e) {}
    try { if (document.documentElement) document.documentElement.scrollTop = y; } catch (e2) {}
    try { if (document.body) document.body.scrollTop = y; } catch (e3) {}
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  var raf = window.requestAnimationFrame || function (cb) { return window.setTimeout(cb, 16); };

  function smoothScrollToTop() {
    var startY = getScrollY();
    if (startY <= 0) {
      setScrollY(0);
      return;
    }

    if (prefersReducedMotion()) {
      setScrollY(0);
      return;
    }

    // Distance-aware duration, but capped to keep it snappy.
    var distance = Math.min(4500, Math.max(0, startY));
    var duration = 450 + (distance / 4500) * 650; // ~450ms .. 1100ms

    var startTime = +new Date();

    function step() {
      var now = +new Date();
      var t = (now - startTime) / duration;
      if (t > 1) t = 1;
      var eased = easeInOutCubic(t);
      var y = Math.round(startY * (1 - eased));
      setScrollY(y);
      if (t < 1) raf(step);
      else setScrollY(0);
    }

    step();
  }

  function hasClass(node, cls) {
    if (!node || !node.className) return false;
    var c = node.className;
    if (typeof c !== 'string') return false;
    return (' ' + c + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function bindTopHandler() {
    // 1) Direct bind (fast path)
    var btns = document.getElementsByClassName('qa-top');
    if (btns && btns.length) {
      var btn = btns[0];
      if (btn.addEventListener) {
        btn.addEventListener('click', function (e) {
          if (e && e.preventDefault) e.preventDefault();
          smoothScrollToTop();
          return false;
        }, false);
      } else if (btn.attachEvent) {
        btn.attachEvent('onclick', function () {
          smoothScrollToTop();
          return false;
        });
      }
    }

    // 2) Delegation (safety net if DOM changes / multiple instances)
    if (document.addEventListener) {
      document.addEventListener('click', function (e) {
        e = e || window.event;
        var t = e.target || e.srcElement;
        var node = t;
        // walk up a few parents (cheap + compatible)
        for (var i = 0; i < 8 && node; i++) {
          if (hasClass(node, 'qa-top')) {
            if (e.preventDefault) e.preventDefault();
            smoothScrollToTop();
            return false;
          }
          node = node.parentNode;
        }
      }, false);
    }
  }

  onReady(function () {
    try { bindTopHandler(); } catch (e) {
      // Never break the page if something unexpected happens.
    }
  });
})();
