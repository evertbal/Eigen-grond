/* Eigen Grond — universele reveal-on-scroll + parallax.
   Werkt op elke pagina die styles.css laadt.

   HTML-conventie:
     data-reveal="up"           element fadet omhoog wanneer het in beeld komt
     data-reveal="in"           element fadet alleen op
     data-stagger               op broertjes: krijgt oplopende delay per positie
     data-parallax="0.15"       element (of <img> erin) beweegt licht mee bij scroll

   Fallback: als motion uit staat of IntersectionObserver ontbreekt, worden
   alle elementen direct zichtbaar gemaakt (geen verborgen inhoud). */
(function () {
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('is-in');
    });
    return;
  }

  /* Stagger — broertjes met [data-stagger] krijgen 90ms per positie. */
  var groups = new Map();
  document.querySelectorAll('[data-stagger]').forEach(function (el) {
    var parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, 0);
    var i = groups.get(parent);
    el.style.setProperty('--stagger-delay', (i * 90) + 'ms');
    groups.set(parent, i + 1);
  });

  /* Reveal-observer */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Parallax — alleen ≥769px viewport. */
  var parallaxTargets = document.querySelectorAll('[data-parallax]');
  if (parallaxTargets.length && window.matchMedia('(min-width: 769px)').matches) {
    var raf = null;
    function update() {
      raf = null;
      var vh = window.innerHeight;
      parallaxTargets.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var progress = (center - vh / 2) / vh;
        var strength = parseFloat(el.dataset.parallax) || 0.15;
        var max = 60;
        var y = Math.max(-max, Math.min(max, -progress * max * (strength * 4)));
        var target = el.querySelector('img') || el;
        target.style.setProperty('--parallax-y', y.toFixed(1) + 'px');
      });
    }
    function onScroll() {
      if (raf === null) raf = window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }
})();
