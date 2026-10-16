import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scrolling introduces the demo; readable steps retain their state as you move on.
export function initAIDemo() {
  const demo = document.querySelector<HTMLElement>('[data-ai-demo]');
  if (!demo) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...demo.querySelectorAll<HTMLElement>('[data-demo-scene]')];
  const choices = [...demo.querySelectorAll<HTMLButtonElement>('[data-demo-choice]')];
  const steps = [...demo.querySelectorAll<HTMLButtonElement>('[data-demo-step]')];
  const run = demo.querySelector<HTMLButtonElement>('[data-demo-run]')!;
  const title = demo.querySelector<HTMLElement>('[data-demo-title]')!;
  const status = demo.querySelector<HTMLElement>('[data-demo-status]')!;
  let selected = 0;
  let stage = 0;
  let started = false;
  let playing = false;
  let visible = false;
  let timer: gsap.core.Tween | null = null;
  let transition: gsap.core.Timeline | null = null;

  const updateButton = () => {
    run.querySelector('span')!.textContent = playing ? 'Пауза' : stage === 3 ? 'Повторить разбор' : stage === 0 ? 'Смотреть разбор' : 'Продолжить';
  };
  const stop = () => { timer?.kill(); timer = null; playing = false; updateButton(); };
  const show = (index: number, animate = true) => {
    transition?.kill(); stage = index;
    const scene = scenes[selected];
    const rows = [...scene.querySelectorAll<HTMLElement>('[data-result]')];
    const values = rows.map(row => row.querySelector<HTMLElement>('.demo-value')!);
    const marks = [...scene.querySelectorAll<HTMLElement>('[data-source]')];
    const route = scene.querySelector<SVGPathElement>('.demo-route__signal')!;
    const copies = [
      ['AI читает сообщение', 'В одной реплике ищет три вещи: что сделать, кто отвечает и когда нужен результат.'],
      ['Находит, что нужно сделать', `«${marks[0].textContent}» — это действие. Оно попадает в поле «Что сделать».`],
      ['Находит ответственного и срок', `${marks[1].textContent} · ${marks[2].textContent}. Эти данные взяты из того же сообщения.`],
      ['Черновик готов к проверке', 'Задача, ответственный и срок собраны. Человек проверяет детали перед работой.'],
    ];
    title.textContent = copies[index][0]; status.textContent = copies[index][1];
    steps.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    demo.classList.toggle('is-complete', index === 3);
    gsap.set([...values, route], { clearProps: 'all' });
    const fresh: HTMLElement[] = [];
    rows.forEach((row, i) => {
      const filled = index >= (i === 0 ? 1 : 2);
      if (filled && !row.classList.contains('is-filled')) fresh.push(values[i]);
      row.classList.toggle('is-filled', filled);
      values[i].setAttribute('aria-hidden', String(!filled));
      row.querySelector('.demo-await')!.setAttribute('aria-hidden', String(filled));
      marks[i].classList.toggle('is-found', filled);
    });
    const draw = index / 3;
    gsap.set(route, { opacity: 1, strokeDasharray: route.getTotalLength(), strokeDashoffset: route.getTotalLength() * (1 - draw) });
    if (animate && !reduced.matches && fresh.length) {
      transition = gsap.timeline().fromTo(fresh, { opacity: .2, y: 8, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .55, stagger: .12, ease: 'expo.out', clearProps: 'all' });
    }
    updateButton();
  };
  const schedule = () => {
    timer?.kill(); timer = null;
    if (!playing || !visible || document.hidden) return;
    timer = gsap.delayedCall(2.8, () => {
      show(Math.min(stage + 1, 3));
      if (stage === 3) stop(); else schedule();
    });
  };
  const play = () => {
    started = true;
    if (reduced.matches) { show(3, false); return; }
    if (stage === 3) show(0);
    playing = true; updateButton(); schedule();
  };
  demo.classList.add('is-ready');
  demo.querySelectorAll<HTMLElement>('[data-demo-controls]').forEach(control => { control.hidden = false; });
  run.hidden = reduced.matches;
  choices.forEach((choice, index) => choice.addEventListener('click', () => {
    if (selected === index) return;
    stop(); started = true; selected = index;
    scenes.forEach((scene, i) => { scene.hidden = i !== index; });
    choices.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    show(reduced.matches ? 3 : 0, false);
    ScrollTrigger.refresh();
  }));
  steps.forEach((button, index) => {
    const select = () => { stop(); started = true; show(index); };
    button.addEventListener('click', select);
    button.addEventListener('keydown', event => {
      const target = event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : undefined;
      if (target === undefined) return;
      event.preventDefault(); stop(); started = true; show(target); steps[target].focus({ preventScroll: true });
    });
  });
  run.addEventListener('click', () => { started = true; if (playing) stop(); else play(); });
  new IntersectionObserver(entries => {
    const entry = entries[0];
    visible = entry.isIntersecting && entry.intersectionRatio >= .15;
    if (!started && entry.intersectionRatio >= .45 && !reduced.matches) play();
    else schedule();
  }, { threshold: [0, .15, .45] }).observe(demo);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => {
    stop(); run.hidden = reduced.matches;
    if (reduced.matches) { started = true; show(3, false); }
  });
  show(reduced.matches ? 3 : 0, false);
}
