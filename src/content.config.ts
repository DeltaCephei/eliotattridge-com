import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One collection, five kinds. The `kind` field is a discriminated union:
// each variant declares its own required extras (links need a source,
// readings need a book) so the schema enforces the shape per kind.
//
// Adding a sixth kind later = one new variant + one ternary branch in
// the catch-all route + (optionally) one new layout component. Never
// a new collection or a new file tree.

const baseFields = {
  title: z.string(),
  startDate: z.coerce.date(),
  updated: z.coerce.date().optional(),
  topics: z.array(z.string()).optional(),
  summary: z.string().optional(),
  draft: z.boolean().default(false),
  // Optional layout escape hatch — when a single note needs a bespoke
  // visual treatment that's not worth a whole new kind.
  layout: z.string().optional(),
};

const noteSchema = z.object({
  kind: z.literal('note'),
  ...baseFields,
});

const musingSchema = z.object({
  kind: z.literal('musing'),
  ...baseFields,
});

const fragmentSchema = z.object({
  kind: z.literal('fragment'),
  ...baseFields,
});

const linkSchema = z.object({
  kind: z.literal('link'),
  ...baseFields,
  source: z.object({
    url: z.string().url(),
    author: z.string().optional(),
    outlet: z.string().optional(),
  }),
});

const readingSchema = z.object({
  kind: z.literal('reading'),
  ...baseFields,
  book: z.object({
    title: z.string(),
    author: z.string(),
  }),
  quote: z.string().optional(),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.discriminatedUnion('kind', [
    noteSchema,
    musingSchema,
    fragmentSchema,
    linkSchema,
    readingSchema,
  ]),
});

export const collections = { notes };

// Display labels for kinds, used by listing pages and the home stream.
// Singular for the badge on a card. Plural for stream titles.
export const KIND_LABELS: Record<string, { singular: string; plural: string }> = {
  note: { singular: 'note', plural: 'Notes' },
  musing: { singular: 'musing', plural: 'Musings' },
  fragment: { singular: 'fragment', plural: 'Fragments' },
  link: { singular: 'link', plural: 'Links' },
  reading: { singular: 'reading', plural: 'Reading' },
};

export const KIND_ORDER = ['note', 'musing', 'fragment', 'link', 'reading'] as const;
