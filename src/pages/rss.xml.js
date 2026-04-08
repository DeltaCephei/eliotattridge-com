import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const sorted = notes.sort(
    (a, b) => b.data.startDate.getTime() - a.data.startDate.getTime()
  );
  return rss({
    title: 'Eliot Attridge — notes',
    description: "A working scientist's notebook, kept in public.",
    site: context.site,
    items: sorted.map(note => ({
      title: note.data.title,
      pubDate: note.data.startDate,
      description: note.data.summary ?? '',
      link: `/${note.id}/`,
      categories: note.data.topics ?? [],
    })),
    customData: '<language>en-nz</language>',
  });
}
