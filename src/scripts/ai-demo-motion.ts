import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Both scroll and the play button seek the same reversible, authored sample.
export function initAIDemo() {
  const demo = document.querySelector<HTMLElement>('[data-ai-demo]');
  if (!demo) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...demo.querySelectorAll<HTMLElement>('[data-demo-scene]')];
  const choices = [...demo.querySelectorAll<HTMLButtonElement>('[data-demo-choice]')];
  const run = demo.querySelector<HTMLButtonElement>('[data-demo-run]')!;
  const status = demo.querySelector<HTMLElement>('[data-demo-status]')!;
  const steps = [...demo.querySelectorAll<HTMLElement>('[data-demo-step]')];
  const progress = demo.querySelector<HTMLElement>('[data-demo-progress]')!;
  let selected = 0;
  let sequence: gsap.core.Timeline;
  let trigger: ScrollTrigger | undefined;
  let playback: gsap.core.Tween | null = null;
  let manual = false;
  let visible = true;
  let lastScroll = window.scrollY;

  const stopPlayback = () => {
    playback?.kill(); playback = null; manual = false;
    run.setAttribute('aria-pressed', 'false');
  };

  const renderState = () => {
    const p = sequence.progress();
    const stage = p < .12 ? 0 : p < .92 ? 1 : 2;
    steps.forEach((step, index) => step.classList.toggle('is-active', index <= stage));
    const copy = reduced.matches || stage === 2
      ? 'Черновик готов — остаётся проверить детали.'
      : stage === 1 ? 'Выделяем задачу, ответственного и срок.'
      : 'Листайте вниз: договорённость станет задачей.';
    if (status.textContent !== copy) status.textContent = copy;
    run.querySelector('span')!.textContent = manual && p < 1 ? 'Пауза' : p > .99 ? 'Повторить' : 'Проиграть';
    scenes[selected].querySelector('.demo-output')!.setAttribute('aria-busy', String(p > 0 && p < .92));
  };

  const buildSequence = (value = 0) => {
    stopPlayback();
    sequence?.kill();
    demo.querySelectorAll('[data-demo-flight]').forEach(token => token.remove());
    const scene = scenes[selected];
    const rows = [...scene.querySelectorAll<HTMLElement>('[data-result]')];
    const marks = [...scene.querySelectorAll<HTMLElement>('[data-source]')];
    const route = scene.querySelector<SVGPathElement>('.demo-route__signal')!;
    const placeholder = scene.querySelector<HTMLElement>('.demo-placeholder')!;
    // Clear transforms before measuring so refreshes never accumulate offsets.
    gsap.set([...rows, ...marks, route, placeholder], { clearProps: 'all' });
    sequence = gsap.timeline({ paused: true, onUpdate: renderState });
    sequence.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 3.4, ease: 'none' }, 0)
      .fromTo(placeholder, { autoAlpha: 1 }, { autoAlpha: 0, duration: .3 }, .15)
      .fromTo(route, { strokeDasharray: route.getTotalLength(), strokeDashoffset: route.getTotalLength(), opacity: 1 }, { strokeDashoffset: 0, duration: 2.6, ease: 'none' }, .2);
    const root = demo.getBoundingClientRect();
    marks.forEach((mark, index) => {
      const from = mark.getClientRects()[0] ?? mark.getBoundingClientRect();
      const to = rows[index].querySelector('dd')!.getBoundingClientRect();
      const token = document.createElement('span');
      token.dataset.demoFlight = ''; token.setAttribute('aria-hidden', 'true');
      token.textContent = mark.textContent; demo.append(token);
      const clampX = (left: number) => Math.max(18, Math.min(left - root.left, demo.clientWidth - token.offsetWidth - 18));
      const at = .2 + index * .75;
      gsap.set(token, { x: clampX(from.left), y: from.top - root.top - 5, opacity: 0, scale: .94 });
      sequence.fromTo(mark, { backgroundColor: 'transparent', color: 'inherit' }, { backgroundColor: '#d8d8ff', color: '#3036b5', duration: .22 }, at)
        .to(token, { opacity: 1, scale: 1, duration: .18 }, at)
        .to(token, { x: clampX(to.left), y: to.top - root.top - 5, duration: .8, ease: 'power3.inOut' }, at + .12)
        .to(token, { opacity: 0, scale: .96, duration: .18 }, at + .82)
        .fromTo(rows[index], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, ease: 'expo.out' }, at + .88);
    });
    sequence.progress(reduced.matches ? 1 : value);
    renderState();
  };

  const setup = () => {
    trigger?.kill(); trigger = undefined;
    buildSequence();
    demo.classList.toggle('is-reduced', reduced.matches);
    if (reduced.matches) return;
    trigger = ScrollTrigger.create({
      trigger: scenes[selected],
      start: 'top 78%', end: 'bottom 78%',
      onUpdate: self => {
        const moved = Math.abs(window.scrollY - lastScroll) > 1;
        lastScroll = window.scrollY;
        if (manual && !moved) return;
        stopPlayback();
        sequence.progress(self.progress);
      },
      onRefresh: self => buildSequence(self.progress),
    });
  };

  demo.classList.add('is-ready');
  run.hidden = false;
  demo.querySelector<HTMLElement>('[data-demo-controls]')!.hidden = false;
  demo.querySelector<HTMLElement>('[data-demo-timeline]')!.hidden = false;
  choices.forEach((choice, index) => choice.addEventListener('click', () => {
    if (selected === index) return;
    selected = index;
    scenes.forEach((scene, i) => { scene.hidden = i !== index; });
    choices.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    setup(); ScrollTrigger.refresh();
  }));
  run.addEventListener('click', () => {
    if (reduced.matches) { sequence.progress(1); return; }
    if (manual && playback && !playback.paused()) {
      playback.pause(); run.setAttribute('aria-pressed', 'false');
      run.querySelector('span')!.textContent = 'Продолжить'; return;
    }
    if (manual && playback?.paused()) {
      playback.resume(); run.setAttribute('aria-pressed', 'true'); renderState(); return;
    }
    stopPlayback(); manual = true; lastScroll = window.scrollY;
    sequence.progress(0); run.setAttribute('aria-pressed', 'true');
    playback = gsap.to(sequence, { progress: 1, duration: 5.5, ease: 'none', onComplete: () => {
      stopPlayback(); renderState();
    } });
  });
  const updatePlayback = () => {
    if (!visible || document.hidden) {
      if (manual && playback && !playback.paused()) {
        playback.pause(); run.setAttribute('aria-pressed', 'false');
        run.querySelector('span')!.textContent = 'Продолжить';
      }
    }
  };
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updatePlayback(); }, { threshold: .05 }).observe(demo);
  document.addEventListener('visibilitychange', updatePlayback);
  reduced.addEventListener('change', setup);
  setup();
}
