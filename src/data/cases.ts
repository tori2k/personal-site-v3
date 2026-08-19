export type CaseStatus = 'live' | 'private' | 'unavailable' | 'permission-pending';
export type CaseVisibility = 'flagship' | 'registry';

export interface CaseScreenshot {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface StudioCase {
  slug: string;
  title: string;
  type: string;
  publicUrl?: string;
  status: CaseStatus;
  statusLabel: string;
  confirmedFacts: string[];
  contribution: string[];
  screenshots: CaseScreenshot[];
  visibility: CaseVisibility;
  permission: string;
}

export const cases: StudioCase[] = [
  {
    slug: 'znamya-truda',
    title: 'Знамя Труда',
    type: 'Сайт футбольного клуба',
    publicUrl: 'https://fczt1909.ru/',
    status: 'live',
    statusLabel: 'Сайт работает',
    confirmedFacts: [
      'Новый сайт вместо старой версии',
      'Короткий путь к заказу игровой футболки',
      'CMS для публикации новостей',
    ],
    contribution: ['Структура', 'Дизайн', 'Разработка', 'Запуск'],
    screenshots: [
      { src: '/cases/znamya-truda/hero-desktop.webp', width: 1440, height: 900, alt: 'Главный экран сайта футбольного клуба Знамя Труда' },
      { src: '/cases/znamya-truda/detail-01.webp', width: 1280, height: 964, alt: 'Матч-центр на сайте Знамя Труда' },
      { src: '/cases/znamya-truda/flow.webp', width: 1272, height: 716, alt: 'Страница предзаказа игровой футболки Знамя Труда' },
      { src: '/cases/znamya-truda/detail-02.webp', width: 1280, height: 964, alt: 'Новости клуба на сайте Знамя Труда' },
    ],
    visibility: 'flagship',
    permission: 'Публичный клиентский сайт',
  },
  {
    slug: 'goalsphere',
    title: 'GoalSphere',
    type: 'Сайт футбольного агентства',
    publicUrl: 'https://goalsphere-agency.vercel.app/',
    status: 'live',
    statusLabel: 'Публичный проект',
    confirmedFacts: [
      'Сайт реального клиентского проекта',
      'Интерактивные переходы между разделами',
      'Отдельные desktop и mobile сценарии',
    ],
    contribution: ['Концепция', 'Структура', 'Визуальная логика', 'Разработка'],
    screenshots: [
      { src: '/cases/goalsphere/hero-desktop.webp', width: 1280, height: 720, alt: 'Главная интерактивная сцена сайта GoalSphere' },
      { src: '/cases/goalsphere/hero-mobile.webp', width: 390, height: 844, alt: 'Мобильная версия главной сцены GoalSphere' },
      { src: '/cases/goalsphere/detail-01.webp', width: 1440, height: 900, alt: 'Интерфейс рабочего стола GoalSphere со списком игроков' },
      { src: '/cases/goalsphere/detail-02.webp', width: 1425, height: 891, alt: 'Раздел географии на сайте GoalSphere' },
    ],
    visibility: 'flagship',
    permission: 'Публичный клиентский сайт',
  },
  {
    slug: 'ai-project-manager',
    title: 'AI Project Manager',
    type: 'Закрытая рабочая система',
    status: 'private',
    statusLabel: 'Закрытый продукт',
    confirmedFacts: [
      '2 агентства и около 10 пользователей',
      '4 рабочих чата и еженедельные созвоны',
      'Саммари, анализ договорённостей, задачи, решения и длинная память',
    ],
    contribution: ['Продуктовая логика', 'Автоматизация', 'AI-интеграция'],
    screenshots: [],
    visibility: 'flagship',
    permission: 'Нужны обезличенные реальные скриншоты',
  },
  {
    slug: 'manifik',
    title: 'Manifik',
    type: 'Сайт школы вокала',
    publicUrl: 'https://manifik-school.ru/',
    status: 'live',
    statusLabel: 'Сайт работает',
    confirmedFacts: ['Сайт для школы вокала', 'Адаптивная версия', 'Переход к онлайн-записи'],
    contribution: ['Дизайн', 'Разработка', 'Адаптив'],
    screenshots: [
      { src: '/cases/manifik/hero-desktop.webp', width: 1600, height: 1000, alt: 'Главный экран сайта школы вокала Manifik' },
      { src: '/cases/manifik/hero-mobile.webp', width: 375, height: 812, alt: 'Мобильная версия сайта Manifik' },
      { src: '/cases/manifik/detail-01.webp', width: 1425, height: 891, alt: 'Направления обучения на сайте Manifik' },
    ],
    visibility: 'registry',
    permission: 'Публичный клиентский сайт',
  },
  {
    slug: 'tsentsova',
    title: 'Ценцова',
    type: 'Сайт арбитражного управляющего',
    publicUrl: 'https://tsentsova.ru/',
    status: 'unavailable',
    statusLabel: 'Домен сейчас не отвечает',
    confirmedFacts: ['Разработка сайта', 'Настройка Битрикс24', 'Заявки с сайта поступают в CRM'],
    contribution: ['Сайт', 'Интеграция с Битрикс24'],
    screenshots: [
      { src: '/cases/tsentsova/hero-desktop.webp', width: 1280, height: 720, alt: 'Главный экран сайта Алисы Ценцовой' },
    ],
    visibility: 'registry',
    permission: 'Использован сохранённый кадр публичной версии',
  },
  {
    slug: 'aesoqua',
    title: 'Aesoqua',
    type: 'Бартерный сайт для блогера',
    status: 'permission-pending',
    statusLabel: 'Статус публикации уточняется',
    confirmedFacts: ['Бартерный проект сайта', 'Рабочая версия собрана локально'],
    contribution: ['Концепция', 'Дизайн', 'Разработка'],
    screenshots: [],
    visibility: 'registry',
    permission: 'Нужно подтвердить публикацию и право на показ',
  },
];

export const flagshipCases = cases.filter((item) => item.visibility === 'flagship');
