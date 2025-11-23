import {defineCollection, z} from 'astro:content';

// 定义 articles 集合
const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(), // 描述是可选的
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
  }),
});

// 定义 books 集合
const booksCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    comment: z.string(),
    pubDate: z.date(),
    cover: z.string().optional(),
  }),
});

// 定义 essays 集合
const essaysCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    tag: z.string().optional(),
  }),
});

// 定义 friends 集合
const friendsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    desc: z.string(),
    link: z.string().url(),
    color: z.string().optional(),
  }),
});

export const collections = {
  'articles': articlesCollection,
  'books': booksCollection,
  'essays': essaysCollection,
  'friends': friendsCollection,
};