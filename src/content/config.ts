import { defineCollection, z } from "astro:content";

const stepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  tip: z.string().optional(),
  actionUrl: z.string().optional(),
  actionText: z.string().optional(),
});

const tabSchema = z.object({
  id: z.string(),
  label: z.string(),
  steps: z.array(stepSchema),
});

const exitCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    serviceName: z.string(),
    domain: z.string(),
    pubDate: z.date(),
    description: z.string(),
    logo: z.string().optional(),
    steps: z.array(stepSchema).optional(),
    tabs: z.array(tabSchema).optional(),
  }),
});

export const collections = {
  exit: exitCollection,
};