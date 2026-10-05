import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
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

const GeminiPersonaSchema = z.object({
  personas: z.array(z.object({
    name: z.string(),
    role: z.string(),
    archetype: z.string(),
    summary: z.string(),
    ageRange: z.string(),
    occupation: z.string(),
    location: z.string(),
    experience: z.string(),
    incomeRange: z.string(),
    companySize: z.string(),
    goals: z.array(z.string()),
    painPoints: z.array(z.string()),
    motivations: z.array(z.string()),
    behaviors: z.array(z.string()),
    frustrations: z.array(z.string()),
    needs: z.array(z.string()),
    objections: z.array(z.string()),
    buyingTriggers: z.array(z.string()),
    preferredChannels: z.array(z.string()),
    technologyComfort: z.string(),
    decisionFactors: z.array(z.string()),
    jobsToBeDone: z.array(z.string()),
    featureNeeds: z.array(z.string()),
    quotes: z.array(z.string()),
    knownEvidence: z.array(z.string()),
    inferredEvidence: z.array(z.string()),
    assumptions: z.array(z.string()),
  })).min(2).max(5),
});

export async function generatePersonas(project: Project, count: number) {
  const compactSchema = zodToJsonSchema(GeminiPersonaSchema, { $refStrategy: 'none' }) as Record<string, unknown>;
  delete compactSchema.$schema;

  const c = client();
  if (!c) throw new Error('GEMINI_API_KEY is not configured. Add it to .env.local and restart the dev server.');

  try {
    const response = await c.models.generateContent({
      model,
      contents: `You are a product research analyst. Generate exactly ${count} distinct persona hypotheses from the supplied product and research context. Keep demographics broad unless directly supplied. Never invent statistics. Clearly separate known evidence, inference, and assumptions. Return only JSON matching the requested schema.\n\nINPUT:\n${context(project)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: compactSchema,
        temperature: 0.4,
      },
    });

    if (!response.text) throw new Error('Gemini returned an empty response.');
    const result = GeminiPersonaSchema.parse(JSON.parse(response.text));

    return result.personas.map((x) => {
      const now = new Date().toISOString();
      return {
        id: crypto.randomUUID(),
        name: x.name,
        role: x.role,
        archetype: x.archetype,
        summary: x.summary,
        demographics: {
          ageRange: x.ageRange,
          occupation: x.occupation,
          location: x.location,
          experience: x.experience,
          incomeRange: x.incomeRange,
          companySize: x.companySize,
        },
        goals: x.goals,
        painPoints: x.painPoints.map((description) => ({
          title: description.length > 60 ? `${description.slice(0, 57)}...` : description,
          description,
          severity: 'Medium' as const,
          frequency: 'Not established',
          impact: 'Medium' as const,
          evidence: '',
          evidenceKind: 'assumption' as const,
          potentialResponse: '',
        })),
        motivations: x.motivations,
        behaviors: x.behaviors,
        frustrations: x.frustrations,
        needs: x.needs,
        objections: x.objections,
        buyingTriggers: x.buyingTriggers,
        preferredChannels: x.preferredChannels,
        technologyComfort: x.technologyComfort,
        decisionFactors: x.decisionFactors,
        jobsToBeDone: x.jobsToBeDone.map((statement) => ({
          type: 'Functional' as const,
          statement,
          evidenceKind: 'assumption' as const,
        })),
        featureNeeds: x.featureNeeds,
        quotes: x.quotes,
        evidence: {
          known: x.knownEvidence,
          inferred: x.inferredEvidence,
          assumptions: x.assumptions,
        },
        journey: [
          'Awareness', 'Consideration', 'Decision', 'Onboarding',
          'First Use', 'Regular Use', 'Retention',
        ].map((stage) => ({
          stage,
          userGoal: x.goals[0] || 'Understand whether the product solves an important problem',
          userAction: 'Explore and evaluate the product',
          emotion: 'Uncertain',
          painPoint: x.painPoints[0] || 'Pain point not yet validated',
          opportunity: x.featureNeeds[0] || 'Validate the user need through research',
          evidenceKind: 'assumption' as const,
        })),
        featureOpportunities: x.featureNeeds.slice(0, 6).map((feature) => ({
          feature,
          problemSolved: x.painPoints[0] || 'Problem requires validation',
          targetPersona: x.name,
          expectedValue: 'Potentially reduce friction for this persona',
          reasoning: 'AI-generated opportunity derived from the persona hypothesis.',
          priority: 'Medium' as const,
          evidenceKind: 'assumption' as const,
        })),
        createdAt: now,
        updatedAt: now,
      };
    });
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('Gemini returned malformed JSON. Please try again.');
    if (error instanceof z.ZodError) throw new Error(`Gemini returned data that did not match the persona schema: ${error.issues[0]?.message || 'invalid response'}`);
    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) throw error;
    const message = error instanceof Error ? error.message : 'Unknown Gemini error.';
    throw new Error(`Gemini request failed: ${message}`);
  }
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
