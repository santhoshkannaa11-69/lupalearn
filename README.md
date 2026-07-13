# LupaLearn

> AI-powered interactive learning platform for computer engineering.

## Vision

LupaLearn teaches you what to build, LupaCode helps you build it, LupaFlow helps you automate it, and LupaBrain ties everything together with shared knowledge and intelligence.

## Features

### 🎓 Three Learning Modes
- **Guided** — Follow a structured curriculum with prerequisite-locked progression
- **Explorer** — Search any topic, no prerequisites required
- **AI** — Tell LupaLearn your goal and get a personalized roadmap

### 🧠 Knowledge Graph
Every concept connects to related concepts, lessons, projects, and quizzes via a Node + Edge model. Learning is a web, not a linear path.

### 💻 Interactive Playground
Monaco editor + xterm.js terminal + live preview. Write code, run it, see results — all in the browser.

### 🤖 AI Tutor
Context-aware teaching assistant that knows your progress, confidence, and weak areas. Adapts explanations to your level.

### 📊 Progress Intelligence
- Confidence calculation from learning signals
- Personalized recommendations
- Weak area detection
- Learning analytics

### 🔧 Admin CMS
Full content management system with MDX editor, graph editor, quiz builder, versioning, and publishing workflow.

## Architecture

```
KNOWLEDGE LAYER (Graph)
  Nodes & Edges — concepts, technologies, languages, tools

LEARNING LAYER (Resources)
  Lessons, Projects, Quizzes, Challenges — connected to knowledge

USER LAYER (Business)
  Progress, Confidence, Achievements, Subscriptions
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, terminal design system |
| Database | Prisma + SQLite (dev) / PostgreSQL (prod) |
| Auth | Clerk (configured) / Admin panel (dev) |
| Editor | Monaco Editor |
| Terminal | xterm.js |
| AI | OpenRouter / Groq / simulated |
| Search | Meilisearch (configured) |
| Charts | Recharts |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/santhoshkannaa11-69/lupalearn.git
cd lupalearn

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Initialize database
npx prisma db push

# Seed with sample data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `OPENROUTER_API_KEY` | AI provider (real responses) | No |
| `GROQ_API_KEY` | AI provider (free tier) | No |
| `ADMIN_USERNAME` | Admin panel login | Dev only |
| `ADMIN_PASSWORD` | Admin panel login | Dev only |
| `CLERK_PUBLISHABLE_KEY` | Authentication | For production |
| `CLERK_SECRET_KEY` | Authentication | For production |

## Project Structure

```
lupa-learn/
├── content/                    # MDX lesson files
├── src/
│   ├── app/                    # Next.js App Router (30+ routes)
│   ├── components/
│   │   ├── ui/                 # Terminal design system
│   │   ├── layout/             # Shell, sidebar, header
│   │   ├── playground/         # Monaco + terminal + preview
│   │   ├── ai/                 # AI Tutor chat
│   │   ├── learn/              # Lesson viewer
│   │   ├── dashboard/          # Progress + recommendations
│   │   └── admin/              # Admin CMS
│   ├── lib/
│   │   ├── ai/                 # Tutor, prompts, providers, tools
│   │   ├── editor-core/        # Terminal shell
│   │   └── *.ts                # Graph, progression, confidence, events
│   ├── stores/                 # Zustand state management
│   └── types/                  # TypeScript types
├── prisma/                     # Database schema + seed
└── docs/                       # ADRs and documentation
```

## Current Content

**Volume 1: School of Computer Science**
- Course: Programming Fundamentals
- 10 modules, 45 lessons
- Interactive terminals in every lesson
- Quizzes, challenges, and projects

## Roadmap

| Sprint | Status | Description |
|--------|--------|-------------|
| 1 | ✅ | Platform foundation |
| 2A | ✅ | Knowledge graph |
| 2B | ✅ | Intelligence engine |
| 3 | ✅ | Playground |
| 4A | ✅ | AI Tutor |
| 4B | ✅ | Admin CMS |
| 5 | ✅ | Volume 1 content |
| 5.5 | 🔄 | Stabilization & polish |
| 6 | ⬜ | Gamification |
| 7 | ⬜ | Community |
| 8+ | ⬜ | Enterprise, mobile, API |

## License

MIT
