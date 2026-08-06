import { defineCollection, z } from "astro:content";

const exitCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    serviceName: z.string(),
    domain: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    logo: z.string().optional(),
    steps: z.array(
      z.object({
        stepNumber: z.number(),
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
        actionUrl: z.string().optional(),
        actionText: z.string().optional(),
        tip: z.string().optional(),
      })
    ),
  }),
});

const helpCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  exit: exitCollection,
  help: helpCollection,
};