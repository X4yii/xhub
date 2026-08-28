import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
const noticias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/noticias" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('X4yi'),
    image: z.string().optional(),
  })
});
const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    project: z.string(),
    category: z.string().default('General'),
    categoryOrder: z.number().default(0),
    order: z.number().default(0),
  })
});
const changelogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/changelogs" }),
  schema: z.object({
    title: z.string(),
    project: z.string(),
    version: z.string(),
    date: z.date(),
  })
});
export const collections = { noticias, docs, changelogs };