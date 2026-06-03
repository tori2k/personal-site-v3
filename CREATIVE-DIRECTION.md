# CREATIVE DIRECTION — kirillbaryev.ru
## Ребрендинг: «design engineer, Linear-tier»

> Статус: **концепция на утверждение**. Код не трогается до approve.
> Ветка: `rebrand/linear-glass-3d`
> Дата: 2026-06-03

---

## 0. Принятые решения (зафиксировано с заказчиком)

| Решение | Значение |
|---|---|
| Позиционирование | Дизайн-инженер уровня Linear (сайт = доказательство навыка) |
| Визуальная основа | Тёмная (#06070D) + glassmorphism + aurora-свет |
| Оффер | **«Разработка лендингов и автоматизаций»** (вместо «Лендинг за 72 часа») |
| Цены | Лендинг **35 000 ₽** / Лендинг+ **55 000 ₽** / Система+автоматизация **100 000+ ₽** |
| Резать текст | Агрессивно: About+Stack → слить, Process → иконки, FAQ 7→4, текст→числа |
| Блог | **Убрать полностью** (главная + /blog/ + Nav) |
| Карта секций | 10 → 7 (см. ниже) |

### Карта секций (новая)
1. **Hero** — оффер + 3D refraction-объект
2. **Подход** (бывш. About+Stack слиты) — фото + 3 числа, минимум текста
3. **Portfolio** — 3D-рамки кейсов (главное доказательство)
4. **Templates** — вынесен на главную, 3D-витрина (козырь)
5. **Process** — 4 иконки-шага, по 1 строке
6. **Pricing** — 3 тарифа
7. **FAQ** — 4 вопроса
8. **FinalCta**
9. **Footer** (без блога)

---

## 1. MOOD / настроение бренда

**Одна фраза:** «Тихая дорогая уверенность инженера, который не кричит».

Вектор: Linear × Vercel × Apple Liquid Glass. Метафора — **приборная панель / оптический инструмент**. Эмоция клиента: «это другой уровень, я в надёжных руках».

ДНК-почерк, который остаётся: кинетическая Unbounded-типографика, mono-микротекст, маркер `(+)`, лого `◐`, blend-difference курсор, плёночное зерно.

---

## 2. ЦВЕТОВАЯ СИСТЕМА

```css
/* ОСНОВА (тёмная) */
--bg-void:        #06070D;   /* почти чёрный, чуть синий */
--bg-deep:        #0A0C16;   /* секции-слои */
--bg-elevated:    #11131F;   /* приподнятые поверхности */
--ink:            #F4F6FB;   /* основной текст (не чисто белый) */
--ink-muted:      #8A90A6;   /* вторичный */
--ink-faint:      #4A4F63;   /* mono-метки */

/* AURORA-СВЕТ (источники света, не заливка) */
--aurora-cyan:    #5FC6FF;
--aurora-violet:  #A280FF;
--aurora-magenta: #FF6EC7;

/* СТЕКЛО (токены из glass3d.dev) */
--glass-tint:     hsl(225 40% 12% / 0.45);
--glass-blur:     blur(32px) brightness(0.9) saturate(1.8);
--glass-edge:     inset 0 1px 0 rgba(255,255,255,0.18);
/* --glass-shadow: 7-ступенчатая тень, см. секцию Tech */

/* ЧЕЛОВЕЧЕСКИЙ акцент (наследие ЧТИВО) */
--signal-warm:    #A22E1F;   /* метки реальных кейсов среди холода */
```

**Дисциплина цвета:** 90% экрана — тёмная база и стекло. Aurora-свет — **максимум 1 источник на секцию**.

---

## 3. ТИПОГРАФИКА

Оставляем ДНК, добавляем свет:
- **Unbounded** (display) — заголовки, oversized `clamp(64px,14vw,220px)`, теперь с text-glow от aurora, italic-light `em` акценты.
- **Inter** (body) — `--ink` вместо чёрного.
- **JetBrains Mono** — mono-метки, «приборные координаты».

Новый приём: **«glass over oversized type»** — стеклянные панели плывут поверх гигантского заголовка, текст под ними размывается/насыщается.

---

## 4. ПРИНЦИПЫ 3D

Философия: **глубина = свет, не полигоны**. Тяжёлый WebGL — только в hero.

| Уровень | Где | Технология | Вес |
|---|---|---|---|
| Tier 1 (настоящий 3D) | Hero | Three.js/R3F refraction-тело | ~150-250 КБ lazy + fallback |
| Tier 2 (CSS 3D) | Portfolio, Pricing | perspective + rotateX/Y + translateZ | ~0 КБ |
| Tier 3 (glass) | Везде | backdrop-filter + inset-блики + тень-стек | ~0 КБ |

---

## 5. ПРИНЦИПЫ ИЗОБРАЖЕНИЙ

«Скриншоты как объекты в пространстве» — реальные скриншоты кейсов вставляются в стеклянные/металлические рамки-девайсы, парят в 3D с aurora-подсветкой сзади. Генерируем НЕ скриншоты (они реальные), а обрамление и атмосферу.

---

## 6. ПРИНЦИПЫ MOTION / SCROLL

База — **60fps-only**: анимируем только `transform / opacity / filter`. Каждая анимация уважает `prefers-reduced-motion`.

Активируем мёртвый стек: `framer-motion` (уже стоит, 0 использований) + добавляем **Lenis** (инерционный smooth-scroll).

Иерархия motion (источники вдохновения помечены):
1. `60fps-style scroll reveal` — blur-in + translateY + стаггер
2. `Glass 3D card float` — карты парят/наклоняются на курсор
3. `Parallax depth layers` — фон медленнее переднего плана
4. `Magnetic hover` — CTA притягиваются к курсору
5. `Numeric counter roll` — метрики одометром
6. `Liquid glass blur transition` — стекло «наплывает» на входе
7. `Hero 3D refraction` — флагман (один, дорогой)

Дисциплина: одновременно ≤2-3 motion-слоя на экране.

---

# ПОСЕКЦИОННЫЙ ПЛАН

Для каждой секции: маркетинговая цель · что понять · визуальная идея · композиция · изображения (с промтами) · 3D (с промтами) · scroll-анимация (с источником) · frontend-план.

---

## СЕКЦИЯ 1 — HERO

**Маркетинговая цель:** за 3 секунды доказать «это другой уровень» и дать оффер.
**Что понять:** «Кирилл — инженер, который делает лендинги И автоматизации на уровне топ-продуктов».
**Визуальная идея:** гигантский заголовок на космическом фоне; перед ним парит преломляющее стеклянное тело, сквозь которое заголовок/код виден искажённым. Метафора: «превращаю сложное в чистое и прозрачное».

**Композиция:**
- Фон: --bg-void + одно aurora-свечение (cyan→violet) сверху-справа, сильно размытое.
- Z-слой 1 (зад): oversized H1 «Разработка / *лендингов* / и автоматизаций» (3 строки, кинетика сохраняется).
- Z-слой 2 (центр): 3D refraction-объект (стеклянная линза/призма), реагирует на курсор+скролл.
- Z-слой 3 (перед): glass-панель с оффер-текстом + 2 CTA + live-бейдж.
- Низ: 4 метрики в стеклянных капсулах (counter-roll), marquee.

**Новый текст:**
- Бейдж: «Беру 2 проекта в июнь» (обновить месяц / сделать динамическим)
- H1: «Разработка *лендингов* и автоматизаций.»
- Подзаголовок: «Собираю сайты под заявки и системы, которые работают без вас: оплаты, заявки в Telegram, админка, интеграции. Чистый код, скорость, ваши исходники.»
- CTA: `(+) Получить разбор` → t.me/tori2k · `Смотреть работы` → #work
- Метрики: 7+ проектов · 98 Lighthouse · <1с загрузка · 0₽ хостинг

### Изображение HERO-1: aurora-фон
- **purpose:** атмосферный фон, источник света для всей секции
- **placement:** фон Hero, position fixed/absolute, z-0
- **aspect ratio:** 16:9 (desktop), отдельный 9:16 кроп для mobile
- **style:** abstract, cinematic, dark, premium tech (Linear/Vercel aesthetic)
- **subject:** soft aurora light gradient, no objects, pure atmospheric glow
- **composition:** light source top-right, fading into deep void bottom-left, generous negative space
- **lighting:** volumetric, soft bloom, cyan-to-violet-to-magenta aurora
- **background:** near-black #06070D deep space
- **color palette:** #06070D base, #5FC6FF cyan, #A280FF violet, #FF6EC7 magenta accents
- **details:** subtle film grain, faint star-like particles, no text, no UI, ultra-clean
- **negative prompt:** no blobs, no rainbow, no oversaturation, no people, no logos, no busy patterns, no stock-3D-render look, no neon clutter

### 3D-ассет HERO-3D: преломляющая стеклянная линза
- **purpose:** флагманский «wow, как он это сделал» — прямая продажа навыка
- **object/scene:** abstract glass lens/prism floating in space, refracts the background and H1 text behind it; soft rounded edges, optical-grade clarity
- **materials:** physically-based glass (transmission 1.0, IOR ~1.5, roughness 0.05, thin dispersion for chromatic edge), subtle aurora reflection on surface
- **camera angle:** front, slight 3/4, centered, slow idle drift
- **lighting:** single key aurora light (cyan/violet) + soft rim light; HDRI minimal dark studio
- **animation states:** (a) idle: slow rotation/float; (b) on mouse: parallax tilt toward cursor; (c) on scroll: scale down + drift up as user scrolls past
- **scroll behavior:** scale 1→0.6, opacity 1→0, translateY 0→-120px over first 80vh of scroll
- **export format:** glb (Draco-compressed) OR procedural R3F mesh (предпочтительно procedural — нет ассета для загрузки, чище)
- **optimization notes:** lazy-load three.js chunk after LCP; render at devicePixelRatio capped 1.5; pause RAF when offscreen (IntersectionObserver); static glass-image fallback (PNG) for mobile/low-end/reduced-motion

### Scroll-анимация HERO (детально)
- **источник вдохновения:** «Hero 3D refraction» + «60fps-style scroll reveal»
- **trigger:** window scroll (passive listener) + useScroll (framer-motion)
- **start/end range:** 0 → 80vh скролла
- **movement:** H1 translateY 0→-40px (parallax медленнее); 3D-объект translateY 0→-120px (быстрее = глубина)
- **scale/rotation/opacity:** H1 scale 1→0.9, opacity 1→0.3; 3D scale 1→0.6, opacity 1→0
- **easing:** linear-to-scroll (привязка к прогрессу, не time-based), сглаживание через Lenis-инерцию
- **desktop:** полный 3D + parallax + cursor-tilt
- **mobile:** 3D заменён статичным PNG glass-render; parallax ослаблен (translateY множитель ×0.4); cursor-эффекты off
- **fallback (слабое устройство):** detect через navigator.hardwareConcurrency<4 или reduced-motion → статичный PNG, никакого three.js
- **проверка UX:** скролл должен оставаться 60fps (DevTools Performance); заголовок читаем на всех стадиях; CTA не перекрывается 3D-объектом; нет layout shift (3D в absolute-слое)

### Frontend-план HERO
- `Hero.astro` → обёртка статична (SSR), 3D-объект в отдельном React-острове `<HeroScene client:visible />` (R3F), lazy.
- Lenis инициализируется в Layout, прокидывает scroll-прогресс.
- Aurora-фон — CSS radial-gradient + опционально сгенерированный PNG поверх (мягче).
- Метрики — React-остров с counter-roll (framer-motion `useInView` + animate).
- Marquee — оставить CSS (уже есть, работает).
- Glass-панель оффера — CSS glass-токены (Tier 3).

---

## СЕКЦИЯ 2 — ПОДХОД (бывш. About + Stack, слиты)

**Маркетинговая цель:** доверие к личности + снятие тех-возражений ОДНИМ блоком вместо двух.
**Что понять:** «Один инженер, делает руками на чистом коде, результат измерим (числа), код остаётся у тебя».
**Визуальная идея:** слева — фото Кирилла в стеклянной рамке с aurora-подсветкой; справа — НЕ текст, а 3 гигантских числа в glass-капсулах (приборная панель) + 3 строки-выгоды.

**Композиция:**
- Сетка `1fr 1.2fr`, sticky-фото слева.
- Фото `kirill.jpg` в glass-frame, лёгкий 3D-наклон на курсор.
- Справа: H2 «Один инженер. *Весь стек.*» + 3 числа: **98** LIGHTHOUSE · **7+** ПРОЕКТОВ · **<1с** ЗАГРУЗКА (counter-roll, glass-капсулы) + 3 короткие строки выгод (свой код / скорость / измеримость).
- Убрать: 4 абзаца «ценностей» About + 3 бенефита Stack + цитату + чипы стека (стек → одна свёрнутая строка «Astro · TS · Tailwind · React» внизу).

**Текст (резать жёстко):**
- H2: «Один инженер. *Весь стек.*»
- Лид (1 предложение): «Делаю сайты и автоматизации на чистом коде — без конструкторов, с измеримым результатом и исходниками, которые остаются у вас.»
- 3 числа (см. выше)
- Стек-строка (mono, мелко): «Astro · TypeScript · Tailwind · React · Google Sheets · Т-Касса»

### Изображение ПОДХОД-1: aurora-подсветка под фото
- **purpose:** оторвать портрет от фона, дать премиальную глубину
- **placement:** за стеклянной рамкой фото, blur, z-0
- **aspect ratio:** 4:5 (под фото-рамку)
- **style:** soft aurora glow, abstract
- **subject:** diffuse cyan-violet light pool
- **composition:** centered glow behind subject area
- **lighting:** soft, low-intensity, single source
- **background:** #0A0C16
- **color palette:** #5FC6FF + #A280FF muted
- **details:** very subtle, must not compete with portrait
- **negative prompt:** no hard edges, no objects, no text, no oversaturation

### 3D-ассет ПОДХОД: НЕТ (Tier 2 CSS-only)
Только CSS 3D: фото-рамка `perspective` + `rotateY` на mousemove (±6deg), glass-капсулы чисел с inset-бликами. Никакого WebGL — экономим бюджет для hero.

### Scroll-анимация ПОДХОД
- **источник:** «60fps-style scroll reveal» + «Numeric counter roll» + «Glass 3D card float»
- **trigger:** IntersectionObserver / whileInView (threshold 0.3)
- **start/end:** при входе секции во вьюпорт
- **movement:** фото reveal слева (translateX -32→0), числа стаггер снизу (translateY 24→0, delay i×0.12s)
- **scale/rotation/opacity:** opacity 0→1, blur(8px)→0; числа counter-roll 0→target
- **easing:** cubic-bezier(.22,1,.36,1) / spring
- **desktop:** + cursor-tilt фото-рамки
- **mobile:** cursor-tilt off, reveal сохраняется
- **fallback:** reduced-motion → мгновенное появление, числа сразу финальные
- **проверка UX:** числа не «прыгают» layout (зарезервировать ширину); фото не перекрывает текст на узких экранах (сетка → колонка)

### Frontend-план ПОДХОД
- Слить `About.astro` + `Stack.astro` → новый `Approach.astro`. Старые удалить, импорты в index.astro обновить.
- Counter-roll — React-остров `<StatRoll client:visible />`.
- Фото-tilt — лёгкий vanilla JS (mousemove → CSS var), без библиотек.
- Glass-капсулы — CSS-токены.

---

## СЕКЦИЯ 3 — PORTFOLIO (#work)

**Маркетинговая цель:** главное доказательство — реальные запущенные проекты.
**Что понять:** «Он уже делал это для других, и оно работает в продакшене».
**Визуальная идея:** скриншоты кейсов в стеклянных рамках-девайсах, парят в 3D-пространстве с aurora-подсветкой в цвет проекта. Наклон на курсор.

**Композиция:**
- H2 «Главные *проекты*» + лид (1 строка).
- 2 крупных кейса (Manifik, Знамя Труда) — большие glass-frame со скриншотом, чередование лево/право.
- Диптих ЧТИВО — два фото в стекле (фикс оборванной фразы).
- CTA на карточках: `(+) Открыть сайт`.

### Изображение PORTFOLIO-1..3: aurora-подсветка кейсов (×3, в цвет проекта)
- **purpose:** оторвать скриншот от фона, дать «объект в пространстве»
- **placement:** за стеклянной рамкой скриншота, blur, z-0
- **aspect ratio:** 16:10 под рамку
- **style:** soft aurora glow, цвет под проект (Manifik=violet, Знамя=cyan, ЧТИВО=warm #A22E1F)
- **subject:** diffuse colored light pool
- **lighting:** single soft source за девайсом
- **background:** #0A0C16
- **negative prompt:** no objects, no text, no hard edges, must not compete with screenshot

### 3D-ассет PORTFOLIO: Tier 2 CSS 3D (без WebGL)
- Glass-frame скриншота: `perspective(1000px)` + `rotateY` на mousemove (±5deg) + `translateZ` слои (рамка/скрин/блик).
- export: нет ассета, чистый CSS+DOM.
- optimization: только transform, will-change на hover.

### Scroll-анимация PORTFOLIO
- **источник:** «Glass 3D card float» + «60fps-style scroll reveal» + «Parallax depth layers»
- **trigger:** whileInView (threshold 0.25), стаггер i×0.1s
- **movement:** карта reveal (translateY 32→0, blur 8→0); внутри — параллакс: скриншот двигается медленнее рамки на скролле (depth)
- **scale/rotation/opacity:** opacity 0→1; на курсор rotateY ±5deg
- **easing:** spring / cubic-bezier(.22,1,.36,1)
- **desktop:** full 3D-tilt + parallax
- **mobile:** tilt off, reveal + лёгкий parallax
- **fallback:** reduced-motion → плоские карты, мгновенно
- **проверка UX:** скриншот читаем, tilt не мешает клику, нет CLS (рамки фикс-размера)

### Frontend-план PORTFOLIO
- `Portfolio.astro` — структура остаётся, переверстать под glass-frame.
- Tilt — vanilla JS (mousemove → CSS var), без библиотек.
- Скриншоты → конвертировать в webp (astro:assets `<Picture>`), lazy.
- Фикс текста: «Место попало в, вдохновился» → дописать.

---

## СЕКЦИЯ 4 — TEMPLATES (вынесен на главную) #templates

**Маркетинговая цель:** козырь — показать вкус и диапазон, дать клиенту выбрать направление.
**Что понять:** «Я не делаю один шаблон — я владею 6 дизайн-языками, выбери свой».
**Визуальная идея:** интерактивная 3D-карусель/витрина из 6 стеклянных карт-превью стилей; на hover карта поднимается и подсвечивается своим цветом.

**Композиция:**
- H2 «Шесть *направлений*» + лид «Выбираете стиль — беру за основу под ваш бренд».
- Горизонтальная лента из 6 glass-карт (Aurora, Premium, Dark SaaS, Brutalism, Editorial, Y2K), каждая со своей палитрой-swatch.
- CTA: `(+) Смотреть все шаблоны` → /templates/.

### Изображение TEMPLATES: нет (карты используют свои палитры/превью)
Опционально — мини-превью каждого шаблона (webp-скриншот его демо). Промт не нужен, это реальные скрины.

### 3D-ассет TEMPLATES: Tier 2 CSS 3D
- 6 карт в `perspective`-контейнере, на hover `translateZ(40px) rotateX(-4deg)` + glow в цвет.
- «Card lift / press» (60fps-source): hover поднимает, press проседает.

### Scroll-анимация TEMPLATES
- **источник:** «Card lift / press» + «Staggered list cascade» + «Magnetic hover»
- **trigger:** whileInView, стаггер i×0.08s
- **movement:** карты въезжают волной снизу (translateY 40→0)
- **scale/rotation/opacity:** hover scale 1.03 + translateZ; opacity 0→1
- **easing:** spring
- **desktop:** full lift + magnetic + горизонтальный drag-scroll
- **mobile:** свайп-лента (scroll-snap), tilt off
- **fallback:** reduced-motion → статичная сетка
- **проверка UX:** ленты не ломают вертикальный скролл (touch-action), карты кликабельны

### Frontend-план TEMPLATES
- Новый компонент `TemplatesShowcase.astro` на главной (данные из существующих 6 шаблонов).
- Горизонтальный scroll-snap + drag (vanilla или framer-motion drag).
- Glass-карты — CSS-токены.

---

## СЕКЦИЯ 5 — PROCESS (#process)

**Маркетинговая цель:** снять страх «как это будет», показать простоту.
**Что понять:** «4 понятных шага, первый — бесплатный».
**Визуальная идея:** 4 иконки-шага на горизонтальной светящейся линии (как timeline на приборной панели). МИНИМУМ текста.

**Композиция:**
- H2 «Быстро, *без хаоса*».
- 4 шага: иконка + номер + заголовок (2-3 слова) + 1 строка. Соединены aurora-линией с движущейся точкой.
- Шаги: 01 Разбор (бесплатно) · 02 Структура · 03 Сборка · 04 Запуск.

**Текст (резать до 1 строки на шаг):**
- 01 Разбор · «Смотрю нишу и конкурентов, говорю что нужно. Бесплатно.»
- 02 Структура · «Собираю оффер и скелет страницы в тот же день.»
- 03 Сборка · «Живой сайт на тестовом домене за 1-4 дня.»
- 04 Запуск · «Переношу на ваш домен, передаю исходники.»

### Изображение/3D PROCESS: нет
Иконки — inline SVG (line-style, aurora-stroke). Линия — CSS-градиент + анимированная точка.

### Scroll-анимация PROCESS
- **источник:** «60fps-style scroll reveal» + «Staggered list cascade»
- **trigger:** whileInView, стаггер i×0.12s
- **movement:** шаги появляются слева направо (translateX -20→0), точка бежит по линии
- **scale/opacity:** opacity 0→1, blur 6→0
- **easing:** cubic-bezier(.22,1,.36,1)
- **desktop:** горизонтальная линия + бегущая точка
- **mobile:** вертикальная линия, шаги стопкой
- **fallback:** reduced-motion → статика
- **проверка UX:** на mobile не сжимать в нечитаемую строку

### Frontend-план PROCESS
- `Process.astro` — переверстать в timeline. Текст сократить. Иконки SVG inline.

---

## СЕКЦИЯ 6 — PRICING (#pricing)

**Маркетинговая цель:** показать линейку, заякорить ценность, снять риск бесплатным разбором.
**Что понять:** «От 35к за лендинг до 100к+ за систему с автоматизацией. Первый разбор бесплатно».
**Визуальная идея:** 3 стеклянные карты-тарифа, средняя (Лендинг+) приподнята и подсвечена aurora как «основной выбор». Premium-карта — самая яркая aurora.

**Композиция:**
- H2 «Сколько *стоит* запуск.» + лид.
- 3 glass-карты: **Лендинг 35 000 ₽** · **Лендинг+ 55 000 ₽** (featured, aurora) · **Система+автоматизация 100 000+ ₽**.
- CTA на каждой: `(+) Получить оценку` → t.me/tori2k.
- Нота: «Можно начать без оплаты — разберу нишу бесплатно».

**Тарифы (новые):**
- **Лендинг — 35 000 ₽** (2-3 дня): одна страница, заявки в Telegram, свой домен, адаптив, неделя правок.
- **Лендинг+ — 55 000 ₽** (1-2 недели, featured): всё из Лендинга + кейсы/цены/FAQ, квиз-квалификация, SEO, аналитика (Метрика+GA), заявки в таблицу.
- **Система+автоматизация — 100 000+ ₽** (2-4 недели): многостраничник, админка, онлайн-оплаты, автоматизации (боты, интеграции, уведомления, CRM), запись клиентов.

### 3D-ассет PRICING: Tier 2 CSS 3D
- Карты: hover «card lift» translateY -6px + glow. Featured — постоянный лёгкий float.

### Scroll-анимация PRICING
- **источник:** «60fps-style scroll reveal» + «Card lift / press» + «Glass 3D card float»
- **trigger:** whileInView, стаггер i×0.1s
- **movement:** карты reveal снизу; featured — постоянный float (translateY ±4px loop)
- **scale/opacity:** hover translateY -6px + scale 1.02; opacity 0→1
- **easing:** spring
- **desktop:** full lift + glow
- **mobile:** карты стопкой, float off (батарея)
- **fallback:** reduced-motion → статика, float off
- **проверка UX:** featured-карта явно выделена, цены читаемы, CTA не перекрыты

### Frontend-план PRICING
- `Pricing.astro` — с 4 тарифов на 3, новые цены/составы, glass-карты тёмные.
- Aurora-featured — CSS-градиент-бордер + glow.

---

## СЕКЦИЯ 7 — FAQ (#faq)

**Маркетинговая цель:** снять оставшиеся возражения коротко.
**Что понять:** ответы на 4 главных страха.
**Визуальная идея:** glass-аккордеон, минимум, без простыней.

**Композиция:**
- H2 «Частые *вопросы*» + подзаголовок (написать в TG).
- 4 вопроса (срезать с 7), glass-details.

**4 вопроса (отобрать сильнейшие):**
1. «Что я получу бесплатно до оплаты?» (разбор)
2. «Я не программист — смогу сам вести?» (Google Sheets/админка)
3. «Можно ли онлайн-оплаты и автоматизации?» (Т-Касса, боты, интеграции — усилить под новый оффер)
4. «У меня уже есть сайт, хочу редизайн?» (перенос входит)

Убрать: вопросы про хостинг-детали, «не начнёт приносить заявки», «где жить» (закрываются визуалом/другими секциями).

### 3D/изображения FAQ: нет
Только glass-details + rotate-иконка (есть).

### Scroll-анимация FAQ
- **источник:** «60fps-style scroll reveal» + «Liquid glass blur transition»
- **trigger:** whileInView, стаггер i×0.05s
- **movement:** вопросы reveal снизу; раскрытие details — height-плавно (max-height/grid trick, не layout-jump)
- **easing:** cubic-bezier(.22,1,.36,1)
- **desktop/mobile:** одинаково
- **fallback:** reduced-motion → мгновенно
- **проверка UX:** раскрытие без скачка layout, иконка-индикатор понятна

### Frontend-план FAQ
- `Faq.astro` — срезать до 4, glass-стиль. Раскрытие через grid-rows trick (без CLS).

---

## СЕКЦИЯ 8 — FINAL CTA (#contact)

**Маркетинговая цель:** финальный захват, один путь — Telegram.
**Что понять:** «Один шаг: написать и получить план бесплатно».
**Визуальная идея:** гигантский заголовок со свечением, одна glass-CTA с magnetic-эффектом, aurora-glow снизу.

**Композиция:**
- H2 «Получите план *вашего сайта.*» (oversized, glow).
- Лид (1-2 строки).
- 1 CTA: `(+) Получить разбор` → t.me/tori2k (magnetic).

### 3D PRICING: нет (CSS glow)
### Scroll-анимация FINAL CTA
- **источник:** «Magnetic / gravity hover» + «Blur-in focus»
- **trigger:** whileInView
- **movement:** заголовок blur-in; CTA магнитится к курсору (±8px), возврат spring
- **easing:** spring
- **desktop:** magnetic on
- **mobile:** magnetic off, обычная кнопка
- **fallback:** reduced-motion → статика
- **проверка UX:** magnetic не «убегает» от тапа

### Frontend-план FINAL CTA
- `FinalCta.astro` — тёмный фон, glow, magnetic-кнопка (vanilla JS, mousemove → transform).

---

## FOOTER

- Убрать колонку/ссылки блога.
- Тёмный фон, mono-текст, лого `◐`.
- Оставить: Работы, Цены, FAQ, Telegram, GitHub.
- Фикс: «© 2026 Кирилл Барыев».

---

# СВОДНЫЕ СПИСКИ

## A. Все нужные изображения (генерация)
| # | Имя | Назначение | AR | Приоритет |
|---|---|---|---|---|
| 1 | hero-aurora-bg | фон Hero | 16:9 + 9:16 | P0 |
| 2 | hero-glass-fallback | статичный glass-render для mobile/fallback | 1:1 | P0 |
| 3 | approach-glow | подсветка под фото | 4:5 | P1 |
| 4 | portfolio-glow-violet | подсветка Manifik | 16:10 | P1 |
| 5 | portfolio-glow-cyan | подсветка Знамя | 16:10 | P1 |
| 6 | portfolio-glow-warm | подсветка ЧТИВО | 16:10 | P1 |
| — | (скриншоты кейсов) | реальные, конвертировать в webp | — | P0 |

## B. Все 3D-ассеты
| # | Ассет | Tier | Технология | Вес |
|---|---|---|---|---|
| 1 | Hero refraction-линза | Tier 1 | R3F procedural glass | ~150-250КБ lazy |
| 2 | Portfolio glass-frames | Tier 2 | CSS perspective | 0 |
| 3 | Templates 3D-карусель | Tier 2 | CSS perspective | 0 |
| 4 | Pricing float-карты | Tier 2 | CSS | 0 |
| — | Glass-поверхности везде | Tier 3 | backdrop-filter | 0 |

## C. Все scroll-анимации
| # | Секция | Эффект | Источник |
|---|---|---|---|
| 1 | Hero | 3D refraction + parallax scale | Hero 3D refraction |
| 2 | Подход | reveal + counter-roll + tilt | 60fps reveal + counter roll |
| 3 | Portfolio | glass card float + parallax | Glass 3D card float |
| 4 | Templates | cascade + card lift + magnetic | Card lift/press |
| 5 | Process | staggered reveal + бегущая точка | Staggered cascade |
| 6 | Pricing | reveal + card lift + float | Card lift + glass float |
| 7 | FAQ | reveal + glass blur transition | Liquid glass blur |
| 8 | FinalCta | magnetic + blur-in | Magnetic hover + blur-in |
| — | Глобально | Lenis smooth-scroll, custom cursor | — |

---

# ТЕХНИЧЕСКИЙ ПЛАН ВНЕДРЕНИЯ

## Стек (что добавляем/активируем)
- ✅ Astro 5.13, React 19, Tailwind 4 — есть.
- 🔌 Активировать **framer-motion** (стоит, не используется) — motion/react для scroll/reveal/counter.
- ➕ Добавить **Lenis** (заявлен, отсутствует) — smooth-scroll.
- ➕ Добавить **three.js + @react-three/fiber + @react-three/drei** — ТОЛЬКО для Hero, lazy-chunk.
- ➕ Активировать **astro:assets** (`<Image>`/`<Picture>`) — webp/avif для всех картинок.

## Glass-токен (стартовый CSS, из glass3d.dev)
```css
.glass {
  position: relative;
  background: var(--glass-tint);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: 16px;
  box-shadow:
    0 0.75px 0.75px rgba(0,0,0,.2),
    0 2px 2px rgba(0,0,0,.18),
    0 4px 4px rgba(0,0,0,.16),
    0 8px 8px rgba(0,0,0,.14),
    0 14px 14px rgba(0,0,0,.12),
    var(--glass-edge);
}
```

## Performance-бюджет
- LCP < 1.5с (hero-текст SSR, 3D lazy после LCP).
- three.js chunk — lazy, только desktop, IntersectionObserver-pause.
- Все картинки webp/avif, lazy, fixed-размер (0 CLS).
- prefers-reduced-motion — глобальный media-query отключает всё.
- Lighthouse цель: ≥95 (сейчас 98, не уронить).

## Порядок реализации (этапы)
1. **Фундамент:** global.css → тёмная палитра + glass-токены + reduced-motion. Lenis. (проверка: сайт тёмный, скролл плавный, build ок)
2. **Активация motion:** framer-motion reveal-обёртка, counter-roll. (проверка: reveal работает, 60fps)
3. **Hero:** новый текст/оффер + aurora-фон + glass-панель. 3D-линза (R3F island, lazy, fallback). (проверка: LCP, fallback на mobile)
4. **Подход:** слить About+Stack, числа, фото-tilt. (проверка: дубли убраны)
5. **Portfolio:** glass-frames + tilt + webp + фикс текста. (проверка: CLS=0)
6. **Templates на главную:** showcase-карусель. (проверка: горизонт-скролл не ломает верт.)
7. **Process:** timeline-иконки, текст срезать.
8. **Pricing:** 3 тарифа, новые цены, glass.
9. **FAQ:** срезать до 4, glass.
10. **FinalCta + Footer:** magnetic, убрать блог.
11. **Зачистка:** удалить /blog/, BlogTeaser, photo.png, 7 лишних скриншотов, мёртвые импорты. Фикс опечаток (Барышев→Барыев, 12→6, tori2k/kirillbaryev).
12. **QA:** Lighthouse, reduced-motion, mobile, CLS, build.

---

# ЧЕКЛИСТ КАЧЕСТВА
- [ ] Каждый 3D/анимация продаёт (можно убрать без потери смысла → убрать)
- [ ] ≤2-3 motion-слоя одновременно на экране
- [ ] prefers-reduced-motion отключает всё
- [ ] 60fps в DevTools Performance (только transform/opacity/filter)
- [ ] LCP < 1.5с, Lighthouse ≥95
- [ ] CLS = 0 (картинки/3D в фикс-слоях)
- [ ] three.js только desktop + lazy + fallback
- [ ] Все картинки webp/avif + lazy
- [ ] Mobile: 3D→PNG, tilt/magnetic off, ленты свайпом
- [ ] Текст срезан (нет дублей About/Stack)
- [ ] Опечатки исправлены
- [ ] Блог удалён полностью
- [ ] Aurora ≤1 источник на секцию (не «дешёвый неон»)
- [ ] Build без ошибок, git history чистый
