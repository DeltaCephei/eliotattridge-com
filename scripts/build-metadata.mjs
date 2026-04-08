#!/usr/bin/env node
// Build-time metadata script.
//
// Walks src/content/notes, extracts:
//   1. Wikilink references → reverse map → src/data/backlinks.json
//   2. Git commit count per file → src/data/revisions.json
//
// Runs before `astro build` and `astro dev`. The output JSON is imported
// directly by Astro components, so it has to exist before the dev/build
// server starts.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const NOTES_DIR = path.join(ROOT, 'src', 'content', 'notes');
const DATA_DIR = path.join(ROOT, 'src', 'data');

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

// Recursively walk a directory for .md / .mdx files
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(md|mdx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// Slug = filename without extension. Astro's content collection ID for a
// flat folder uses the path relative to the collection base, sans extension.
function slugFor(file) {
  const rel = path.relative(NOTES_DIR, file);
  return rel.replace(/\.(md|mdx)$/, '');
}

function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {}, body: raw };
  try {
    const data = yaml.load(match[1]) ?? {};
    return { data, body: raw.slice(match[0].length) };
  } catch {
    return { data: {}, body: raw };
  }
}

function extractWikilinks(body) {
  const out = new Set();
  let m;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(body)) !== null) {
    out.add(m[1].trim());
  }
  return [...out];
}

function gitRevisions(file) {
  try {
    const out = execSync(
      `git log --follow --format=%H -- "${file}"`,
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }
    ).toString().trim();
    if (!out) return 1; // not yet committed → counts as the current draft
    return out.split('\n').length;
  } catch {
    return 1;
  }
}

function main() {
  if (!fs.existsSync(NOTES_DIR)) {
    console.warn(`[metadata] No notes directory at ${NOTES_DIR}, skipping.`);
    return;
  }

  const files = walk(NOTES_DIR);
  const titles = {};       // slug → title (for backlink display)
  const outgoing = {};     // slug → [target slugs]
  const revisions = {};    // slug → integer commit count

  for (const file of files) {
    const slug = slugFor(file);
    const raw = fs.readFileSync(file, 'utf8');
    const { data, body } = parseFrontmatter(raw);
    titles[slug] = data.title ?? slug;
    outgoing[slug] = extractWikilinks(body);
    revisions[slug] = gitRevisions(file);
  }

  // Reverse the outgoing map → backlinks per target
  const backlinks = {};
  for (const [source, targets] of Object.entries(outgoing)) {
    for (const target of targets) {
      if (!backlinks[target]) backlinks[target] = [];
      backlinks[target].push({ slug: source, title: titles[source] ?? source });
    }
  }

  // Sort each backlink list by title for stable output
  for (const list of Object.values(backlinks)) {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, 'backlinks.json'),
    JSON.stringify(backlinks, null, 2)
  );
  fs.writeFileSync(
    path.join(DATA_DIR, 'revisions.json'),
    JSON.stringify(revisions, null, 2)
  );

  const totalBacklinks = Object.values(backlinks).reduce((n, l) => n + l.length, 0);
  console.log(
    `[metadata] ${files.length} notes, ${totalBacklinks} backlinks, revisions tracked.`
  );
}

main();
