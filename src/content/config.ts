// @ts-ignore
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    serviceName: z.string(),
    domain: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  delete: blogCollection,
};