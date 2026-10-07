import { NextResponse } from 'next/server';
import { chat } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (typeof body.message !== 'string' || !body.message.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const result = await chat(
      body.project,
      body.persona,
      body.message.slice(0, 4000),
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Chat failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
