import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const help = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/help" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { help };