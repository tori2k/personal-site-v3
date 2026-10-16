import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAIDemo() {
  const film = document.querySelector<HTMLElement>('[data-ai-demo]');
  if (!film) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const acts = [...film.querySelectorAll<HTMLElement>('[data-film-act]')];
  const chapters = [...film.querySelectorAll<HTMLButtonElement>('[data-film-chapter]')];
  const hint = film.querySelector<HTMLElement>('[data-film-scroll]')!;
  const skip = film.querySelector<HTMLButtonElement>('[data-film-skip]')!;
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
  let scroll: ScrollTrigger | null = null;
  let sequence: gsap.core.Timeline | null = null;
  let answerMotion: gsap.core.Timeline | null = null;
  const kill = () => { sequence?.kill(); answerMotion?.kill(); sequence = null; answerMotion = null; };
  const q = (selector: string) => acts[active].querySelectorAll<HTMLElement>(selector);
  const resetStyles = () => gsap.set(film.querySelectorAll('[data-motion],.voice-wave i,[data-route],[data-packet],.answer-copy,.answer-sources button'), { clearProps: 'transform,opacity,clipPath,strokeDasharray,strokeDashoffset' });

  const show = (index: number, animate = true) => {
    kill(); resetStyles(); active = index;
    acts.forEach((act, i) => { act.hidden = i !== index; });
    chapters.forEach((button, i) => { button.setAttribute('aria-pressed', String(i === index)); gsap.set(button.querySelector('i'), { scaleX: i < index ? 1 : 0 }); });
    title.textContent = captions[index][0]; description.textContent = captions[index][1];
    if (!animate || reduced.matches) { gsap.set(chapters[index].querySelector('i'), { scaleX: 1 }); return; }
    sequence = gsap.timeline({ paused: true });
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
  };
  const renderScroll = (progress: number) => {
    const position = Math.min(3.9999, Math.max(0, progress * 4));
    const index = Math.floor(position);
    if (index !== active || !sequence) show(index);
    // A reading pause at the end of every scene is part of its timeline.
    // No elapsed-time playback: the scroll position is the only playhead.
    sequence?.progress(.04 + (position - index) * .96);
  };
  const select = (index: number) => {
    if (scroll) {
      const progress = (index + .86) / 4;
      window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * progress, behavior: 'instant' });
      renderScroll(progress);
    } else show(index, false);
  };
  const setAnswer = (index: number, animate = true) => {
    question = index;
    film.querySelector('[data-film-question]')!.textContent = questions[index].question;
    film.querySelector('[data-film-answer]')!.textContent = questions[index].answer;
    sourceButtons.forEach((button, i) => { button.childNodes[0].textContent = questions[index].sources[i] + ' '; });
    questionButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (!animate || reduced.matches) return;
    answerMotion?.kill(); sequence?.progress(1); resetStyles();
    answerMotion = gsap.timeline().fromTo(acts[3].querySelector('.question-bubble'), { x: 35, opacity: .2 }, { x: 0, opacity: 1, duration: .45, ease: 'expo.out' }, 0)
      .fromTo(acts[3].querySelector('.answer-copy'), { clipPath: 'inset(0 0 100% 0)', opacity: .2 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: .8, ease: 'power2.out' }, .2)
      .fromTo(sourceButtons, { y: 8, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .4 }, .8);
  };
  film.querySelectorAll<HTMLElement>('[data-film-controls],[data-task-confirm],[data-answer-source]').forEach(control => { control.hidden = false; });
  chapters.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : undefined;
      if (next === undefined) return;
      event.preventDefault(); select(next); chapters[next].focus({ preventScroll: true });
    });
  });
  questionButtons.forEach((button, index) => button.addEventListener('click', () => setAnswer(index)));
  sourceButtons.forEach((button, index) => button.addEventListener('click', () => {
    select(question === 1 && index === 1 ? 2 : index === 1 ? 1 : 0);
    chapters[active].focus({ preventScroll: true });
  }));
  skip.addEventListener('click', () => {
    const next = film.closest('article')?.nextElementSibling as HTMLElement | null;
    if (!next) return;
    next.scrollIntoView({ block: 'start', behavior: 'instant' });
    next.tabIndex = -1; next.focus({ preventScroll: true });
  });
  const confirm = film.querySelector<HTMLButtonElement>('[data-task-confirm]')!;
  confirm.addEventListener('click', () => {
    if (confirm.getAttribute('aria-disabled') === 'true') return;
    answerMotion?.kill(); sequence?.progress(1);
    confirm.setAttribute('aria-disabled', 'true'); confirm.querySelector('span')!.textContent = 'Подтверждено в демо';
    film.querySelector('[data-task-state]')!.textContent = 'Задача подтверждена';
    film.querySelector('[data-task-note]')!.textContent = 'Человек проверил и подтвердил задачу.';
    if (!reduced.matches) gsap.fromTo(confirm, { scale: .95 }, { scale: 1, duration: .45, ease: 'expo.out' });
  });
  setAnswer(0, false);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference) and (min-height: 700px)', () => {
    hint.hidden = false; skip.hidden = false;
    show(0);
    sequence?.progress(.04);
    scroll = ScrollTrigger.create({
      trigger: film,
      start: () => `top ${Math.max(12, (window.innerHeight - film.offsetHeight) / 2)}px`,
      end: () => `+=${window.innerHeight * 3.6}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: self => renderScroll(self.progress),
      onRefresh: self => renderScroll(self.progress),
    });
    return () => {
      scroll?.kill(); scroll = null; kill(); resetStyles();
      hint.hidden = true; skip.hidden = true;
      show(3, false);
    };
  });
  if (!scroll) show(3, false);
  // Font metrics can settle after the page has already created its scroll triggers.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
