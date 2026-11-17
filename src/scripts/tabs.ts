/** Skirtukai: [data-tabs] → tiesioginiai vaikai [role=tablist] [data-tab] ir [data-panel] */
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
  const tabs = root.querySelectorAll<HTMLButtonElement>(':scope > [role="tablist"] [data-tab]');
  const panels = root.querySelectorAll<HTMLElement>(':scope > [data-panel]');
  const select = (id: string) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
    panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t.dataset.tab ?? ''));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next?.focus();
      select(next?.dataset.tab ?? '');
    });
  });
});
