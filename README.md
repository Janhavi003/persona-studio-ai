# Persona Studio — AI User Persona Generator

Persona Studio is a research-honest AI product-research workspace that turns product ideas and user research notes into structured persona hypotheses, pain points, jobs-to-be-done, journeys, and product opportunities.

> **Important:** AI-generated personas are hypotheses, not a substitute for customer research.

## Features

- Multi-step project creation with product, audience, research, and learning goals
- Groq structured JSON generation validated with Zod
- Multiple structured personas with evidence labels: known, inferred, assumption
- Editable persona details and section-level regeneration
- Pain-point analysis with severity, frequency, impact, evidence, and response ideas
- Functional, emotional, and social Jobs-to-be-Done
- Seven-stage user journey mapping
- AI-generated product opportunities
- Research-honesty / assumption-validation view
- Project-scoped AI chat and simulated persona chat
- Markdown persona export
- SQLite persistence for local development
- Demo project that works without an API key
- Responsive light/dark UI

## Visual design system

Persona Studio uses an editorial research-lab visual language rather than a generic purple SaaS template:

- **Typography:** Space Grotesk for display/UI hierarchy with Manrope for readable product copy.
- **Palette:** warm paper neutrals, deep ink surfaces, mineral teal as the primary accent, and muted terracotta for secondary emphasis.
- **Infrastructure:** outlined research panels, asymmetric grids, a persistent research-console sidebar, compact top navigation, and restrained square corners.
- **Interaction:** subtle lift/outline transitions, clear focus rings, semantic severity colors, and strong light/dark surface hierarchy.
- **Research framing:** evidence states are visually distinct from generated hypotheses so the interface feels like a research tool rather than a generic chatbot.

The landing page and workspace share the same visual tokens so the product reads as one coherent application.

## Architecture

Next.js App Router provides the UI and server API routes. AI calls live in `lib/ai`, Zod contracts live in `lib/validation`, persistence lives in `lib/db`, and shared domain types live in `lib/types`. The Groq API key is server-only.

The AI integration uses Groq's OpenAI-compatible Chat Completions API with strict JSON-schema structured output for persona generation, followed by Zod validation and transformation into the full application model. Transient Groq failures are retried with exponential backoff and jitter, then the configured fallback model is attempted. The generated JSON is parsed again with Zod before application use, so malformed or unexpected model output is rejected rather than rendered. The primary model is `openai/gpt-oss-120b`, with `openai/gpt-oss-20b` as the fallback.

## Tech stack

- Next.js + React + TypeScript
- Tailwind CSS
- Reusable shadcn-style UI primitives
- Lucide React
- Groq API via its OpenAI-compatible Chat Completions endpoint
- Zod + `zod-to-json-schema`
- SQLite via better-sqlite3
- Vitest

## Project structure

```text
app/                 Next.js pages and API routes
components/          UI primitives and theme provider
lib/ai/              Groq service functions
lib/db/              SQLite persistence
lib/types/           Domain types
lib/validation/      Zod schemas
hooks/               Client hooks
 tests/              Vitest tests
public/              Static assets
```

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `GROQ_API_KEY` in `.env.local`. The key is only read by server-side code and is never sent to the browser. Persona Studio calls Groq directly from server-side API routes.

If no API key is configured, the built-in demo project remains available. AI generation and AI chat show a clear configuration error rather than silently pretending to work.

## Environment variables

```env
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-120b
GROQ_FALLBACK_MODEL=openai/gpt-oss-20b
DATABASE_PATH=./data/persona-studio.db
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

## AI generation approach

AI functions are deliberately modular: `generatePersonas`, `regenerateSection`, and `chat` are separate server-side services. Groq returns JSON constrained by the application's schemas, and every response is parsed against Zod before use. Malformed model output is rejected rather than rendered.

## Research honesty

The product intentionally distinguishes:

- **Known** — information directly supplied by the user
- **Inferred** — an AI interpretation based on supplied context
- **Assumption** — a hypothesis that should be tested with real users

Persona chat is explicitly described as a simulated perspective. Product opportunities are labelled AI-generated opportunities rather than objective requirements.

## Security

- Groq API key is server-only
- User input is treated as untrusted text
- AI output is rendered as text, not arbitrary HTML
- API inputs are schema-validated where appropriate
- Requests have practical message length limits
- SQLite uses parameterized statements
- Secrets and local database files are ignored by Git

## Testing

Tests cover core Zod validation behavior and demo project compatibility. This is not a claim of complete coverage.

## Production notes

SQLite is intentionally used for a simple portfolio/local setup. The DB boundary is isolated in `lib/db`, making a future PostgreSQL adapter straightforward. For production multi-user deployment, add authentication, authorization, a hosted relational database, rate limiting, encrypted secret management, and observability.

## Screenshots

Add screenshots or a short product GIF here when publishing the repository.

## Future improvements

- Authentication and multi-user workspaces
- PostgreSQL adapter
- Full persona comparison workspace
- PDF export service
- Streaming AI responses
- Research import from CSV/feedback tools
- Evaluation harness for persona consistency and evidence grounding

## Contributing

Issues and pull requests are welcome. Keep AI-generated content explicitly labelled and preserve the distinction between research evidence and hypotheses.

## License

MIT — see `LICENSE`.

## Resume Project

This project demonstrates full-stack TypeScript architecture, Next.js App Router, server-side Groq integration, structured model outputs, Zod validation, SQLite persistence, responsive SaaS UX, research-honesty design, error handling, and maintainable separation between UI, AI, data, and validation layers.
