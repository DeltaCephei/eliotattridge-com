import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Single collection for v1. The `type` discriminator is here from day one
// so adding new presentation modes later is one new branch in the catch-all,
// not a refactor.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    type: z.literal('note').default('note'),
    title: z.string(),
    startDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topics: z.array(z.string()).optional(),
    layout: z.string().default('default'),
    draft: z.boolean().default(false),
    summary: z.string().optional(),
  }),
});

export const collections = { notes };
