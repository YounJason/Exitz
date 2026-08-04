// @ts-ignore
import { defineCollection, z } from 'astro:content';

const exitCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    serviceName: z.string(),
    domain: z.string(),
    pubDate: z.date(),
  }),
});

const privacyCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = {
  blog: exitCollection,
  privacy: privacyCollection,
};