import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Preserve the accessible heading while letting the visible letters assemble.
const headline = document.querySelector<HTMLElement>('#hero-title');
if (headline) {
  headline.setAttribute('aria-label', Array.from(headline.querySelectorAll('.title-line')).map(line => line.textContent?.trim()).join(' '));
  const walker = document.createTreeWalker(headline, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    [...(node.textContent ?? '')].forEach(char => {
      if (/\s/.test(char)) { fragment.append(char); return; }
      const span = document.createElement('span');
      span.className = 'motion-char'; span.textContent = char;
      span.setAttribute('aria-hidden', 'true'); fragment.append(span);
    });
    node.replaceWith(fragment);
  });
}

document.querySelectorAll<HTMLElement>('[data-preview]').forEach(preview => {
  const button = preview.querySelector<HTMLButtonElement>('[data-color-toggle]');
  button?.addEventListener('click', () => {
    const enabled = preview.classList.toggle('is-color');
    button.setAttribute('aria-pressed', String(enabled));
    const label = button.querySelector('span');
    if (label) label.textContent = enabled ? 'Тонировать' : 'В цвете';
  });
});

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  // The opening montage assembles type, then unfolds two real project surfaces.
  const intro = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 } });
  intro.from('.motion-char', { yPercent: 110, rotationX: -75, transformOrigin: '50% 100%', stagger: .018, duration: 1 })
    .from('.hero__aside', { y: 30, opacity: .25 }, .18)
    .from('.stage-surface', { scaleX: .9, borderTopLeftRadius: '320px', transformOrigin: 'bottom center', duration: 1.35 }, .12)
    .from('.stage-crest', { y: 70, rotation: 35, scale: .65 }, .2)
    .from('.stage-project--goal', { y: 100, rotationY: -12, rotationX: 8, rotation: 4, scale: .9, transformPerspective: 1600, duration: 1.45 }, .25)
    .from('.stage-project--znamya', { y: 150, rotationY: 14, rotation: -7, scale: .86, transformPerspective: 1600, duration: 1.45 }, .42);

  const desktop = gsap.matchMedia();
  desktop.add('(min-width: 701px)', () => {
    const scroll = { trigger: '.project-stage', start: 'top top', end: 'bottom top', scrub: .8 };
    gsap.fromTo('.stage-project--goal', { x: 0, y: 0, rotation: 0 }, { immediateRender: false, x: 32, y: -95, rotation: 4, ease: 'none', scrollTrigger: scroll });
    gsap.fromTo('.stage-project--znamya', { x: 0, y: 0, rotation: 0 }, { immediateRender: false, x: -22, y: 48, rotation: -5, ease: 'none', scrollTrigger: scroll });
    gsap.fromTo('.stage-crest', { rotation: 0, scale: 1 }, { immediateRender: false, rotation: -55, scale: 1.75, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.hero__intro', { y: -65, rotationX: 5, ease: 'none', scrollTrigger: { trigger: '.hero__intro', start: 'top top', end: 'bottom top', scrub: .8 } });
  });

  document.querySelectorAll<HTMLElement>('[data-image-reveal]').forEach((element, i) => {
    gsap.from(element, { clipPath: 'inset(18% 5% 8% 5% round 60px)', y: 75, rotation: i % 2 ? 5 : -5, scale: .92, duration: 1.35, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
  });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    gsap.from(element, { clipPath: 'inset(0 0 100% 0)', y: 38, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
  });
  gsap.from('.text-project', { x: -36, stagger: .14, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.text-projects', start: 'top 92%', once: true } });
  document.querySelectorAll<HTMLElement>('.service').forEach(element => {
    gsap.from(element.querySelector('h3'), { x: -50, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
    gsap.from(element.querySelector('.service__body'), { x: 35, opacity: .2, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
    gsap.from(element.querySelector('svg'), { rotation: -90, scale: .5, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
  });
  gsap.from('.contact__sheet', { borderTopLeftRadius: '340px', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 92%', once: true } });
  gsap.from('.contact h2', { clipPath: 'inset(0 0 100% 0)', y: 55, duration: 1.25, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 88%', once: true } });
  gsap.fromTo('.contact__orbit', { scale: .55, rotation: -30 }, { scale: 1.25, rotation: 45, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: .8 } });

  // The signal travels along its actual curved route, only while visible.
  const dot = document.querySelector<SVGCircleElement>('.flow-dot');
  const path = document.querySelector<SVGPathElement>('.flow-mark path');
  const flowState = { progress: 0 };
  const flow = gsap.to(flowState, { progress: 1, duration: 2.5, repeat: -1, repeatDelay: 1, ease: 'none', paused: true, onUpdate: () => {
    if (!dot || !path) return;
    // The first subpath is the forward route (half of this symmetric SVG path).
    const point = path.getPointAtLength(flowState.progress * path.getTotalLength() / 2);
    dot.setAttribute('cx', String(point.x)); dot.setAttribute('cy', String(point.y));
  } });
  let flowVisible = false;
  const updateFlow = () => flowVisible && !document.hidden ? flow.play() : flow.pause();
  ScrollTrigger.create({ trigger: '.text-projects', start: 'top bottom', end: 'bottom top', onToggle: self => { flowVisible = self.isActive; updateFlow(); } });
  document.addEventListener('visibilitychange', updateFlow);

  const precise = gsap.matchMedia();
  precise.add('(hover: hover) and (pointer: fine)', () => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>('[data-preview]').forEach(element => {
      const rx = gsap.quickTo(element, 'rotationX', { duration: .5, ease: 'power3.out' });
      const ry = gsap.quickTo(element, 'rotationY', { duration: .5, ease: 'power3.out' });
      const lift = gsap.quickTo(element, 'y', { duration: .5, ease: 'power3.out' });
      gsap.set(element, { transformPerspective: 1000 });
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        rx(-(y - .5) * 9); ry((x - .5) * 11); lift(-10);
        element.style.setProperty('--pointer-x', `${x * 100}%`);
        element.style.setProperty('--pointer-y', `${y * 100}%`);
      };
      const leave = () => { rx(0); ry(0); lift(0); };
      element.addEventListener('pointermove', move); element.addEventListener('pointerenter', move); element.addEventListener('pointerleave', leave);
      cleanups.push(() => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerenter', move); element.removeEventListener('pointerleave', leave); element.style.removeProperty('--pointer-x'); element.style.removeProperty('--pointer-y'); });
    });
    document.querySelectorAll<HTMLElement>('.hero .button,.header-cta,.contact__link').forEach(element => {
      const x = gsap.quickTo(element, 'x', { duration: .4, ease: 'power3.out' });
      const y = gsap.quickTo(element, 'y', { duration: .4, ease: 'power3.out' });
      const move = (event: PointerEvent) => { const rect = element.getBoundingClientRect(); x((event.clientX - rect.left - rect.width / 2) * .12); y((event.clientY - rect.top - rect.height / 2) * .18); };
      const leave = () => { x(0); y(0); };
      element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave); element.addEventListener('focusin', leave);
      cleanups.push(() => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); element.removeEventListener('focusin', leave); });
    });
    return () => cleanups.forEach(fn => fn());
  });
  return () => { desktop.revert(); precise.revert(); document.removeEventListener('visibilitychange', updateFlow); };
});
