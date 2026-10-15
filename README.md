# kirillbaryev.ru

Личное портфолио Кирилла Барыева. Astro, TypeScript и GSAP; статическая публикация на GitHub Pages.

## Разработка

Node.js 22.12+.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Главная — `src/pages/index.astro`; превью проектов — `src/components/ProjectPreview.astro`; движения — `src/scripts/home-motion.ts`; базовые стили — `src/styles/studio.css`. Шрифты Onest хранятся локально с лицензией в `public/fonts/`.

`PRODUCT.md` фиксирует продуктовые ограничения, `DESIGN.md` — действующую визуальную систему. Старые `CREATIVE-DIRECTION.md` и `design-system/kirillbaryev/MASTER.md` сохранены как история.

## Проверка

`npm run check` проверяет типы, `npm run build` собирает все маршруты. `QA_BASE=http://127.0.0.1:4321 npm run qa` — отдельный Playwright smoke script для запущенного preview и установленного Chrome; проверяет маршруты, адаптив, переключение цвета и reduced motion. Он не запускается автоматически при публикации.

Фактическая проверка редизайна 2026-10-16 выполнена в браузере на 1536, 1280, 768 и 390 px: структура, изображения, ссылки, клавиатурное управление и согласие на аналитику. Reduced motion проверен по CSS/JS; системная эмуляция в этом прогоне не запускалась. Скрипт QA обновлён для новой структуры, но в этом прогоне не выполнялся.

## Публикация

Push в `main` запускает `.github/workflows/deploy.yml`: сборка `dist/`, загрузка артефакта и GitHub Pages deploy. Домен — `kirillbaryev.ru`, указан в `public/CNAME`. Сохранены privacy, 404 и отдельные информационные страницы Scratchik.

## Микроразметка и движение

JSON-LD формируется в `src/lib/structured-data.ts`. Главная — ProfilePage с Person, WebSite, тремя Service и ItemList из шести CreativeWork. Услуги берут тексты из того же массива, что и интерфейс; кейсы сохраняют видимый порядок и реальные URL. На остальных страницах — WebPage без услуг и портфолио; 404 не содержит JSON-LD. После сборки `npm run check:schema` проверяет соответствие контенту, идентификаторы, порядок и область действия. Разметка главной проверена в Schema.org Validator: без ошибок и предупреждений.

Анимации усилены: посимвольная сборка заголовка, раскрытие превью в перспективе, разъезд при прокрутке, свет и объём от курсора, магнитная реакция CTA, маски заголовков и контуры контакта. Смысловые состояния доступны с клавиатуры; пространственные эффекты отключаются при prefers-reduced-motion.
