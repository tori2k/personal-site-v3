import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Color is a real toggle on touch and keyboard; hover is a CSS enhancement.
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
  const intro = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.25 } });
  intro.from('.title-line > span', { yPercent: 105, stagger: .1 })
    .from('.hero__aside', { y: 22, opacity: .3, duration: 1 }, .2)
    .from('.stage-surface', { y: 55, duration: 1.4 }, .15)
    .from('.stage-crest', { y: 55, rotation: 12 }, .25)
    .from('.stage-project--goal', { y: 80, rotation: 2, duration: 1.5 }, .2)
    .from('.stage-project--znamya', { y: 120, rotation: -3, duration: 1.5 }, .35);

  // Layer separation follows native scroll, never intercepts it.
  const desktopMotion = gsap.matchMedia();
  desktopMotion.add('(min-width: 701px)', () => {
    gsap.fromTo('.stage-project--goal', { y: 0 }, { immediateRender: false, y: -46, ease: 'none', scrollTrigger: { trigger: '.project-stage', start: 'top top', end: 'bottom top', scrub: .8 } });
    gsap.fromTo('.stage-project--znamya', { y: 0, rotation: 0 }, { immediateRender: false, y: -15, rotation: -1.5, ease: 'none', scrollTrigger: { trigger: '.project-stage', start: 'top top', end: 'bottom top', scrub: .8 } });
    gsap.fromTo('.stage-crest', { rotation: 0, x: 0 }, { immediateRender: false, rotation: -14, x: 28, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  });

  document.querySelectorAll<HTMLElement>('[data-image-reveal]').forEach((element, i) => {
    gsap.from(element, { clipPath: 'inset(12% 0 0 0 round 50px)', y: 36, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true }, delay: i * .06 });
  });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    gsap.from(element, { y: 32, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: element, start: 'top 95%', once: true } });
  });
  gsap.from('.text-project', { y: 28, stagger: .15, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.text-projects', start: 'top 92%', once: true } });
  gsap.from('.service', { y: 22, stagger: .12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.service-list', start: 'top 90%', once: true } });
  gsap.from('.contact__sheet', { borderTopLeftRadius: '280px', yPercent: 12, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 92%', once: true } });
  gsap.from('.contact h2', { y: 36, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 85%', once: true } });
  const flow = gsap.to('.flow-dot', { attr: { cx: 110, cy: 70 }, keyframes: [{ attr: { cx: 35, cy: 20 }, duration: .6 }, { attr: { cx: 85, cy: 70 }, duration: 1.2 }, { attr: { cx: 110, cy: 70 }, duration: .6 }], repeat: -1, repeatDelay: 1, ease: 'power2.inOut', paused: true });
  ScrollTrigger.create({ trigger: '.text-projects', start: 'top bottom', end: 'bottom top', onToggle: self => self.isActive ? flow.play() : flow.pause() });

  // Small physical response on precise pointers. No permanent animation loop.
  const precise = gsap.matchMedia();
  precise.add('(hover: hover) and (pointer: fine)', () => {
    const cleanups: (()=>void)[] = [];
    document.querySelectorAll<HTMLElement>('[data-preview]').forEach(element => {
      const rx = gsap.quickTo(element, 'rotationX', { duration: .65, ease: 'power3.out' });
      const ry = gsap.quickTo(element, 'rotationY', { duration: .65, ease: 'power3.out' });
      gsap.set(element, { transformPerspective: 1200 });
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        rx(-((event.clientY - rect.top) / rect.height - .5) * 2);
        ry(((event.clientX - rect.left) / rect.width - .5) * 2);
      };
      const leave = () => { rx(0); ry(0); };
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', leave);
      cleanups.push(() => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); });
    });
    return () => cleanups.forEach(fn => fn());
  });
  return () => { desktopMotion.revert(); precise.revert(); };
});
