(() => {
  const header = document.querySelector('.headerClass');
  const scrollPosition = () => Math.max(0, Math.min(window.scrollY,
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
  let headerScrollAnchor = scrollPosition();

  window.addEventListener('scroll', () => {
    if (!header) return;
    const scrollY = scrollPosition();
    if (scrollY <= header.offsetHeight || header.contains(document.activeElement)) {
      header.classList.remove('is-hidden');
      headerScrollAnchor = scrollY;
    } else if (Math.abs(scrollY - headerScrollAnchor) >= 8) {
      header.classList.toggle('is-hidden', scrollY > headerScrollAnchor);
      headerScrollAnchor = scrollY;
    }
  }, { passive: true });

  header?.addEventListener('focusin', () => {
    header.classList.remove('is-hidden');
    headerScrollAnchor = scrollPosition();
  });

  const measureHeader = () => {
    if (header) document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  };
  window.addEventListener('resize', measureHeader);
  if (header && 'ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
  document.fonts?.ready.then(measureHeader);
  measureHeader();

  const gallery = document.querySelector('.picture');
  const controls = document.querySelector('.gallery-controls');
  if (gallery && controls) {
    controls.hidden = false;
    controls.addEventListener('click', (event) => {
      const button = event.target.closest('[data-gallery-direction]');
      if (!button) return;
      const direction = Number(button.dataset.galleryDirection);
      const step = gallery.querySelector('img').offsetWidth
        + parseFloat(getComputedStyle(gallery).gap);
      const end = gallery.scrollWidth - gallery.clientWidth;
      const atEnd = gallery.scrollLeft >= end - 2;
      const atStart = gallery.scrollLeft <= 2;
      const left = direction > 0 && atEnd ? 0
        : direction < 0 && atStart ? end
        : gallery.scrollLeft + direction * step;
      gallery.scrollTo({
        left,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
      });
    });
  }
})();
