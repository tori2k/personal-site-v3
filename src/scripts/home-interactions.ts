import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initAIDemo } from './ai-demo-motion';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollTo = (element: HTMLElement) => element.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });

// Case details stay in the page; the original anchors still work without JS.
let activeStory: HTMLElement | null = null;
let storyOpener: HTMLAnchorElement | null = null;
const openers = [...document.querySelectorAll<HTMLAnchorElement>('[data-case-open]')];
const closeStory = () => {
  if (!activeStory) return;
  gsap.killTweensOf(activeStory);
  activeStory.hidden = true;
  storyOpener?.setAttribute('aria-expanded', 'false');
  storyOpener?.focus({ preventScroll: true });
  if (storyOpener) scrollTo(storyOpener.closest<HTMLElement>('.stage-project')!);
  activeStory = null;
  ScrollTrigger.refresh();
};
openers.forEach(opener => {
  opener.setAttribute('aria-expanded', 'false');
  opener.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const story = document.getElementById(opener.dataset.caseOpen!);
    if (!story) return;
    event.preventDefault();
    if (activeStory === story) { closeStory(); return; }
    if (activeStory) { gsap.killTweensOf(activeStory); activeStory.hidden = true; }
    storyOpener?.setAttribute('aria-expanded', 'false');
    activeStory = story; storyOpener = opener; story.hidden = false;
    opener.setAttribute('aria-expanded', 'true');
    if (!reduced.matches) gsap.fromTo(story, { opacity: 0, y: 24, clipPath: 'inset(0 0 12% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .65, ease: 'expo.out', clearProps: 'all' });
    story.querySelector<HTMLButtonElement>('[data-case-close]')?.focus({ preventScroll: true });
    ScrollTrigger.refresh(); scrollTo(story);
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-case-close]').forEach(button => button.addEventListener('click', closeStory));
document.querySelector('[data-case-stories]')?.addEventListener('keydown', event => { if ((event as KeyboardEvent).key === 'Escape') { event.preventDefault(); closeStory(); } });
document.querySelectorAll<HTMLElement>('[data-story-gallery]').forEach(gallery => {
  const frames = [...gallery.querySelectorAll<HTMLElement>('[data-story-frame]')];
  gallery.querySelectorAll<HTMLButtonElement>('[data-story-choice]').forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    gallery.querySelectorAll('[data-story-choice]').forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    frames.forEach((frame, index) => { gsap.killTweensOf(frame); frame.hidden = index !== Number(button.dataset.storyChoice); });
    const frame = frames[Number(button.dataset.storyChoice)];
    if (!reduced.matches) gsap.fromTo(frame, { opacity: .3, clipPath: 'inset(0 12% 0 0 round 14px)', x: 16 }, { opacity: 1, clipPath: 'inset(0 0% 0 0 round 14px)', x: 0, duration: .5, ease: 'expo.out', clearProps: 'all' });
  }));
});

initAIDemo();

const journey = document.querySelector<HTMLElement>('[data-journey]');
if (journey) {
  const tabs = [...journey.querySelectorAll<HTMLButtonElement>('[data-journey-step]')];
  const panels = [...journey.querySelectorAll<HTMLElement>('[data-journey-panel]')];
  const artifacts = [...journey.querySelectorAll<HTMLElement>('[data-journey-artifact]')];
  const sheet = journey.querySelector<HTMLElement>('[data-journey-sheet]')!;
  const next = journey.querySelector<HTMLButtonElement>('[data-journey-next]')!;
  const contact = journey.querySelector<HTMLAnchorElement>('[data-journey-contact]')!;
  const line = journey.querySelector('.journey-line span');
  const notes = JSON.parse(journey.querySelector('[data-journey-notes]')!.textContent!) as string[];
  let selected = 0;
  let transition: gsap.core.Timeline | null = null;
  const show = (index: number) => {
    if (index === selected) return;
    const direction = index > selected ? 1 : -1;
    selected = index; transition?.kill();
    panels.forEach((panel,i) => { panel.hidden = i !== index; });
    artifacts.forEach((artifact,i) => { artifact.hidden = i !== index; });
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    journey.querySelector('[data-journey-count]')!.textContent = `0${index+1} / 04`;
    journey.querySelector('[data-journey-note]')!.textContent = notes[index];
    journey.querySelectorAll<HTMLElement>('.sheet-progress i').forEach((part,i) => { part.style.background = i <= index ? 'var(--accent)' : ''; });
    next.hidden = index === tabs.length-1; contact.hidden = !next.hidden;
    gsap.set([...panels, ...artifacts], { clearProps: 'all' });
    if (reduced.matches) { gsap.set(line, { scaleX: index+1 }); gsap.set(sheet, { clearProps: 'all' }); return; }
    transition = gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to(line, { scaleX: index+1, duration: .65 }, 0)
      .fromTo(panels[index], { x: 22*direction, opacity: .2 }, { x: 0, opacity: 1, duration: .5, clearProps: 'all' }, 0)
      .fromTo(sheet, { rotation: -2+direction*4, rotationY: direction*9 }, { rotation: -2, rotationY: 0, duration: .75 }, 0)
      .fromTo(artifacts[index], { y: 20, opacity: .1, clipPath: 'inset(0 0 22% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .6, clearProps: 'all' }, .05);
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => show(index));
    tab.addEventListener('keydown', event => {
      const keys: Record<string,number> = { ArrowRight: (index+1)%tabs.length, ArrowLeft: (index+tabs.length-1)%tabs.length, Home: 0, End: tabs.length-1 };
      if (!(event.key in keys)) return;
      event.preventDefault(); show(keys[event.key]); tabs[keys[event.key]].focus({ preventScroll: true });
    });
  });
  next.addEventListener('click', () => { show(Math.min(selected+1,tabs.length-1)); if (next.hidden) contact.focus({ preventScroll: true }); });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    transition?.kill(); gsap.set([...panels, ...artifacts, sheet], { clearProps: 'all' }); gsap.set(line, { scaleX: selected+1 });
  });
}
