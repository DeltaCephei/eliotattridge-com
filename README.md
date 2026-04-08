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
npm run build      # metadata + astro build + pagefind
npm run preview
```

## The five kinds

The garden has five shapes of writing. Each is just a value of the `kind` field in frontmatter. Listing pages live at `/streams/<kind>/`.

| kind       | what it's for                                          | extra required fields       |
|------------|--------------------------------------------------------|-----------------------------|
| `note`     | developed thinking, essay-shape, has a thesis          | none                        |
| `musing`   | thinking-out-loud, longer than a fragment, exploratory | none                        |
| `fragment` | one-shot, short, in-the-moment                         | none                        |
| `link`     | reaction to something found online                     | `source.url`                |
| `reading`  | reaction to a book or passage                          | `book.title`, `book.author` |

The schema is a Zod discriminated union — if you set `kind: link` and forget `source.url`, the build fails. That's the point.

## Publish

1. New file in `src/content/notes/your-slug.md` (or `.mdx`).
2. Minimum frontmatter for a `note`:
   ```yaml
   ---
   kind: note
   title: "Note title"
   startDate: 2026-04-08
   topics: ["pkm", "writing in public"]
   summary: "One sentence that shows on the home page."
   ---
   ```
3. Or a `link`:
   ```yaml
   ---
   kind: link
   title: "What I think about it"
   startDate: 2026-04-08
   source:
     url: "https://example.com/the-thing"
     author: "Their Name"
     outlet: "Their Site"
   topics: ["whatever"]
   ---
   ```
4. Or a `reading`:
   ```yaml
   ---
   kind: reading
   title: "What stuck with me"
   startDate: 2026-04-08
   book:
     title: "Book title"
     author: "Author Name"
   quote: "Optional pulled passage."
   topics: ["whatever"]
   ---
   ```
5. Write.
6. `git add` & `git push`. Cloudflare Pages builds.

## Cross-links and backlinks

Wikilinks work in any `.md` or `.mdx` body:

```
See also [[compounding-knowledge]] and [[two-sigma-problem|the two-sigma piece]].
```

`[[slug]]` becomes a link to `/<slug>/`. `[[slug|display text]]` lets you override the link text.

Every note shows a "Mentioned in" section at the bottom listing all notes that link to it. Backlinks are computed at build time by `scripts/build-metadata.mjs` (which runs automatically before `dev` and `build`).

## Revision counting

Each note shows how many times it's been "tended" — derived from `git log --follow` on the file. First commit shows as "first writing"; subsequent commits show as "tended N times". Nothing manual to maintain.

## Structure

```
src/
  content.config.ts        # discriminated union: note | musing | fragment | link | reading
  content/notes/           # all notes live here, regardless of kind
  data/                    # generated, gitignored
    backlinks.json
    revisions.json
  plugins/
    remark-wikilinks.mjs   # turns [[slug]] into links
  layouts/
    BaseLayout.astro       # masthead, nav, footer
    NoteLayout.astro       # all five kinds render through this with conditional blocks
  pages/
    index.astro            # latest stream (all kinds, reverse-chron)
    [...slug].astro        # catch-all for any note
    streams/
      index.astro          # list of all kinds with counts
      [kind].astro         # per-kind listing
    topics/
      index.astro
      [topic].astro
    about.astro
    now.astro
    colophon.astro
    rss.xml.js
  components/              # MDX components, available without import
    Aside, Figure, IntroParagraph, Footnote, Ref, Reference, References
  styles/global.css        # design 03b: editorial sans, deep forest green

scripts/
  build-metadata.mjs       # runs on every dev/build, generates src/data/*.json
```

## How it grows

When a single note needs a one-off bespoke visual treatment, set `layout: 'something'` in frontmatter and add a branch in `src/pages/[...slug].astro`. Don't speculatively build layouts — only when a real piece of content demands it.

When a sixth `kind` is genuinely needed, add a new variant to the discriminated union in `src/content.config.ts`, add it to `KIND_LABELS` and `KIND_ORDER`, and (optionally) add a kind-specific block in `NoteLayout.astro`. The streams pages and home stream pick it up automatically.

## Deferred for v1.1

- Pagefind UI integration (Pagefind index is built; the search UI is the next step).
- Proper Open Graph images.
- Cloudflare Pages deploy via `wrangler` and the `claude-eliotattridge-com` API token.
- Photo optimisation via `astro:assets <Image />`.

These are intentional. v1 ships first.
