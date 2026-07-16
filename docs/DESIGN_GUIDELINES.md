# Lupa Learning Language (LLL) — Design Guidelines

## 4 Core Design Rules

| Rule | Meaning |
|------|---------|
| **Every page tells one story** | One primary action per screen. Everything else supports it. |
| **Every lesson teaches one big idea** | Tiny wins create momentum. Not encyclopedias. |
| **Every screen answers one question** | Home → "Why this?" Dashboard → "What next?" Lesson → "What am I learning?" |
| **Every component has one purpose** | LearningCard, ConceptBadge, MasteryRing — not generic primitives. Learning interactions. |

## 15 Premium Design Principles

1. **The learner is the hero** — UI should disappear during learning.
2. **90-9-1 visual rule** — 90% calm backgrounds + whitespace, 9% guidance (progress, CTAs), 1% delight (XP animations, unlocks).
3. **Premium spacing** — Whitespace is a feature. Never crowd elements.
4. **Reading-first layout** — Lessons at 72ch max width, 18px Inter, 1.75 line-height.
5. **Premium cards** — Large radius, soft shadows, breathing room.
6. **No glass/neon** — No glassmorphism, neon, or glowing borders. Soft surfaces, subtle elevation, restrained color.
7. **Motion hierarchy** — Tiny (hover, checkbox), Medium (modal, drawer), Large (page transition). Every animation justified.
8. **Learning Hero** — Every lesson starts with icon, meta, prerequisites, and what you'll build.
9. **Mastery Map** — Visual per-concept progress: ●◐○🔒.
10. **Premium Dashboard** — Calm, one CTA ("Continue Learning"), no noise.
11. **Micro-interactions** — Hover lift, complete → XP fly → unlock animation sequence.
12. **Rich lesson blocks** — 💡🧠⚠️🌍📖🔬🚀🎯 each with visual identity.
13. **Premium illustrations** — SVG + emoji + ASCII + animation per concept.
14. **Sound (optional)** — Subtle, Nintendo-like, not casino.
15. **WOW moment** — Module completion: XP fly, confidence boost, concept unlocks.

## Design Constraints (What We Never Do)

| Never | Why |
|-------|-----|
| More than one primary CTA per screen | Prevents decision fatigue |
| More than three accent colors on a page | Keeps visual focus |
| More than three font sizes in one section | Maintains hierarchy |
| Walls of text over ~500 words without interaction | Preserves engagement |
| Auto-playing animations | Avoids distraction |
| Hidden navigation patterns | Predictability matters |
| Meaning conveyed by color alone | Accessibility |

## Visual Hierarchy Scale

| Level | Purpose | Size/Weight |
|-------|---------|-------------|
| H1 | Page purpose | 24px bold |
| H2 | Section | 18px semibold |
| H3 | Group | 16px medium |
| Body | Explanation | 15px regular |
| Supporting | Metadata | 14px |
| Caption | Secondary info | 12px |

### Spacing Scale

| Token | PX | Usage |
|-------|----|-------|
| XS | 4 | Inline gaps, icon margins |
| S | 8 | Element spacing within groups |
| M | 16 | Card padding, section gaps |
| L | 24 | Between sections |
| XL | 32 | Page sections |
| 2XL | 48 | Major page divisions |

## Design Review Checklist

Before any screen ships:

- [ ] Tells one story
- [ ] One primary action per screen
- [ ] Answers one question
- [ ] Uses learning components where appropriate
- [ ] Uses semantic tokens (no hardcoded hex)
- [ ] Accessible (keyboard navigable, contrast, aria)
- [ ] Mobile responsive
- [ ] Keyboard navigable
- [ ] Loading state exists
- [ ] Empty state exists
- [ ] Error state exists
- [ ] Every animation is justified (motion hierarchy)
- [ ] Reading width is comfortable (≤72ch for lessons)
- [ ] No unnecessary decoration
- [ ] **Teaches better than before** (the most important question)

## 7 Core Screens

| Screen | Question It Answers | Primary Action |
|--------|---------------------|----------------|
| Home | Why use LupaLearn? | Start Learning |
| Dashboard | What should I do next? | Continue Learning |
| Lesson | What am I learning? | Complete Lesson |
| Practice | Can I use it? | Run Code |
| Playground | Can I build it? | Build Project |
| Mentor | How can I improve? | Ask Mentor |
| Profile | How far have I come? | Next Goal |

## Package Responsibilities

```
ui-core/     → Button, Card, Badge, Tabs, Input (interface primitives)
visual-core/ → Illustrations, Diagrams, Animations, Icons (educational visuals)
learning-core/ → LearningHero, MentalModel, ConceptMap, MasteryMap (learning interactions)
```

JetBrains Mono reserved for: Playground, code blocks, command palette.
Inter everywhere else.

## Design Identity

Linear's polish × Apple's restraint × Notion's readability × Cursor's developer quality (Playground only) × LupaLearn's teaching language.
