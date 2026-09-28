import { GoogleGenAI } from '@google/genai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { PersonaGenerationSchema, SectionTextSchema, ChatSchema, ResearchQuestionsSchema } from '../validation/schemas';
import type { Project, Persona } from '../types';

const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

function client() {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

function jsonSchema(schema: Parameters<typeof zodToJsonSchema>[0]) {
  const generated = zodToJsonSchema(schema, { $refStrategy: 'none' }) as Record<string, unknown>;
  delete generated.$schema;
  return generated;
}

function context(p: Project) {
  return JSON.stringify({
    product: p.name,
    description: p.productDescription,
    industry: p.industry,
    stage: p.stage,
    target: {
      market: p.targetMarket,
      location: p.targetLocation,
      age: p.ageRange,
      occupation: p.occupation,
      experience: p.experienceLevel,
      audience: p.audience,
      companySize: p.companySize,
    },
    research: p.research,
    learningGoals: p.learningGoals,
  });
}

async function generate<T>(schema: Parameters<typeof zodToJsonSchema>[0], instructions: string, input: string, parser: (value: unknown) => T) {
  const c = client();
  if (!c) throw new Error('GEMINI_API_KEY is not configured. Add it to .env.local and restart the dev server.');

  try {
    const response = await c.models.generateContent({
      model,
      contents: `${instructions}\n\nINPUT:\n${input}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: jsonSchema(schema),
        temperature: 0.4,
      },
    });

    if (!response.text) throw new Error('Gemini returned an empty response.');
    return parser(JSON.parse(response.text));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('Gemini returned malformed JSON. Please try again.');
    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) throw error;
    const message = error instanceof Error ? error.message : 'Unknown Gemini error.';
    throw new Error(`Gemini request failed: ${message}`);
  }
}

export async function generatePersonas(project: Project, count: number) {
  const result = await generate(
    PersonaGenerationSchema,
    `You are a product research analyst. Generate ${count} distinct, practical persona hypotheses from the supplied context. Never present assumptions as validated research. Mark evidence as known, inferred, or assumption. Keep demographics broad unless directly supplied. Avoid invented statistics. Return useful product-research artifacts.`,
    context(project),
    value => PersonaGenerationSchema.parse(value),
  );

  return result.personas.map(x => ({
    ...x,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export async function regenerateSection(project: Project, persona: Persona, section: string) {
  const result = await generate(
    SectionTextSchema,
    `You are improving one section of a product persona. Return only a list of replacement strings. Section: ${section}. Use project and persona context. Be explicit about inference versus evidence where relevant.`,
    JSON.stringify({ project: context(project), persona, section }),
    value => SectionTextSchema.parse(value),
  );
  return result.items;
}

export async function chat(project: Project, persona: Persona | undefined, message: string) {
  return generate(
    ChatSchema,
    `You are a product research assistant scoped only to this project. Distinguish user-provided research, AI inference, and hypotheses. If asked to speak as a persona, explicitly frame the answer as a simulated perspective. Never claim generated content is actual customer feedback.`,
    JSON.stringify({ project: context(project), persona: persona || null, userMessage: message }),
    value => ChatSchema.parse(value),
  );
}

export async function interviewQuestions(project: Project, persona: Persona) {
  const result = await generate(
    ResearchQuestionsSchema,
    'Generate neutral customer interview questions designed to validate the biggest assumptions in this persona. Avoid leading questions.',
    JSON.stringify({ project: context(project), persona }),
    value => ResearchQuestionsSchema.parse(value),
  );
  return result.questions;
}
