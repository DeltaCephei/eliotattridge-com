# eliotattridge.com

A working scientist's notebook, kept in public. Astro 5 + MDX content collections, deploying to Cloudflare Pages.

## Local

```
cd ~/Desktop/claude-forge/eliotattridge-com
npm install
npm run dev
```

Then visit `http://localhost:4321`.

## Build

```
npm run build      # astro build, then pagefind
npm run preview
```

## Publish a note

1. New file in `src/content/notes/your-slug.md` (or `.mdx`).
2. Frontmatter:
   ```yaml
   ---
   title: "Note title"
   startDate: 2026-04-08
   topics: ["pkm", "writing in public"]
   summary: "One sentence that shows on the home page."
   ---
   ```
3. Write.
4. `git add` &amp; `git push`. Cloudflare Pages builds.

That's the whole publishing ritual. No CMS, no draft button, no SEO fields.

## Structure

```
src/
  content.config.ts        # one collection: notes
  content/notes/           # all notes live here
  layouts/
    BaseLayout.astro       # masthead, nav, footer
    NoteLayout.astro       # the only real note layout in v1
  pages/
    index.astro            # homepage (lede + grid + topic cloud)
    [...slug].astro        # catch-all, fans in from notes collection
    topics/
      index.astro
      [topic].astro
    about.astro
    now.astro
    colophon.astro
    rss.xml.js
  components/              # MDX components, available without import
    Aside.astro
    Figure.astro
    IntroParagraph.astro
    Footnote.astro
  styles/global.css        # design 03b: editorial sans, deep forest green
public/favicon.svg
```

## How it grows

When a note needs a different presentation (timeline, annotated diagram, gallery, citation card), add:

1. A new `layout` value in the note's frontmatter (e.g. `layout: 'timeline'`).
2. A new layout component in `src/layouts/`.
3. One new branch in the ternary at the bottom of `src/pages/[...slug].astro`.

Never a new page file. The catch-all does the routing.

## Deferred for v1

- Wikilink syntax (`[[note-slug]]`) and build-time backlinks.
- Pagefind UI integration (Pagefind itself is in the build script, the UI is the next step).
- Proper Open Graph images.
- Cloudflare Pages deploy via `wrangler` and the `claude-eliotattridge-com` API token.

These are intentional. v1 ships first.
