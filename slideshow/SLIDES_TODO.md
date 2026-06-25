# Slides to add

Owner request: "Add some more slides to that" (PR #64 comment, 2026-06-25).

Implementer: append these entries to the `SLIDES` array in `slideshow/index.html`,
verify each Wikimedia URL returns HTTP 200 with image content, then recompute the
CSP `script-src` sha256 hash and delete this file.

Also fix CSP `img-src data:image/svg+xml` → bare `data:` (see PR body plan).

## Candidate slides

| # | Subject | Alt text | Notes |
|---|---------|----------|-------|
| 9  | Asim Ferhatović "Hase" Stadium, Sarajevo | Asim Ferhatović Hase Stadium | National stadium |
| 10 | Vedad Ibišević | Vedad Ibišević | Former captain, prolific scorer |
| 11 | Zvjezdan Misimović | Zvjezdan Misimović | Former captain, key midfielder |
| 12 | Bosnia & Herzegovina at 2014 FIFA World Cup | Bosnia and Herzegovina 2014 FIFA World Cup | Historic debut |
| 13 | Stari Most (Old Bridge), Mostar | Stari Most, Mostar | Cultural symbol |
| 14 | Vedran Ćorluka or Haris Seferović | — | Skip if no Wikimedia image found |

Minimum 3 new verified slides expected. Skip any candidate whose Wikimedia URL
cannot be confirmed at a pre-cached thumbnail size.
