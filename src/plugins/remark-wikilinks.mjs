// Tiny remark plugin: turns [[slug]] and [[slug|display text]] into links.
//
// Walks every text node in the markdown AST. Where it finds a wikilink
// pattern, it splits the text node into surrounding text + a link node.
// Targets resolve to /<slug>/ which matches the catch-all route.
//
// If a slug doesn't exist in the corpus, the link still renders — broken
// links are visible (good) and easy to fix later.

import { visit } from 'unist-util-visit';

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function remarkWikilinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return;
      const value = node.value;
      if (!value.includes('[[')) return;

      const parts = [];
      let lastIndex = 0;
      let match;
      WIKILINK_RE.lastIndex = 0;

      while ((match = WIKILINK_RE.exec(value)) !== null) {
        const [full, slug, display] = match;
        const start = match.index;

        // Preserve the text before the match
        if (start > lastIndex) {
          parts.push({ type: 'text', value: value.slice(lastIndex, start) });
        }

        // The link node itself
        parts.push({
          type: 'link',
          url: `/${slug.trim()}/`,
          title: null,
          data: {
            hProperties: { className: ['wikilink'] },
          },
          children: [{ type: 'text', value: (display ?? slug).trim() }],
        });

        lastIndex = start + full.length;
      }

      if (parts.length === 0) return;

      // Tail text after the last match
      if (lastIndex < value.length) {
        parts.push({ type: 'text', value: value.slice(lastIndex) });
      }

      // Replace the original text node with the new sequence
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}
