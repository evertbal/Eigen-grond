/* Eigen Grond — hamburger menu toggle voor mobiele nav */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-right');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  /* Sluit het menu wanneer een link wordt aangeklikt */
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  /* Sluit het menu bij overgang naar desktop-breedte */
  var mq = window.matchMedia('(min-width: 769px)');
  function handleMq(e) { if (e.matches) setOpen(false); }
  if (mq.addEventListener) mq.addEventListener('change', handleMq);
  else if (mq.addListener) mq.addListener(handleMq); /* Safari < 14 */

  /* Initieel dicht */
  setOpen(false);
})();
