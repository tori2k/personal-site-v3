import { gsap } from 'gsap';

export function initAIDemo() {
  const film = document.querySelector<HTMLElement>('[data-ai-demo]');
  if (!film) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const acts = [...film.querySelectorAll<HTMLElement>('[data-film-act]')];
  const chapters = [...film.querySelectorAll<HTMLButtonElement>('[data-film-chapter]')];
  const playButton = film.querySelector<HTMLButtonElement>('[data-film-play]')!;
  const title = film.querySelector<HTMLElement>('[data-film-title]')!;
  const description = film.querySelector<HTMLElement>('[data-film-description]')!;
  const questionButtons = [...film.querySelectorAll<HTMLButtonElement>('[data-film-ask]')];
  const sourceButtons = [...film.querySelectorAll<HTMLButtonElement>('[data-answer-source]')];
  const questions = JSON.parse(film.querySelector('[data-film-questions]')!.textContent!) as { question: string; answer: string; sources: string[] }[];
  const captions = [
    ['Команда общается. AI слушает.', 'Читает разрешённую переписку и разбирает записи созвонов. Решения больше не остаются в разных местах.'],
    ['Собирает память проекта.', 'Связывает новые сообщения с тем, что уже обсуждали. Сохраняет решения, договорённости и их источники.'],
    ['Превращает обсуждение в работу.', 'Готовит саммари и предлагает задачи: что сделать, кто отвечает и к какому сроку. Человек подтверждает.'],
    ['Отвечает по контексту проекта.', 'Команда задаёт вопрос. AI находит ответ в переписке, созвонах и сохранённых решениях.'],
  ];
  let active = 0;
  let question = 0;
  let autoplay = false;
  let started = false;
  let userPaused = false;
  let visible = false;
  let sequence: gsap.core.Timeline | null = null;
  let answerMotion: gsap.core.Timeline | null = null;
  const label = () => { playButton.querySelector('span')!.textContent = autoplay ? 'Пауза' : userPaused ? 'Продолжить' : active === 3 ? 'Смотреть сначала' : 'Смотреть историю'; };
  const kill = () => { sequence?.kill(); answerMotion?.kill(); sequence = null; answerMotion = null; };
  const q = (selector: string) => acts[active].querySelectorAll<HTMLElement>(selector);
  const resetStyles = () => gsap.set(film.querySelectorAll('[data-motion],.voice-wave i,[data-route],[data-packet],.answer-copy,.answer-sources button'), { clearProps: 'transform,opacity,clipPath,strokeDasharray,strokeDashoffset' });

  const syncVisibility = () => {
    const paused = !visible || document.hidden || userPaused;
    sequence?.paused(paused); answerMotion?.paused(paused);
  };
  const show = (index: number, animate = true) => {
    kill(); resetStyles(); active = index;
    acts.forEach((act, i) => { act.hidden = i !== index; });
    chapters.forEach((button, i) => { button.setAttribute('aria-pressed', String(i === index)); gsap.set(button.querySelector('i'), { scaleX: i < index ? 1 : 0 }); });
    title.textContent = captions[index][0]; description.textContent = captions[index][1];
    label();
    if (!animate || reduced.matches) { gsap.set(chapters[index].querySelector('i'), { scaleX: 1 }); return; }
    sequence = gsap.timeline({ onComplete: () => {
      if (autoplay && active < 3) show(active + 1);
      else { autoplay = false; label(); }
    } });
    const length = index === 2 ? 6.5 : index === 3 ? 7 : 5;
    sequence.fromTo(chapters[index].querySelector('i'), { scaleX: 0 }, { scaleX: 1, duration: length, ease: 'none' }, 0);
    if (index === 0) {
      sequence.from(q('[data-motion="chat"]'), { x: -120, y: 45, rotation: -16, scale: .8, opacity: 0, duration: .85, ease: 'expo.out' }, 0)
        .from(q('[data-motion="call"]'), { y: 140, rotation: 12, scale: .7, opacity: 0, duration: 1, ease: 'expo.out' }, .45)
        .from(q('[data-motion="reply"]'), { x: 130, y: -35, rotation: 10, opacity: 0, duration: .85, ease: 'expo.out' }, 1.1)
        .from(q('[data-motion="thread"]'), { scale: .4, opacity: 0, duration: 1.5, ease: 'power2.out' }, .3)
        .fromTo(q('.voice-wave i'), { scaleY: .2 }, { scaleY: 1, duration: .25, stagger: { each: .025, from: 'center' }, repeat: 5, yoyo: true, ease: 'sine.inOut' }, .8)
        .from(q('[data-motion="transcript"]'), { clipPath: 'inset(0 100% 0 0)', duration: 1.3, ease: 'none' }, 1.5);
    } else if (index === 1) {
      const path = acts[index].querySelector<SVGPathElement>('[data-route]')!;
      sequence.from(q('[data-motion="memory-source"]'), { scale: .7, opacity: 0, y: -25, stagger: .15, duration: .6, ease: 'expo.out' }, 0)
        .from(q('[data-motion="layer"]'), { rotation: 0, y: 70, scale: .8, opacity: 0, stagger: .16, duration: 1, ease: 'expo.out' }, .2)
        .from(q('[data-motion="memory-page"]'), { rotationY: -35, rotationX: 15, y: 55, scale: .8, opacity: 0, duration: 1, ease: 'expo.out' }, .5)
        .fromTo(path, { strokeDasharray: path.getTotalLength(), strokeDashoffset: path.getTotalLength() }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, .3)
        .fromTo(q('[data-packet="0"]'), { attr: { cx: 80, cy: 90 }, opacity: 0 }, { attr: { cx: 440, cy: 180 }, opacity: 1, duration: 1.2, ease: 'power2.inOut' }, .8)
        .fromTo(q('[data-packet="1"]'), { attr: { cx: 920, cy: 90 }, opacity: 0 }, { attr: { cx: 560, cy: 180 }, opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 1)
        .fromTo(q('[data-packet="2"]'), { attr: { cx: 150, cy: 330 }, opacity: 0 }, { attr: { cx: 440, cy: 250 }, opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 1.2)
        .from(q('[data-motion="fact"]'), { x: -25, opacity: 0, clipPath: 'inset(0 100% 0 0)', stagger: .3, duration: .7, ease: 'expo.out' }, 1.4)
        .from(q('[data-motion="stamp"]'), { y: 15, opacity: 0, duration: .5 }, 2.6);
    } else if (index === 2) {
      sequence.from(q('[data-motion="summary"]'), { x: 130, rotation: 12, scale: .78, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0)
        .from(q('[data-motion="task"]'), { x: -120, y: 70, rotation: -10, scale: .8, opacity: 0, duration: 1.1, ease: 'expo.out' }, .4)
        .from(q('[data-motion="summary-line"]'), { clipPath: 'inset(0 100% 0 0)', x: -10, stagger: .25, duration: .75, ease: 'expo.out' }, .6)
        .from(q('[data-motion="task-field"]'), { y: 20, opacity: 0, stagger: .2, duration: .6, ease: 'expo.out' }, 1.2);
    } else {
      sequence.from(q('[data-motion="question"]'), { x: 120, scale: .8, opacity: 0, duration: .7, ease: 'expo.out' }, 0)
        .from(q('[data-motion="answer"]'), { y: 50, rotationX: -12, opacity: 0, duration: .85, ease: 'expo.out' }, .6)
        .from(q('.answer-copy'), { clipPath: 'inset(0 0 100% 0)', opacity: .3, duration: 1.4, ease: 'power2.out' }, 1.05)
        .from(q('.answer-sources button'), { x: -15, opacity: 0, stagger: .12, duration: .5 }, 2.2);
    }
    syncVisibility();
  };
  const select = (index: number) => { started = true; autoplay = false; userPaused = false; show(index); };
  const setAnswer = (index: number, animate = true) => {
    question = index;
    film.querySelector('[data-film-question]')!.textContent = questions[index].question;
    film.querySelector('[data-film-answer]')!.textContent = questions[index].answer;
    sourceButtons.forEach((button, i) => { button.childNodes[0].textContent = questions[index].sources[i] + ' '; });
    questionButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (!animate || reduced.matches) return;
    kill(); resetStyles();
    answerMotion = gsap.timeline().fromTo(acts[3].querySelector('.question-bubble'), { x: 35, opacity: .2 }, { x: 0, opacity: 1, duration: .45, ease: 'expo.out' }, 0)
      .fromTo(acts[3].querySelector('.answer-copy'), { clipPath: 'inset(0 0 100% 0)', opacity: .2 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: .8, ease: 'power2.out' }, .2)
      .fromTo(sourceButtons, { y: 8, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .4 }, .8);
    syncVisibility();
  };
  film.querySelectorAll<HTMLElement>('[data-film-controls],[data-task-confirm],[data-answer-source]').forEach(control => { control.hidden = false; });
  playButton.hidden = reduced.matches;
  chapters.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : undefined;
      if (next === undefined) return;
      event.preventDefault(); select(next); chapters[next].focus({ preventScroll: true });
    });
  });
  playButton.addEventListener('click', () => {
    started = true;
    if (autoplay) { autoplay = false; userPaused = true; sequence?.pause(); }
    else if (userPaused && sequence) { userPaused = false; autoplay = true; syncVisibility(); }
    else { autoplay = true; userPaused = false; show(active === 3 ? 0 : active); }
    label();
  });
  questionButtons.forEach((button, index) => button.addEventListener('click', () => { autoplay = false; userPaused = false; started = true; setAnswer(index); label(); }));
  sourceButtons.forEach((button, index) => button.addEventListener('click', () => {
    select(question === 1 && index === 1 ? 2 : index === 1 ? 1 : 0);
    chapters[active].focus({ preventScroll: true });
    if (film.getBoundingClientRect().top < 16) film.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'auto' : 'smooth' });
  }));
  film.addEventListener('focusin', event => {
    if (!acts[active].contains(event.target as Node)) return;
    autoplay = false; userPaused = false; sequence?.progress(1); label();
  });
  const confirm = film.querySelector<HTMLButtonElement>('[data-task-confirm]')!;
  confirm.addEventListener('click', () => {
    if (confirm.getAttribute('aria-disabled') === 'true') return;
    autoplay = false; userPaused = false; started = true; kill(); resetStyles();
    confirm.setAttribute('aria-disabled', 'true'); confirm.querySelector('span')!.textContent = 'Подтверждено в демо';
    film.querySelector('[data-task-state]')!.textContent = 'Задача подтверждена';
    film.querySelector('[data-task-note]')!.textContent = 'В этом примере человек проверил задачу и согласовал её.';
    if (!reduced.matches) gsap.fromTo(confirm, { scale: .95 }, { scale: 1, duration: .45, ease: 'expo.out' });
    label();
  });
  new IntersectionObserver(entries => {
    const entry = entries[0]; visible = entry.isIntersecting && entry.intersectionRatio >= .12;
    if (!started && entry.intersectionRatio >= .45 && !reduced.matches) { started = true; autoplay = true; show(0); }
    syncVisibility();
  }, { threshold: [0, .12, .45] }).observe(film);
  document.addEventListener('visibilitychange', syncVisibility);
  reduced.addEventListener('change', () => { autoplay = false; userPaused = false; playButton.hidden = reduced.matches; show(reduced.matches ? 3 : active, false); });
  setAnswer(0, false); show(reduced.matches ? 3 : 0, false);
}
