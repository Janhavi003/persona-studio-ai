import { NextResponse } from 'next/server';
import { regenerateSection } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = await regenerateSection(body.project, body.persona, body.section);
    return NextResponse.json({ items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Regeneration failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
