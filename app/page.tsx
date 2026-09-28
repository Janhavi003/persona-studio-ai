import Link from 'next/link';
import type { ComponentType } from 'react';
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

type Feature = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
};

const features: Feature[] = [
  {
    title: 'AI Persona Generation',
    icon: BrainCircuit,
    description:
      'Turn product context into structured, editable persona hypotheses.',
  },
  {
    title: 'Pain Point Analysis',
    icon: Target,
    description:
      'Separate evidence from assumptions and turn friction into research questions.',
  },
  {
    title: 'Jobs-to-be-Done',
    icon: Sparkles,
    description:
      'Frame functional, emotional, and social jobs around the user problem.',
  },
  {
    title: 'User Journeys',
    icon: Route,
    description:
      'Map the path from awareness to retention with opportunity signals.',
  },
  {
    title: 'Persona Comparison',
    icon: GitCompareArrows,
    description:
      'Put 2–4 personas side by side to expose meaningful differences.',
  },
  {
    title: 'AI Research Chat',
    icon: MessageSquareText,
    description:
      'Interrogate the project context without falling back to generic chat.',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Describe the product',
    description:
      'Add your product context, target market, research notes, and the questions you want to answer.',
  },
  {
    number: '02',
    title: 'Generate research artifacts',
    description:
      'Build structured personas, pain points, Jobs-to-be-Done, journeys, and product opportunities.',
  },
  {
    number: '03',
    title: 'Challenge the assumptions',
    description:
      'Inspect what is known, inferred, and still needs validation before making product decisions.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navigation */}
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Persona Studio home"
          >
            <div className="flex h-9 w-9 items-center justify-center border border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]">
              <ScanSearch className="h-4 w-4" />
            </div>

            <div>
              <div className="text-sm font-semibold tracking-tight">
                Persona Studio
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.18em] muted sm:block">
                Product research workspace
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#workflow"
              className="text-sm muted transition hover:text-[var(--foreground)]"
            >
              How it works
            </a>

            <a
              href="#features"
              className="text-sm muted transition hover:text-[var(--foreground)]"
            >
              Capabilities
            </a>

            <a
              href="#principles"
              className="text-sm muted transition hover:text-[var(--foreground)]"
            >
              Research principles
            </a>
          </nav>

          <Link
            href="/app"
            className="inline-flex items-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] transition hover:opacity-85"
          >
            Open workspace
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="research-grid absolute inset-0 opacity-50" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="hero-kicker mb-6">
              AI-assisted product research
            </div>

            <h1 className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Understand who you&apos;re building for.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 muted sm:text-xl">
              Turn product ideas and research into actionable user personas,
              journeys, pain points, Jobs-to-be-Done, and product insights.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-85"
              >
                Create personas
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/app?demo=1"
                className="inline-flex items-center justify-center gap-2 border border-[var(--border-strong)] px-6 py-3.5 text-sm font-semibold transition hover:bg-[var(--surface2)]"
              >
                Explore example
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.14em] muted">
              <span>Structured outputs</span>
              <span>Editable research</span>
              <span>Validation-first</span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="absolute -inset-5 border border-dashed border-[var(--border)]" />

            <div className="relative border border-[var(--border-strong)] bg-[var(--surface)] shadow-[12px_12px_0_var(--shadow)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                    Research workspace
                  </span>
                </div>

                <span className="text-[10px] uppercase tracking-[0.14em] muted">
                  FocusFlow
                </span>
              </div>

              <div className="grid grid-cols-[150px_1fr] min-h-[430px]">
                <aside className="border-r border-[var(--border)] p-4">
                  <div className="text-[10px] uppercase tracking-[0.16em] muted">
                    Workspace
                  </div>

                  <div className="mt-5 space-y-1">
                    {[
                      'Overview',
                      'Personas',
                      'Journeys',
                      'Insights',
                      'Research chat',
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`px-3 py-2 text-xs ${
                          index === 1
                            ? 'bg-[var(--accent-soft)] font-semibold text-[var(--accent-strong)]'
                            : 'muted'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 border-t border-[var(--border)] pt-4">
                    <div className="text-[10px] uppercase tracking-[0.16em] muted">
                      Evidence
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Known</span>
                        <span className="font-medium">12</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Inferred</span>
                        <span className="font-medium">08</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Assumptions</span>
                        <span className="font-medium">05</span>
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.16em] muted">
                        Persona 01
                      </div>

                      <h3 className="mt-2 text-2xl font-medium tracking-tight">
                        Maya Chen
                      </h3>

                      <p className="mt-1 text-xs muted">
                        Remote Product Manager · Efficiency Seeker
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center border border-[var(--border)] bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                      MC
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <div className="border border-[var(--border)] p-4">
                      <div className="text-[10px] uppercase tracking-[0.14em] muted">
                        Primary goal
                      </div>

                      <p className="mt-2 text-sm leading-6">
                        Protect uninterrupted time for strategic work.
                      </p>
                    </div>

                    <div className="border border-[var(--border)] p-4">
                      <div className="text-[10px] uppercase tracking-[0.14em] muted">
                        Main friction
                      </div>

                      <p className="mt-2 text-sm leading-6">
                        Fragmented tools make priorities difficult to maintain.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 border border-[var(--border)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase tracking-[0.14em] muted">
                        Evidence status
                      </div>

                      <span className="border border-[var(--accent)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
                        Hypothesis
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Manual task switching</span>
                          <span className="muted">High</span>
                        </div>

                        <div className="mt-2 h-1 bg-[var(--surface2)]">
                          <div className="h-1 w-[82%] bg-[var(--accent)]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Context fragmentation</span>
                          <span className="muted">Medium</span>
                        </div>

                        <div className="mt-2 h-1 bg-[var(--surface2)]">
                          <div className="h-1 w-[61%] bg-[var(--terracotta)]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                    <span className="text-[10px] uppercase tracking-[0.14em] muted">
                      AI-generated hypothesis
                    </span>

                    <ArrowUpRight className="h-4 w-4 muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles strip */}
      <section
        id="principles"
        className="border-b border-[var(--border)] bg-[var(--surface2)]"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-3 lg:px-8">
          <div className="flex gap-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />

            <div>
              <div className="text-sm font-semibold">
                Evidence-aware
              </div>

              <p className="mt-1 text-xs leading-5 muted">
                User-provided research stays distinguishable from AI inference.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <BrainCircuit className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />

            <div>
              <div className="text-sm font-semibold">
                Structured by design
              </div>

              <p className="mt-1 text-xs leading-5 muted">
                Research artifacts are editable data, not one giant AI answer.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <ScanSearch className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />

            <div>
              <div className="text-sm font-semibold">
                Built to be challenged
              </div>

              <p className="mt-1 text-xs leading-5 muted">
                Every hypothesis can become the next customer research question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <div className="hero-kicker">One workspace</div>

            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              Research artifacts, not AI filler.
            </h2>

            <p className="mt-4 max-w-md leading-7 muted">
              Every output is structured so a product team can inspect it,
              edit it, challenge it, and turn it into the next research
              question.
            </p>
          </div>

          <div className="grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
            {features.map(({ title, icon: Icon, description }) => (
              <div
                key={title}
                className="bg-[var(--surface)] p-6 transition hover:bg-[var(--surface2)]"
              >
                <Icon className="h-5 w-5 text-[var(--accent)]" />

                <h3 className="mt-7 font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 muted">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        className="border-y border-[var(--border)] bg-[var(--surface2)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="hero-kicker">Research workflow</div>

            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              From product idea to researchable decisions.
            </h2>

            <p className="mt-4 leading-7 muted">
              Persona Studio keeps the process grounded in what you actually
              know while making AI-generated hypotheses useful and actionable.
            </p>
          </div>

          <div className="mt-12 grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
            {workflow.map((step) => (
              <div
                key={step.number}
                className="bg-[var(--background)] p-7"
              >
                <div className="font-mono text-xs text-[var(--accent-strong)]">
                  {step.number}
                </div>

                <h3 className="mt-8 text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research honesty */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="hero-kicker">Research honesty</div>

            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              AI can organize hypotheses. It cannot replace your users.
            </h2>
          </div>

          <div className="grid gap-4">
            <div className="border-l-2 border-[var(--accent)] pl-5">
              <div className="text-sm font-semibold">
                Known
              </div>

              <p className="mt-2 text-sm leading-6 muted">
                Information directly supplied through research notes, interviews,
                surveys, reviews, or other user-provided context.
              </p>
            </div>

            <div className="border-l-2 border-[var(--terracotta)] pl-5">
              <div className="text-sm font-semibold">
                Inferred
              </div>

              <p className="mt-2 text-sm leading-6 muted">
                AI-generated interpretations derived from the available product
                and research context.
              </p>
            </div>

            <div className="border-l-2 border-[var(--border-strong)] pl-5">
              <div className="text-sm font-semibold">
                Assumption
              </div>

              <p className="mt-2 text-sm leading-6 muted">
                A hypothesis that should be tested with real users before it
                becomes a product decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--ink)] text-[var(--paper)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--paper-muted)]">
                Persona Studio
              </div>

              <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
                Build products people actually need.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-[var(--paper-muted)]">
                Start with what you know. Use AI to explore what you might be
                missing. Then validate it with real people.
              </p>
            </div>

            <div>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 border border-[var(--paper)] bg-[var(--paper)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:opacity-85"
              >
                Open Persona Studio
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-xs muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            Persona Studio — AI-assisted product research.
          </div>

          <div>
            AI-generated personas are hypotheses, not a substitute for customer research.
          </div>
        </div>
      </footer>
    </main>
  );
}