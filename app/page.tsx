import Link from 'next/link';
import {
  ArrowUpRight,
  BrainCircuit,
  GitCompareArrows,
  Route,
  Sparkles,
  Target,
  MessageSquareText,
  ShieldCheck,
  ScanSearch,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { demoProject } from '@/lib/demo';

type Feature = [string, LucideIcon, string];

const features: Feature[] = [
  [
    'AI Persona Generation',
    BrainCircuit,
    'Turn product context into structured, editable persona hypotheses.',
  ],
  [
    'Pain Point Analysis',
    Target,
    'Separate evidence from assumptions and turn friction into research questions.',
  ],
  [
    'Jobs-to-be-Done',
    Sparkles,
    'Frame functional, emotional, and social jobs around the user problem.',
  ],
  [
    'User Journeys',
    Route,
    'Map the path from awareness to retention with opportunity signals.',
  ],
  [
    'Persona Comparison',
    GitCompareArrows,
    'Put 2–4 personas side by side to expose meaningful differences.',
  ],
  [
    'AI Research Chat',
    MessageSquareText,
    'Interrogate the project context without falling back to generic chat.',
  ],
];

export default function Home() {
  return (
    <main>
      <nav className="landing-nav sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <span className="brand-mark grid h-9 w-9 place-items-center text-sm">
              P
            </span>

            <span>Persona Studio</span>

            <span className="hidden border-l border-[var(--border)] pl-3 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)] sm:block">
              Research OS
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="hidden px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] sm:block"
            >
              Workspace
            </Link>

            <Link
              href="/app?demo=1"
              className="inline-flex items-center gap-2 border border-[var(--text)] bg-[var(--text)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] transition hover:-translate-y-0.5"
            >
              Explore demo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero-frame">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="hero-kicker mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent2)]" />
              AI product research workspace
            </div>

            <h1 className="display-type max-w-2xl text-5xl font-medium leading-[.98] sm:text-6xl lg:text-7xl">
              Understand the people behind the problem.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 muted">
              Turn product ideas and research notes into structured personas,
              journeys, pain points, and product opportunities, without
              pretending AI is customer evidence.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(15,118,110,.18)] transition hover:-translate-y-0.5"
              >
                Create personas
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/app?demo=1"
                className="inline-flex items-center gap-2 border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--text)]"
              >
                See the sample project
              </Link>
            </div>

            <div className="mt-9 flex items-center gap-5 text-xs muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
                Research-honest by design
              </span>

              <span className="h-3 w-px bg-[var(--border)]" />

              <span>Groq-powered</span>
            </div>
          </div>

          <div className="hero-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">
                  Live research board
                </div>

                <div className="mt-1 text-sm font-semibold">
                  FocusFlow / Personas
                </div>
              </div>

              <span className="border border-[var(--border)] px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--accent)]">
                Demo
              </span>
            </div>

            <div className="grid gap-px bg-[var(--border)] sm:grid-cols-[.78fr_1.22fr]">
              <div className="bg-[var(--surface2)] p-5">
                <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">
                  Research signals
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    'Protect deep-work time',
                    'Reduce context switching',
                    'Trust recommendations',
                  ].map((x, i) => (
                    <div
                      key={x}
                      className="border border-[var(--border)] bg-[var(--surface)] p-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-xs font-bold text-[var(--accent)]">
                          0{i + 1}
                        </span>

                        <div>
                          <div className="text-sm font-semibold">{x}</div>

                          <div className="mt-1 text-xs muted">
                            {i === 2 ? 'Assumption' : 'Inferred from brief'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--surface)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[.12em] text-[var(--accent)]">
                      Persona 01
                    </div>

                    <div className="mt-1 text-xl font-semibold">
                      {demoProject.personas[0].name}
                    </div>

                    <div className="mt-1 text-sm muted">
                      {demoProject.personas[0].role}
                    </div>
                  </div>

                  <div className="grid h-11 w-11 place-items-center border border-[var(--border)] text-sm font-bold">
                    MC
                  </div>
                </div>

                <div className="mt-7 border-t border-[var(--border)] pt-5">
                  <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">
                    The focus protector
                  </div>

                  <p className="mt-2 text-sm leading-6">
                    {demoProject.personas[0].summary}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="border border-[var(--border)] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">
                      Goals
                    </div>

                    <div className="mt-2 text-sm font-semibold">
                      {demoProject.personas[0].goals.length} signals
                    </div>
                  </div>

                  <div className="border border-[var(--border)] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">
                      Pain points
                    </div>

                    <div className="mt-2 text-sm font-semibold">
                      {demoProject.personas[0].painPoints.length} hypotheses
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3 text-xs muted">
              <span className="inline-flex items-center gap-2">
                <ScanSearch className="h-3.5 w-3.5" />
                Evidence layer active
              </span>

              <span>Updated just now</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <div className="hero-kicker">One workspace</div>

            <h2 className="mt-3 text-3xl font-medium sm:text-4xl">
              Research artifacts, not AI filler.
            </h2>

            <p className="mt-4 max-w-md leading-7 muted">
              Every output is structured so a product team can inspect it,
              edit it, challenge it, and turn it into the next research
              question.
            </p>
          </div>

          <div className="grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
            {features.map(([title, Icon, desc]) => (
              <div
                key={title}
                className="bg-[var(--surface)] p-6 transition hover:bg-[var(--surface2)]"
              >
                <Icon className="h-5 w-5 text-[var(--accent)]" />

                <h3 className="mt-7 font-semibold">{title}</h3>

                <p className="mt-2 text-sm leading-6 muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface2)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="hero-kicker">The workflow</div>

          <div className="mt-8 grid gap-0 md:grid-cols-3">
            {[
              [
                '01',
                'Frame the problem',
                'Describe the product, audience, market, and the evidence you already have.',
              ],
              [
                '02',
                'Build hypotheses',
                'Generate multiple personas, pain points, jobs, and journeys with explicit evidence labels.',
              ],
              [
                '03',
                'Pressure-test decisions',
                'Compare personas, chat with the research context, and identify what still needs validation.',
              ],
            ].map(([n, t, d], i) => (
              <div
                key={n}
                className={`border-t border-[var(--border)] p-6 md:border-l md:border-t-0 ${
                  i === 2 ? 'md:border-r' : ''
                }`}
              >
                <div className="text-xs font-bold text-[var(--accent2)]">
                  {n}
                </div>

                <h3 className="mt-5 text-xl font-semibold">{t}</h3>

                <p className="mt-2 text-sm leading-6 muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-8 border border-[var(--text)] bg-[var(--text)] p-8 text-[var(--bg)] sm:p-12 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent2)]">
              Ready to research?
            </div>

            <h2 className="mt-3 max-w-2xl text-3xl font-medium sm:text-4xl">
              Build products people actually need.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 opacity-70">
              Use AI to structure your thinking, not to replace conversations
              with customers.
            </p>
          </div>

          <Link
            href="/app"
            className="inline-flex shrink-0 items-center gap-2 bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white"
          >
            Open Persona Studio
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}