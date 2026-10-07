'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  Users,
  Route as RouteIcon,
  Lightbulb,
  ChevronRight,
  Trash2,
  Download,
  RefreshCw,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { Toast } from '@/components/ui/toast';

import type { Project, Persona, ProductStage } from '@/lib/types';
import { demoProject } from '@/lib/demo';

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Projects', FolderKanban],
  ['Personas', Users],
  ['Journeys', RouteIcon],
  ['Insights', Lightbulb],
  ['Chat', MessageSquare],
  ['Settings', Settings],
] as const;

type BadgeTone = 'neutral' | 'accent' | 'high' | 'medium' | 'low';

const badgeTone = (value: string): BadgeTone => {
  const normalized = value.toLowerCase();

  if (normalized === 'high') return 'high';
  if (normalized === 'medium') return 'medium';
  if (normalized === 'low') return 'low';

  return 'neutral';
};

const errorMessage = (
  error: unknown,
  fallback = 'Something went wrong.',
) => (error instanceof Error ? error.message : fallback);

const empty = (): Project => ({
  id: '',
  name: '',
  productDescription: '',
  websiteUrl: '',
  industry: '',
  stage: 'Idea',
  targetMarket: '',
  targetLocation: '',
  ageRange: '',
  occupation: '',
  experienceLevel: '',
  audience: 'B2C',
  companySize: '',
  research: {
    interviews: '',
    surveys: '',
    analytics: '',
    reviews: '',
    competitors: '',
    painPoints: '',
  },
  learningGoals: ['User goals', 'Pain points', 'Motivations'],
  personas: [],
  createdAt: '',
  updatedAt: '',
});

const initialDraft: Project = {
  id: 'draft',
  name: '',
  productDescription: '',
  websiteUrl: '',
  industry: '',
  stage: 'Idea',
  targetMarket: '',
  targetLocation: '',
  ageRange: '',
  occupation: '',
  experienceLevel: '',
  audience: 'B2C',
  companySize: '',
  research: {
    interviews: '',
    surveys: '',
    analytics: '',
    reviews: '',
    competitors: '',
    painPoints: '',
  },
  learningGoals: ['User goals', 'Pain points', 'Motivations'],
  personas: [],
  createdAt: '',
  updatedAt: '',
};

export default function App() {
  const params = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<Project | null>(() =>
    params.get('demo') ? demoProject : null,
  );
  const [page, setPage] = useState('Dashboard');
  const [wizard, setWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Project>(initialDraft);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [mobile, setMobile] = useState(false);
  const [selected, setSelected] = useState<Persona | null>(null);
  const [busy, setBusy] = useState(false);
  const [personaCount, setPersonaCount] = useState(3);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const r = await fetch('/api/projects', { cache: 'no-store' });
        const text = await r.text();

        if (!text.trim()) {
          setProjects([]);
          return;
        }

        const data = JSON.parse(text) as {
          projects?: Project[];
          error?: string;
        };

        if (!r.ok) {
          throw new Error(data.error || 'Could not load projects.');
        }

        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch {
        setProjects([]);
      }
    };

    void loadProjects();
  }, [params]);

  const save = async (p: Project) => {
    const r = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(p),
    });

    const text = await r.text();
    const d = text.trim() ? JSON.parse(text) : {};

    if (!r.ok) {
      throw new Error(d.error || 'Could not save project.');
    }

    setProjects((x) => [
      d.project,
      ...x.filter((q: Project) => q.id !== p.id),
    ]);

    setActive(d.project);

    return d.project as Project;
  };

  const remove = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });

    setProjects((x) => x.filter((p) => p.id !== id));
    setActive((a) => (a?.id === id ? null : a));
    setToast('Project deleted');
  };

  const generate = async () => {
    if (!draft.name || !draft.productDescription) {
      setToast('Product name and description are required.');
      return;
    }

    setBusy(true);

    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project: draft,
          count: personaCount,
        }),
      });

      const text = await r.text();
      const d = text.trim() ? JSON.parse(text) : {};

      if (!r.ok) {
        throw new Error(d.error || 'Persona generation failed.');
      }

      await save({
        ...draft,
        personas: d.personas,
        updatedAt: new Date().toISOString(),
      });

      setWizard(false);
      setPage('Personas');
      setToast('Personas generated');
    } catch (e: unknown) {
      setToast(errorMessage(e, 'Persona generation failed.'));
    } finally {
      setBusy(false);
    }
  };

  const filtered = useMemo(
    () =>
      projects.filter((p) =>
        `${p.name}${p.industry}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [projects, query],
  );

  const createProject = () => {
    setDraft({
      ...empty(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setPersonaCount(3);
    setStep(1);
    setWizard(true);
  };

  return (
    <div className="app-shell min-h-screen">
      <header className="app-topbar fixed inset-x-0 top-0 z-40 h-16 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </Button>

            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-white">
                P
              </span>
              <span className="hidden sm:block">Persona Studio</span>
            </Link>
          </div>

          <div className="hidden max-w-xl flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 muted" />
              <Input
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects..."
              />
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>

            <Button onClick={createProject}>
              <Plus />
              <span className="hidden sm:block">New project</span>
            </Button>
          </div>
        </div>
      </header>

      <aside
        className={`app-sidebar fixed left-0 top-[72px] z-30 h-[calc(100vh-4.5rem)] w-60 border-r border-[var(--border)] bg-[var(--surface)] p-3 lg:translate-x-0 ${
          mobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-1">
          {nav.map(([name, I]) => (
            <button
              key={name}
              onClick={() => {
                setPage(name);
                setSelected(null);
                setMobile(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                page === name
                  ? 'bg-[var(--surface2)] font-medium'
                  : 'muted hover:bg-[var(--surface2)]'
              }`}
            >
              <I className="h-4 w-4" />
              {name}
            </button>
          ))}
        </div>
      </aside>

      <main className="app-main pt-[72px] lg:pl-[252px]">
        <div className="app-content mx-auto max-w-7xl">
          {page === 'Projects' ? (
            <Projects
              projects={filtered}
              open={setActive}
              create={createProject}
              remove={remove}
            />
          ) : active ? (
            <Workspace
              project={active}
              page={page}
              select={selected}
              setSelect={setSelected}
              save={save}
              toast={setToast}
            />
          ) : (
            <Welcome
              create={createProject}
              demo={() => setActive(demoProject)}
            />
          )}
        </div>
      </main>

      <Dialog open={wizard} onClose={() => !busy && setWizard(false)}>
        <Wizard
          step={step}
          setStep={setStep}
          project={draft}
          setProject={setDraft}
          generate={generate}
          busy={busy}
          personaCount={personaCount}
          setPersonaCount={setPersonaCount}
        />
      </Dialog>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}

function Welcome({
  create,
  demo,
}: {
  create: () => void;
  demo: () => void;
}) {
  return (
    <div className="py-16">
      <Card className="mx-auto max-w-3xl text-center">
        <CardContent className="p-10">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent)] text-white">
            <Users />
          </div>

          <h1 className="mt-5 text-3xl font-semibold">
            Start your product research workspace
          </h1>

          <p className="mx-auto mt-3 max-w-xl muted">
            Create structured persona hypotheses from your product idea and
            research context.
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <Button onClick={create}>
              <Plus />
              Create project
            </Button>

            <Button variant="secondary" onClick={demo}>
              Explore demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Projects({
  projects,
  open,
  create,
  remove,
}: {
  projects: Project[];
  open: (p: Project) => void;
  create: () => void;
  remove: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm muted">Saved research workspaces.</p>
        </div>

        <Button onClick={create}>
          <Plus />
          New project
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex justify-between">
                <button className="text-left" onClick={() => open(p)}>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm muted">
                    {p.industry || 'Industry not set'}
                  </p>
                </button>

                <button
                  aria-label={`Delete ${p.name}`}
                  onClick={() => remove(p.id)}
                >
                  <Trash2 className="h-4 w-4 muted" />
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between text-xs muted">
                <span>{p.personas.length} personas</span>
                <span>
                  {new Date(p.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {!projects.length && (
          <div className="surface col-span-full rounded-xl p-10 text-center muted">
            No saved projects yet.
          </div>
        )}
      </div>
    </div>
  );
}

function Wizard({
  step,
  setStep,
  project,
  setProject,
  generate,
  busy,
  personaCount,
  setPersonaCount,
}: {
  step: number;
  setStep: (n: number) => void;
  project: Project;
  setProject: (p: Project) => void;
  generate: () => void;
  busy: boolean;
  personaCount: number;
  setPersonaCount: (n: number) => void;
}) {
  const set = <K extends keyof Project>(k: K, v: Project[K]) =>
    setProject({ ...project, [k]: v });

  const goals = [
    'User goals',
    'Pain points',
    'Motivations',
    'Buying behavior',
    'Objections',
    'Feature needs',
    'Messaging',
    'User journey',
  ];

  return (
    <div className="flex max-h-[calc(100vh-1.5rem)] min-h-0 flex-col sm:max-h-[calc(100vh-2.5rem)]">
      <CardHeader className="shrink-0 border-b border-[var(--border)]">
        <div className="text-xs text-[var(--accent)]">Step {step} of 5</div>

        <h2 className="mt-1 text-xl font-semibold">
          {
            [
              'Tell us about your product',
              'Who are you building for?',
              'What do you already know?',
              'What do you want to learn?',
              'Generate personas',
            ][step - 1]
          }
        </h2>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-5 sm:p-6">
        {step === 1 && (
          <>
            <Field label="Product name">
              <Input
                value={project.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="FocusFlow"
              />
            </Field>

            <Field label="Product description">
              <Textarea
                value={project.productDescription}
                onChange={(e) => set('productDescription', e.target.value)}
                placeholder="What does it do, for whom, and what problem does it solve?"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Website URL">
                <Input
                  value={project.websiteUrl}
                  onChange={(e) => set('websiteUrl', e.target.value)}
                />
              </Field>

              <Field label="Industry">
                <Input
                  value={project.industry}
                  onChange={(e) => set('industry', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Stage">
              <select
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5"
                value={project.stage}
                onChange={(e) =>
                  set('stage', e.target.value as ProductStage)
                }
              >
                <option value="Idea">Idea</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP">MVP</option>
                <option value="Launched">Launched</option>
                <option value="Growing">Growing</option>
              </select>
            </Field>
          </>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                'targetMarket',
                'targetLocation',
                'ageRange',
                'occupation',
                'experienceLevel',
                'companySize',
              ] as const
            ).map((k) => (
              <Field
                key={k}
                label={k.replaceAll(/([A-Z])/g, ' $1')}
              >
                <Input
                  value={project[k]}
                  onChange={(e) => set(k, e.target.value)}
                />
              </Field>
            ))}

            <Field label="Audience">
              <select
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5"
                value={project.audience}
                onChange={(e) =>
                  set(
                    'audience',
                    e.target.value as Project['audience'],
                  )
                }
              >
                <option value="B2C">B2C</option>
                <option value="B2B">B2B</option>
                <option value="Both">Both</option>
              </select>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-xs muted">
              Add only the evidence you have. You can scroll this section to
              reach the remaining research fields.
            </p>

            {Object.entries(project.research).map(([k, v]) => (
              <Field key={k} label={k}>
                <Textarea
                  className="min-h-28 resize-y"
                  value={v}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      research: {
                        ...project.research,
                        [k]: e.target.value,
                      },
                    })
                  }
                  placeholder="Optional research notes..."
                />
              </Field>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {goals.map((g) => (
              <label
                key={g}
                className="flex gap-3 rounded-lg border border-[var(--border)] p-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={project.learningGoals.includes(g)}
                  onChange={(e) =>
                    set(
                      'learningGoals',
                      e.target.checked
                        ? [...new Set([...project.learningGoals, g])]
                        : project.learningGoals.filter((x) => x !== g),
                    )
                  }
                />
                {g}
              </label>
            ))}
          </div>
        )}

        {step === 5 && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setPersonaCount(n)}
                  aria-pressed={personaCount === n}
                  className={`rounded-lg border p-4 transition ${
                    personaCount === n
                      ? 'border-[var(--accent)] bg-[var(--surface2)] text-[var(--accent)]'
                      : 'border-[var(--border)] hover:bg-[var(--surface2)]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <p className="text-sm muted">
              AI outputs are hypotheses, not validated customer research.
              Selected personas: {personaCount}.
            </p>
          </>
        )}
      </CardContent>

      <div className="sticky bottom-0 z-10 flex shrink-0 justify-between border-t border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <Button
          variant="secondary"
          disabled={step === 1 || busy}
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>

        {step < 5 ? (
          <Button onClick={() => setStep(step + 1)}>
            Continue <ChevronRight />
          </Button>
        ) : (
          <Button disabled={busy} onClick={generate}>
            {busy ? (
              <>
                <RefreshCw className="animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Personas'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium capitalize">
        {label}
      </span>
      {children}
    </label>
  );
}

function Workspace({
  project,
  page,
  select,
  setSelect,
  save,
  toast,
}: {
  project: Project;
  page: string;
  select: Persona | null;
  setSelect: (p: Persona | null) => void;
  save: (p: Project) => Promise<Project>;
  toast: (s: string) => void;
}) {
  if (select) {
    return (
      <Detail
        project={project}
        persona={select}
        back={() => setSelect(null)}
        save={save}
        toast={toast}
      />
    );
  }

  return (
    <>
      <div>
        <div className="text-sm muted">
          {project.industry || 'Product research'}
        </div>

        <h1 className="mt-1 text-2xl font-semibold">{project.name}</h1>

        <p className="mt-1 max-w-2xl text-sm muted">
          {project.productDescription}
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ['Personas', project.personas.length, Users],
            [
              'Insights',
              project.personas.reduce(
                (n, p) =>
                  n + p.painPoints.length + p.featureOpportunities.length,
                0,
              ),
              Lightbulb,
            ],
            [
              'Journeys',
              project.personas.reduce((n, p) => n + p.journey.length, 0),
              RouteIcon,
            ],
            ['Projects', 1, FolderKanban],
          ] as [string, number, LucideIcon][]
        ).map(([l, v, I]) => (
          <Card key={l}>
            <CardContent className="pt-5">
              <I className="h-5 w-5 muted" />
              <div className="mt-3 text-2xl font-semibold">{v}</div>
              <div className="text-xs muted">{l}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {page === 'Personas' ? (
        <PersonaGrid project={project} select={setSelect} />
      ) : page === 'Journeys' ? (
        <Journeys project={project} />
      ) : page === 'Insights' ? (
        <Insights project={project} />
      ) : page === 'Chat' ? (
        <Chat project={project} toast={toast} />
      ) : (
        <Dashboard project={project} select={setSelect} />
      )}
    </>
  );
}

function Dashboard({
  project,
  select,
}: {
  project: Project;
  select: (p: Persona) => void;
}) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Recent personas</h2>
        </CardHeader>

        <CardContent className="space-y-2">
          {project.personas.map((p) => (
            <button
              key={p.id}
              onClick={() => select(p)}
              className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-[var(--surface2)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface2)] font-semibold">
                {p.name
                  .split(' ')
                  .map((x) => x[0])
                  .join('')}
              </span>

              <span>
                <b>{p.name}</b>
                <span className="block text-xs muted">
                  {p.role} · {p.archetype}
                </span>
              </span>

              <ChevronRight className="ml-auto h-4 w-4 muted" />
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Research honesty</h2>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <p>
            <b>Known</b>, directly provided by you.
          </p>
          <p>
            <b>Inferred</b>, AI interpretation of supplied context.
          </p>
          <p>
            <b>Assumption</b>, a claim to validate with real users.
          </p>

          <div className="rounded-lg bg-[var(--surface2)] p-3 text-xs muted">
            AI-generated personas are hypotheses, not a substitute for
            customer research.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonaGrid({
  project,
  select,
}: {
  project: Project;
  select: (p: Persona) => void;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const chosen = project.personas.filter((p) => ids.includes(p.id));

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm muted">Select 2-4 personas to compare.</p>

        <Button
          variant="secondary"
          disabled={chosen.length < 2}
          onClick={() => setIds([])}
        >
          Clear selection
        </Button>
      </div>

      {chosen.length >= 2 && (
        <Card className="mb-5">
          <CardHeader>
            <h2 className="font-semibold">Persona comparison</h2>
            <p className="text-sm muted">
              AI-generated cross-persona analysis based on the selected
              profiles.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {chosen.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-[var(--border)] p-4"
                >
                  <b>{p.name}</b>

                  <div className="mt-1 text-xs muted">{p.role}</div>

                  <div className="mt-3 text-xs">
                    <b>Goals:</b> {p.goals.slice(0, 2).join('; ')}
                  </div>

                  <div className="mt-2 text-xs">
                    <b>Pain:</b>{' '}
                    {p.painPoints
                      .slice(0, 2)
                      .map((x) => x.title)
                      .join('; ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-[var(--surface2)] p-4 text-sm">
              Cross-persona insight: compare repeated goals, pain points,
              buying triggers, and feature needs before treating differences
              as validated segments.
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {project.personas.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex gap-3">
                <input
                  aria-label={`Compare ${p.name}`}
                  type="checkbox"
                  checked={ids.includes(p.id)}
                  onChange={(e) =>
                    setIds(
                      e.target.checked
                        ? [...ids, p.id]
                        : ids.filter((x) => x !== p.id),
                    )
                  }
                />

                <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--surface2)] font-semibold">
                  {p.name
                    .split(' ')
                    .map((x) => x[0])
                    .join('')}
                </span>

                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <div className="text-sm muted">{p.role}</div>
                  <Badge tone="accent">{p.archetype}</Badge>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 muted">{p.summary}</p>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Metric label="Goals" n={p.goals.length} />
                <Metric label="Pain" n={p.painPoints.length} />
                <Metric label="Jobs" n={p.jobsToBeDone.length} />
              </div>

              <Button
                className="mt-4 w-full"
                onClick={() => select(p)}
              >
                View persona
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, n }: { label: string; n: number }) {
  return (
    <div className="rounded-lg bg-[var(--surface2)] p-3">
      <b>{n}</b>
      <div className="muted">{label}</div>
    </div>
  );
}

function Journeys({ project }: { project: Project }) {
  return (
    <div className="mt-8 space-y-5">
      {project.personas.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <h2 className="font-semibold">{p.name} · User journey</h2>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {p.journey.map((j) => (
                <div
                  key={j.stage}
                  className="rounded-lg border border-[var(--border)] p-4"
                >
                  <Badge tone="accent">{j.stage}</Badge>

                  <p className="mt-3 text-sm font-medium">{j.userGoal}</p>

                  <p className="mt-2 text-xs muted">
                    {j.emotion} · {j.painPoint}
                  </p>

                  <p className="mt-2 text-xs text-[var(--accent)]">
                    {j.opportunity}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Insights({ project }: { project: Project }) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {project.personas.flatMap((p) =>
        p.featureOpportunities.map((x) => (
          <Card key={`${p.id}${x.feature}`}>
            <CardHeader>
              <Badge tone={badgeTone(x.priority)}>{x.priority}</Badge>

              <h2 className="mt-3 font-semibold">{x.feature}</h2>
            </CardHeader>

            <CardContent>
              <p className="text-sm">{x.problemSolved}</p>

              <p className="mt-2 text-sm muted">{x.reasoning}</p>

              <div className="mt-3 text-xs text-[var(--accent)]">
                AI-generated product opportunity
              </div>
            </CardContent>
          </Card>
        )),
      )}
    </div>
  );
}

function Chat({
  project,
  toast,
}: {
  project: Project;
  toast: (s: string) => void;
}) {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!q) return;

    setLoading(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project,
          message: q,
        }),
      });

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.error);
      }

      setA(d.answer);
      setQ('');
    } catch (e: unknown) {
      toast(errorMessage(e, 'Chat request failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto mt-8 max-w-3xl">
      <CardHeader>
        <h2 className="font-semibold">Research Chat</h2>
        <p className="text-sm muted">
          Scoped to {project.name}; generated analysis is not customer
          evidence.
        </p>
      </CardHeader>

      <CardContent>
        <div className="min-h-56 rounded-lg bg-[var(--surface2)] p-4 text-sm leading-7">
          {a || 'Try: "What assumptions should we validate?"'}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void send();
              }
            }}
            placeholder="Ask a project-specific question..."
          />

          <Button onClick={() => void send()}>
            {loading ? 'Thinking...' : 'Ask'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({
  project,
  persona,
  back,
  save,
  toast,
}: {
  project: Project;
  persona: Persona;
  back: () => void;
  save: (p: Project) => Promise<Project>;
  toast: (s: string) => void;
}) {
  const [tab, setTab] = useState('Overview');
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(persona.name);
  const [summary, setSummary] = useState(persona.summary);
  const [busy, setBusy] = useState(false);

  const update = async () => {
    await save({
      ...project,
      personas: project.personas.map((p) =>
        p.id === persona.id
          ? {
              ...p,
              name,
              summary,
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
      updatedAt: new Date().toISOString(),
    });

    setEdit(false);
    toast('Persona updated');
  };

  const regen = async (section: string) => {
    setBusy(true);

    try {
      const r = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project,
          persona,
          section,
        }),
      });

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.error);
      }

      await save({
        ...project,
        personas: project.personas.map((p) =>
          p.id === persona.id
            ? {
                ...p,
                [section]: d.items,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
        updatedAt: new Date().toISOString(),
      });

      toast('Section regenerated');
    } catch (e: unknown) {
      toast(errorMessage(e, 'Section regeneration failed.'));
    } finally {
      setBusy(false);
    }
  };

  const exportMd = () => {
    const s = `# ${persona.name}

**${persona.role} · ${persona.archetype}**

${persona.summary}

## Goals
${persona.goals.map((x) => '- ' + x).join('\n')}

## Pain Points
${persona.painPoints
  .map((x) => '- ' + x.title + ' - ' + x.description)
  .join('\n')}

## Jobs-to-be-Done
${persona.jobsToBeDone
  .map((x) => '- ' + x.type + ': ' + x.statement)
  .join('\n')}

> AI-generated persona hypothesis, not actual customer research.`;

    const a = document.createElement('a');

    a.href = URL.createObjectURL(
      new Blob([s], { type: 'text/markdown' }),
    );

    a.download =
      persona.name.replaceAll(' ', '-').toLowerCase() + '.md';

    a.click();

    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <button
        onClick={back}
        className="mb-5 inline-flex items-center gap-2 text-sm muted"
      >
        <ArrowLeft />
        Back to personas
      </button>

      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--surface2)] text-xl font-semibold">
            {persona.name
              .split(' ')
              .map((x) => x[0])
              .join('')}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{persona.name}</h1>

            <div className="muted">{persona.role}</div>

            <Badge tone="accent">{persona.archetype}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setEdit(!edit)}
          >
            Edit
          </Button>

          <Button variant="secondary" onClick={exportMd}>
            <Download />
            Export
          </Button>
        </div>
      </div>

      {edit && (
        <Card className="mt-5">
          <CardContent className="space-y-4 pt-5">
            <Field label="Name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field label="Summary">
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </Field>

            <Button onClick={() => void update()}>Save</Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-7 flex overflow-x-auto border-b border-[var(--border)]">
        {[
          'Overview',
          'Goals & Pain Points',
          'Behavior',
          'Buying Behavior',
          'Jobs-to-be-Done',
          'Feature Needs',
          'Journey',
          'AI Chat',
          'Validate Assumptions',
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm ${
              tab === t
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <List title="Summary" items={[persona.summary]} />
          <List title="Goals" items={persona.goals} />
          <List title="Motivations" items={persona.motivations} />
          <List title="Frustrations" items={persona.frustrations} />
        </div>
      )}

      {tab === 'Goals & Pain Points' && (
        <div className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {persona.painPoints.map((x) => (
              <Card key={x.title}>
                <CardHeader>
                  <Badge tone={badgeTone(x.severity)}>
                    {x.severity}
                  </Badge>

                  <h2 className="mt-2 font-semibold">{x.title}</h2>

                  <p className="mt-2 text-sm muted">
                    {x.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="text-xs muted">
                    {x.frequency} · {x.impact} impact · {x.evidenceKind}
                  </div>

                  <div className="mt-3 rounded-lg bg-[var(--surface2)] p-3 text-xs">
                    Potential response: {x.potentialResponse}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            className="mt-4"
            variant="secondary"
            disabled={busy}
            onClick={() => void regen('painPoints')}
          >
            {busy ? 'Regenerating...' : 'Regenerate pain points'}
          </Button>
        </div>
      )}

      {tab === 'Behavior' && (
        <List title="Behavioral patterns" items={persona.behaviors} />
      )}

      {tab === 'Buying Behavior' && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <List title="Triggers" items={persona.buyingTriggers} />
          <List title="Objections" items={persona.objections} />
          <List
            title="Decision factors"
            items={persona.decisionFactors}
          />
        </div>
      )}

      {tab === 'Jobs-to-be-Done' && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {persona.jobsToBeDone.map((j) => (
            <Card key={j.statement}>
              <CardHeader>
                <Badge tone="accent">{j.type}</Badge>

                <p className="mt-3 text-sm leading-6">{j.statement}</p>
              </CardHeader>

              <CardContent>
                <span className="text-xs muted">{j.evidenceKind}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Feature Needs' && (
        <List title="Feature needs" items={persona.featureNeeds} />
      )}

      {tab === 'Journey' && (
        <Journeys
          project={{
            ...project,
            personas: [persona],
          }}
        />
      )}

      {tab === 'AI Chat' && (
        <PersonaChat
          project={project}
          persona={persona}
          toast={toast}
        />
      )}

      {tab === 'Validate Assumptions' && (
        <Validation persona={persona} />
      )}
    </div>
  );
}

function List({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="font-semibold">{title}</h2>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {x}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function Validation({ persona }: { persona: Persona }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <List title="Known" items={persona.evidence.known} />
      <List title="Inferred" items={persona.evidence.inferred} />
      <List
        title="Assumptions to validate"
        items={persona.evidence.assumptions}
      />

      <Card className="md:col-span-3">
        <CardHeader>
          <h2 className="font-semibold">
            Recommended research questions
          </h2>
        </CardHeader>

        <CardContent>
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            <li>How often do users experience this problem?</li>
            <li>What do they currently use instead?</li>
            <li>What would make them switch?</li>
            <li>
              What evidence would make this assumption false?
            </li>
            <li>
              How do users describe the problem in their own words?
            </li>
            <li>
              What would they do if this product did not exist?
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonaChat({
  project,
  persona,
  toast,
}: {
  project: Project;
  persona: Persona;
  toast: (s: string) => void;
}) {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!q) return;

    setLoading(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          project,
          persona,
          message: q,
        }),
      });

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.error);
      }

      setA(d.answer);
      setQ('');
    } catch (e: unknown) {
      toast(errorMessage(e, 'Chat request failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="font-semibold">Chat with {persona.name}</h2>

        <p className="text-xs muted">
          Simulated response based on the generated persona, not actual
          customer feedback.
        </p>
      </CardHeader>

      <CardContent>
        <div className="min-h-44 rounded-lg bg-[var(--surface2)] p-4 text-sm leading-7">
          {a || 'Ask: "What would make you buy this product?"'}
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void send();
              }
            }}
            placeholder="Ask the persona..."
          />

          <Button onClick={() => void send()}>
            {loading ? 'Thinking...' : 'Ask'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}