import { NextResponse } from 'next/server';
import { listProjects, saveProject } from '@/lib/db';
import { ProjectSchema } from '@/lib/validation/project';

export async function GET() {
  try {
    return NextResponse.json({ projects: listProjects() });
  } catch {
    return NextResponse.json({ error: 'Could not load projects.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const project = ProjectSchema.parse(await req.json());
    return NextResponse.json({ project: saveProject(project) });
  } catch (error: unknown) {
    const isValidationError =
      typeof error === 'object' &&
      error !== null &&
      'issues' in error;

    return NextResponse.json(
      { error: isValidationError ? 'Invalid project data.' : 'Could not save project.' },
      { status: 400 },
    );
  }
}
