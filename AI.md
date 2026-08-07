# AI — Persistent Project Memory

> This file is the **single source of truth** for everything that has happened
> to this project. Every future session MUST read this first and append to it
> when anything changes.

---

## RULES (read before doing anything)

1. **ALWAYS READ THIS FILE FIRST** before touching the project.
2. **ALWAYS APPEND** a `## Session Log` entry at the end when you finish work —
   what you did, what worked, what failed, and any decisions made.
3. **NEVER DELETE or rewrite history** in this file. Only append new sections.
4. **NEVER include private repositories** anywhere in docs or repo lists. The
   GitHub repo list must only ever show public repos.
5. **Refresh the repo list from the GitHub API** when updating the Projects
   page — do not hand-edit stale counts/statuses.
6. **Remember what failed** (see "What Did NOT Work") so you don't repeat it.
7. **Branch structure matters**: `main` = original HTML portfolio (archived in
   `legacy/`), `docs` = the ReadTheDocs documentation redesign. Work happens on
   `docs`.
8. **Fill-in placeholders exist**: Google Analytics ID (`G-XXXXXXXXXX`) and the
   Discord invite URL in `mkdocs.yml` still need real values from the user.
9. Commit/push ONLY when the user explicitly asks.

---

## PROJECT IDENTITY

- **Name:** Niplex — NEVER STOP IMAGINING
- **Owner:** Adarsh Jaiswal (GitHub: [Aj-Niplex](https://github.com/Aj-Niplex))
- **Repo:** https://github.com/Aj-Niplex/Aj-Niplex.github.io
- **Mission:** "Never stop Imagining." Empower non-technical users with AI/ML.
  Shift heavy thinking and overthinking to AI systems; humans focus on
  imagination and strategy.
- **Context:** Class 12 PCM student, MEXT Undergraduate Scholarship 2028
  target, Robotics Engineering in Japan.
- **Contact:** LinkedIn (aj-niplex-foundation), email niplex.owner@gmail.com
- **Design identity:** Split Japan (sakura pink, left) → India (saffron/green,
  right) gradient theme. Fonts: Space Grotesk + JetBrains Mono.

---

## CURRENT STATE (as of the last session)

### What this project IS now
A **ReadTheDocs-hosted documentation site** built with **MkDocs + Material
theme**. The repo itself is open source. Old static HTML portfolio is preserved
under `legacy/` and is NOT served.

### Repository layout
```
docs/             # All documentation content (Markdown)
  index.md        # Home: animated hero + mission + card grids
  mission.md      # Introduction & Company Mission
  about.md        # Vision (personal + skills)
  roadmap.md      # Path to Japan
  faq.md          # Collapsible FAQ
  blog/           # Blog index + posts/
  projects/       # Per-project docs (one per public repo)
  assets/         # Logos (copied from legacy/)
  stylesheets/extra.css     # Japan/India split theme + animations
  javascripts/    # animation.js, mathjax.js
  overrides/      # (custom_dir, currently empty)
mkdocs.yml        # MkDocs + Material config (THE main config)
.readthedocs.yaml # ReadTheDocs build config (mkdocs + python 3.11)
requirements.txt  # Build deps for ReadTheDocs
README.md         # Repo readme
legacy/           # Original HTML portfolio (archived, git-tracked)
site/             # Build output (gitignored)
.cache/           # Social plugin cache (gitignored)
```

### Build & run
```bash
pip install --break-system-packages -r requirements.txt   # note the flag!
mkdocs serve -a 0.0.0.0:8000    # dev server (use background terminal)
mkdocs build                     # static build -> site/
```

### mkdocs.yml capabilities (all enabled)
- Material theme, Space Grotesk + JetBrains Mono
- Palette: light/dark (primary: pink, accent: orange)
- Features: instant nav + progress, tabs, sections, expand, top, indexes,
  footer, path, toc.follow, search suggest/highlight/share, code copy/annotate,
  content tabs, edit action, header autohide
- Plugins: search, git-revision-date-localized, minify, social (cards)
- Analytics: Google Analytics (placeholder ID) + page feedback widget
- Socials: GitHub, LinkedIn, Discord (placeholder), email
- Markdown: admonitions, details, superfences (mermaid native), tabs, tasks,
  emoji, math (MathJax), critic/caret/keys/mark/tilde

### Public repo list (7 repos, verified via GitHub API, NO private repos)
| Repo | Lang | Status | Updated |
| ---- | ---- | ------ | ------- |
| niplex-mcp | Python | Active Dev | 2026-08-06 |
| ai-memory-workspace-starter | — (fork, MIT) | Starter | 2026-08-01 |
| Aj-Niplex.github.io | Markdown/MkDocs | Live (this site) | 2026-07-31 |
| Ishani_v2 | LoRA/Python | Active Dev | 2026-07-17 |
| Ishani | Jinja | Deprecated | 2026-07-16 |
| Rei-kun-Bot | Python (MIT) | Live | 2026-07-12 |
| Neural-OS | — (MIT) | Design Phase | 2026-07-11 |

### Still to do (placeholders / user action)
- Replace `G-XXXXXXXXXX` in `mkdocs.yml` `extra.analytics.property` with the
  real Google Analytics ID.
- Replace `https://discord.gg/` in `mkdocs.yml` `extra.social` with the real
  Discord invite.
- Commit the `docs` branch (user has NOT asked to commit yet — asked in an
  earlier turn, not confirmed).
- Push to GitHub and connect the repo to ReadTheDocs (readthedocs.com).
- Publish: `README.md` says "Live docs coming soon at
  https://aj-niplex.readthedocs.io/".

---

## WHAT WAS TRIED AND WORKED

| Thing | How |
| ----- | --- |
| ReadTheDocs-ready MkDocs site | `.readthedocs.yaml` + `requirements.txt` + `mkdocs.yml` |
| Mermaid diagrams | Native Material `pymdownx.superfences` custom fence — NO manual mermaid JS |
| Social cards | `social` plugin (needs `libcairo2` system lib + pillow + cairosvg) |
| Math rendering | MathJax via `extra_javascript` + `arithmatex` |
| Animated hero + scroll reveal | Custom CSS in `docs/stylesheets/extra.css` + `javascripts/animation.js` |
| Feedback widget | `extra.analytics.feedback` (needs analytics provider set) |
| Card grids | Material `.grid cards` markdown pattern |
| Blog | Simple manual markdown blog (`docs/blog/`), no plugin needed |
| FAQ | `pymdownx.details` collapsible questions |
| Topic tags | Custom `.tag` CSS classes (sakura/saffron/green/neutral) |
| Preserving old site | `git mv` everything into `legacy/` (no data lost) |
| GitHub repo list | `curl https://api.github.com/users/Aj-Niplex/repos` (gh CLI NOT authed) |

---

## WHAT DID NOT WORK (do not repeat these)

1. **Manual Mermaid JS in `extra_javascript`** — CONFLICTS with Material's
   built-in Mermaid support (double init / broken rendering). FIX: remove the
   `<script src="unpkg.com/mermaid">` line; use the superfences custom fence
   instead. (Already fixed.)
2. **`gh` CLI repo listing** — `gh auth status` shows NOT logged in. `gh repo
   list` FAILS. FIX: use the unauthenticated GitHub REST API via `curl` with
   `?per_page=100&sort=updated`, filter `private == false`.
3. **`pip install` without flag** — on this Debian/Ubuntu-like environment pip
   refuses with "externally-managed-environment" unless
   `--break-system-packages` is passed.
4. **Social plugin before system lib** — cairosvg crashes with
   "cannot load library 'libcairo.so.2'" until you run
   `apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y libcairo2`.
5. **`mkdocs serve` via plain background shell** — the server process kept
   EXITING (exit code -1) after long idle / config rebuilds. Use the
   background-terminal tool and restart it after big config changes.
6. **Visitor counter backend on ReadTheDocs** — the legacy Python visitor
   counter (`api/counter.py`, `server.py`) CANNOT run on ReadTheDocs (static
   hosting only). That's the core reason the redesign dropped it; the code
   lives on in `legacy/` only.
7. **Vite/Node build** — the legacy site used Vite + TypeScript + bun.lock.
   Not needed anymore; MkDocs/Python replaces it entirely.
8. **`git-revision-date-localized` warnings** — "has no git logs" / "First
   revision timestamp is older than last" warnings appear while files are
   uncommitted or renamed. Harmless; they resolve after committing. Optionally
   set `enable_git_follow: false` if the rename warnings bother you.
9. **Material team "MkDocs 2.0" warning** — informational banner about future
   breaking changes. NOT an error. Ignore it.

---

## SESSION LOG

### Session 1 (2026-08-06) — Full redesign to ReadTheDocs docs site
- Branch `main` had a 7-page HTML portfolio (Vite + Python counter backend).
- User asked to "opensource as a doc on readthedocs.com", update repo list,
  exclude private repos.
- Decisions (user answers): MkDocs + Material (max features), full conversion
  to docs, work on a new branch named `docs`.
- Created branch `docs`; `git mv` all legacy site files into `legacy/`.
- Built full MkDocs project: `mkdocs.yml`, `.readthedocs.yaml`,
  `requirements.txt`, `README.md`, all content pages.
- Updated repo list from GitHub API: 7 public repos, 0 private.
- Verified `mkdocs build` and served via background terminal on port 8000.

### Session 2 (2026-08-06) — Mission content + animations
- Added `docs/mission.md` (Introduction & Company Mission, full text from user).
- Added animated hero (floating logos, gradient orbs, gradient text),
  scroll-reveal JS, button/card/table micro-interactions, reduced-motion
  support.
- Added Mission to nav; `mkdocs.yml` loads `javascripts/animation.js`.

### Session 3 (2026-08-06) — Personalization Q&A + full theme upgrade
- User picked: Japan/India split theme, stylish fonts, animated hero + cards,
  feedback widget + blog + FAQ + tags + versioned docs, social cards, Google
  Analytics, professional tone, footer socials
  (LinkedIn/GitHub/Discord/niplex.owner@gmail.com).
- Theme: split **sakura pink (Japan) → saffron/green (India)** gradient;
  rising-sun + tricolor motifs in hero; fonts Space Grotesk + JetBrains Mono.
- Added: blog (index + 2 posts), FAQ, topic tags on all project pages,
  feedback widget, Google Analytics config, social cards plugin (installed
  libcairo2 after fixing the cairo error), versioned docs (via RTD native).
- `requirements.txt` now includes `pillow`, `cairosvg` for social cards.
- README rewritten to reflect new structure + features + placeholders.
- `.cache/` added to `.gitignore` (social plugin cache).
- Verified full `mkdocs build` (11.5s) and preview serving at
  https://8000-74a45ecc2121e479.monkeycode-ai.live

### Session 4 (2026-08-07) — Created this `.AI` memory file
- Audited git history (1 commit), branches (`main`, `docs`), legacy code.
- Documented what worked, what failed, repo list, rules, and session log.
- Added `.cache/` to `.gitignore`.
- This file is now the persistent memory for all future sessions.

---

## NEXT ACTIONS (for the next session)

1. Ask the user whether to **commit the `docs` branch** (changes are staged
   but uncommitted).
2. Remind user to fill in **Google Analytics ID** and **Discord invite**.
3. If user wants versioned docs: note that ReadTheDocs provides versions via
   tags/branches natively — no `mike` setup needed for basic use.
4. Optional polish: populate `docs/overrides/` with a `main.html` template if
   deeper theming is wanted later.
