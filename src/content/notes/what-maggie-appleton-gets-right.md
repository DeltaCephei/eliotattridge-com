---
kind: note
title: "What Maggie Appleton gets right (and what I'd skip)"
startDate: 2026-04-02
topics: ["digital gardens", "PKM", "writing in public"]
summary: "The philosophy lands. The illustration style is hers. Borrowing the first without copying the second."
---

Maggie Appleton's digital garden is the closest thing I've seen to "what I want this site to feel like". Re-reading her *Brief History &amp; Ethos of the Digital Garden* essay landed differently this time. The philosophy lines up almost exactly with what I've been trying to articulate for myself.

The bits I'm taking:

- Notes are *allowed* to be unfinished. This is the part teachers especially struggle with. We're trained to publish only what's correct.
- Notes change. The earlier versions stay in git, but the canonical version is the latest, not the first one published.
- They link to each other, and the links matter more than the chronology.
- It's a thinking space, not a publication. That phrase has become load-bearing in my own head.
- Pruning is part of the gardening, not a failure.

The bits I'm skipping:

- The illustration style. It's gorgeous and deeply hers. Copying it would be embarrassing and dishonest.
- The growth-stage metadata (seedling / budding / evergreen). I tried thinking about this for ten minutes and realised I'd spend more time deciding what stage a note was in than writing it. That's the wrong friction.
- A graph view. I don't think they earn their pixels.

## The structural pattern is the real gift

The thing I'm actually lifting verbatim from her V3 codebase is the layout-switching mechanism: every collection has a `type` discriminator, one catch-all route fans in from all collections, the layout switch is a literal ternary at the bottom of the page. Adding a new presentation mode is one new collection or one new layout value, never a new page file.

This is the bit that makes the site grow without rewriting itself. You can have notes that are timelines, notes that are annotated diagrams, notes that are reading lists with citations, notes that are just prose. Same content model. Same mental load.

## What I'm watching for

The risk with adopting someone else's philosophy is wearing it like a costume. Maggie's writing voice is hers, her topics are hers, her aesthetic is hers. The thinking-in-public habit has to be mine, in my voice, on my topics, or it'll feel like cosplay and I'll quietly stop.
