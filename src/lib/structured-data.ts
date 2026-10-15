export const siteUrl = 'https://kirillbaryev.ru/';
export const personId = `${siteUrl}#person`;

interface PageData {
  title: string;
  description: string;
  canonical: string;
  image: string;
  isHome: boolean;
  extra: Record<string, unknown>[];
}

export function pageStructuredData({ title, description, canonical, image, isHome, extra }: PageData) {
  const pageId = `${canonical}#webpage`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite', '@id': `${siteUrl}#website`,
        name: 'Кирилл Барыев', url: siteUrl, inLanguage: 'ru-RU',
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person', '@id': personId,
        name: 'Кирилл Барыев', url: siteUrl,
        description: 'Проектирую и запускаю сайты, Telegram-ботов, CRM-интеграции и AI-системы для бизнеса.',
        sameAs: ['https://t.me/tori2k', 'https://github.com/tori2k'],
        knowsAbout: ['Разработка сайтов', 'Telegram-боты', 'CRM-интеграции', 'AI-ассистенты', 'Автоматизация'],
        mainEntityOfPage: { '@id': `${siteUrl}#webpage` },
      },
      {
        '@type': isHome ? 'ProfilePage' : 'WebPage', '@id': pageId,
        url: canonical, name: title, description, inLanguage: 'ru-RU',
        isPartOf: { '@id': `${siteUrl}#website` },
        author: { '@id': personId },
        ...(isHome ? { mainEntity: { '@id': personId }, mentions: extra.map(node => ({ '@id': node['@id'] })) } : {}),
        primaryImageOfPage: { '@type': 'ImageObject', '@id': `${siteUrl}#preview-image`, url: image, contentUrl: image },
      },
      ...extra,
    ],
  };
}

// A future title or description must not be able to close its JSON-LD script.
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
