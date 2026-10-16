// One disclosure per project: mouse hover, touch toggle and native keyboard activation.
export function initProjectPreviews() {
  const hover = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)');
  document.querySelectorAll<HTMLElement>('[data-preview]').forEach(preview => {
    const button = preview.querySelector<HTMLButtonElement>('[data-preview-toggle]')!;
    const screen = preview.querySelector<HTMLElement>('.preview__site')!;
    const image = screen.querySelector<HTMLImageElement>('img')!;
    const label = button.querySelector<HTMLElement>('[data-preview-label]')!;
    let open = false;
    let request = 0;
    const setOpen = async (next: boolean) => {
      open = next;
      const version = ++request;
      // Keep the cover in place until the real screenshot is ready, including on slow connections.
      if (next && !image.complete) { try { await image.decode(); } catch { /* The case link remains available. */ } }
      if (version !== request) return;
      if (next && !image.naturalWidth) { open = false; return; }
      preview.classList.toggle('is-open', next);
      button.setAttribute('aria-expanded', String(next));
      button.setAttribute('aria-label', `${next?'Вернуть обложку':'Показать сайт'}: ${preview.dataset.previewTitle}`);
      screen.setAttribute('aria-hidden', String(!next));
      label.textContent = next ? 'Вернуть обложку' : 'Посмотреть сайт';
    };
    button.hidden = false;
    preview.addEventListener('pointerenter', event => { if (hover.matches && event.pointerType === 'mouse') void setOpen(true); });
    preview.addEventListener('pointerleave', event => { if (hover.matches && event.pointerType === 'mouse') void setOpen(false); });
    button.addEventListener('click', () => { void setOpen(!open); });
    button.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); void setOpen(false); }
    });
    button.addEventListener('blur', () => { void setOpen(false); });
    // A touch-open cover closes when it leaves the screen; it never steals the next tap.
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) void setOpen(false); });
    observer.observe(preview);
    hover.addEventListener('change', () => { void setOpen(false); });
  });
}
