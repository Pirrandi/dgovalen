import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const htb = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/htb' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']),
    os: z.enum(['Linux', 'Windows', 'FreeBSD', 'Other']),
    tags: z.array(z.string()).default([]),
    retired: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

const cves = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cves' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cve_id: z.string(),
    description: z.string(),
    severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Informational']),
    cvss: z.number().min(0).max(10).optional(),
    affected: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, htb, cves, research };
