import { NextResponse } from 'next/server';
import { generatePersonas } from '@/lib/ai';
import { ProjectSchema } from '@/lib/validation/project';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project = ProjectSchema.parse({
      ...body.project,
      personas: body.project?.personas?.filter(Boolean) || [],
    });
    const count = Math.min(5, Math.max(2, Number(body.count) || 3));
    const personas = await generatePersonas(project, count);
    return NextResponse.json({ personas });
  } catch (error: unknown) {
    console.error('[POST /api/generate]', error);

    if (error instanceof Error && error.message.includes('GROQ_API_KEY')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message.startsWith('Groq request failed:')) {
      const transient = /(?:\b408\b|\b409\b|\b429\b|\b500\b|\b502\b|\b503\b|\b504\b|rate.?limit|overload|temporar|timeout|timed out|service unavailable)/i.test(error.message);
      return NextResponse.json(
        {
          error: transient
            ? 'Groq is temporarily busy or rate-limited. Persona Studio retried the request and tried the fallback model. Please try again in a moment.'
            : 'Groq could not complete the generation request. Check your API key, quota, and model configuration.',
        },
        { status: transient ? 503 : 502 },
      );
    }

    if (error instanceof Error && error.message.startsWith('Groq returned data')) {
      return NextResponse.json(
        { error: 'Groq returned an unexpected persona structure. Please try generating again.' },
        { status: 502 },
      );
    }

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Some project inputs are incomplete or invalid. Please review the wizard fields and try again.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Persona generation failed. Check the project inputs and try again.' },
      { status: 400 },
    );
  }
}
