import { defineCollection } from 'astro:content';

// Блог удалён при ребрендинге. Коллекций контента пока нет.
export const collections: Record<string, ReturnType<typeof defineCollection>> = {};
