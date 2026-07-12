# LupaLearn Architecture

## Three-Layer Model

```
┌─────────────────────────────────────────────┐
│              KNOWLEDGE LAYER                  │
│  Nodes & Edges (Graph)                       │
│  Concepts, Technologies, Languages, Tools    │
├─────────────────────────────────────────────┤
│              LEARNING LAYER                   │
│  Resources (Lessons, Projects, Quizzes)      │
│  Connected to Knowledge Layer via edges      │
├─────────────────────────────────────────────┤
│               USER LAYER                      │
│  Progress, Confidence, Bookmarks, Paths      │
│  Business Records (Users, Billing, Auth)     │
└─────────────────────────────────────────────┘
```

## Knowledge Graph

Everything is a **Node**. Nodes have **Edges** between them.

```
Node(id, type, slug, name)
  types: concept, technology, language, framework, tool, paradigm, school

Edge(id, sourceId, targetId, relationType, strength)
  relations: requires, teaches, tests, references, part_of,
             extends, related_to, recommends, precedes, alternative_to
```

Examples:
- `[Functions:concept] ──requires──→ [Variables:concept]`
- `[Python:language] ──teaches──→ [Functions:concept]`
- `[Intro to Functions:lesson] ──tests──→ [Functions:concept]`

## Three Learning Modes

| Mode | Entry | Progression | Best For |
|------|-------|-------------|----------|
| **Guided** | Select school/goal | Prerequisite-locked, linear | Beginners, degree-seekers |
| **Explorer** | Search anything | Open, no locks, all content | Experienced devs |
| **AI** | "I want to learn X" | Generated path, adaptive | Goal-oriented learners |

## Technology Stack

- **Framework:** Next.js 16 + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + custom terminal design system
- **Database:** Prisma + PostgreSQL (SQLite for dev)
- **Auth:** Clerk
- **Search:** Meilisearch (with client-side fallback)
- **AI:** LupaBrain (pluggable)
- **Terminal:** xterm.js
- **Editor:** Monaco Editor
- **Charts:** Recharts
- **State:** Zustand + TanStack Query
- **Content:** MDX files with custom components

## Key Design Decisions

1. **Graph + Relational split** — Knowledge entities are nodes/edges. Users, billing, and business records are relational tables.
2. **Difficulty on resources** — Concepts don't have difficulty; lessons, projects, and quizzes do.
3. **Confidence from signals** — Confidence is calculated from completions, quiz accuracy, challenge success, recency, and reviews.
4. **Content versioning** — Lessons have versioned drafts for staged publishing and rollback.
5. **i18n ready** — All content paths support locale prefixes.
