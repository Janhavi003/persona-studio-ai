import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  SectionTextSchema,
  ChatSchema,
  ResearchQuestionsSchema,
} from '../validation/schemas';
import type { Project, Persona } from '../types';

const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const fallbackModel = process.env.GROQ_FALLBACK_MODEL || 'openai/gpt-oss-20b';
const maxAttempts = 3;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

type JsonSchema = Record<string, unknown>;

type GroqResponse = {
  choices?: Array<{
    message?: { content?: string | null };
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: string | number;
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /(?:\b408\b|\b409\b|\b429\b|\b500\b|\b502\b|\b503\b|\b504\b|rate.?limit|overload|temporar|timeout|timed out|service unavailable)/i.test(message);
}

function modelCandidates() {
  return [...new Set([model, fallbackModel])];
}

function strictJsonSchema(schema: JsonSchema): JsonSchema {
  const clone = JSON.parse(JSON.stringify(schema)) as JsonSchema;

  const visit = (node: unknown): void => {
    if (!node || typeof node !== 'object') return;

    const object = node as Record<string, unknown>;

    if (object.type === 'object' && object.properties && typeof object.properties === 'object') {
      object.additionalProperties = false;
      object.required = Object.keys(object.properties as Record<string, unknown>);
    }

    if (Array.isArray(object.type)) {
      // Groq strict structured outputs require every field to be required.
      // Nullable values are represented as ["string", "null"] by the schema converter.
    }

    for (const value of Object.values(object)) {
      if (value && typeof value === 'object') visit(value);
    }
  };

  visit(clone);
  return clone;
}

function jsonSchema(schema: Parameters<typeof zodToJsonSchema>[0]) {
  const generated = zodToJsonSchema(schema, { $refStrategy: 'none' }) as JsonSchema;
  delete generated.$schema;
  return strictJsonSchema(generated);
}

async function requestGroq(
  candidate: string,
  schema: JsonSchema,
  contents: string,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured. Add it to .env.local and restart the dev server.');
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: candidate,
      messages: [
        {
          role: 'system',
          content:
            'You are a careful product research analyst. Follow the requested JSON schema exactly. Never invent research, statistics, customer quotes, or facts. Clearly separate supplied evidence from inference and assumptions.',
        },
        { role: 'user', content: contents },
      ],
      temperature: 0.4,
      reasoning_effort: 'low',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'persona_studio_response',
          strict: true,
          schema,
        },
      },
    }),
  });

  const raw = await response.text();
  let data: GroqResponse = {};

  try {
    data = raw.trim() ? (JSON.parse(raw) as GroqResponse) : {};
  } catch {
    throw new Error(`Groq returned a non-JSON HTTP response (${response.status}).`);
  }

  if (!response.ok) {
    const detail = data.error?.message || `HTTP ${response.status}`;
    throw new Error(`Groq API ${response.status}: ${detail}`);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq returned an empty response.');
  return content;
}

async function generateWithResilience(schema: JsonSchema, contents: string) {
  let lastError: unknown;

  for (const candidate of modelCandidates()) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        return await requestGroq(candidate, schema, contents);
      } catch (error) {
        lastError = error;
        if (!isRetryable(error)) throw error;

        const delay = Math.min(5000, 700 * 2 ** attempt) + Math.floor(Math.random() * 300);
        if (attempt < maxAttempts - 1) await sleep(delay);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Groq request failed after retries.');
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

async function generate<T>(
  schema: Parameters<typeof zodToJsonSchema>[0],
  instructions: string,
  input: string,
  parser: (value: unknown) => T,
) {
  try {
    const response = await generateWithResilience(
      jsonSchema(schema),
      `${instructions}\n\nINPUT:\n${input}`,
    );

    try {
      return parser(JSON.parse(response));
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Groq returned malformed JSON. Please try again.');
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Groq returned data that did not match the requested schema: ${error.issues[0]?.message || 'invalid response'}`);
    }
    if (error instanceof Error && error.message.includes('GROQ_API_KEY')) throw error;
    const message = error instanceof Error ? error.message : 'Unknown Groq error.';
    throw new Error(`Groq request failed: ${message}`);
  }
}

const GroqPersonaSchema = z.object({
  personas: z
    .array(
      z.object({
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
      }),
    )
    .min(2)
    .max(5),
});

export async function generatePersonas(project: Project, count: number) {
  try {
    const result = GroqPersonaSchema.parse(
      JSON.parse(
        await generateWithResilience(
          jsonSchema(GroqPersonaSchema),
          `Generate exactly ${count} distinct persona hypotheses from the supplied product and research context. Keep demographics broad unless directly supplied. Never invent statistics. Never invent direct customer quotes; if no quote is supplied, return an empty quotes array. Clearly separate known evidence, inference, and assumptions. Keep each list concise so the response remains practical. Return only JSON matching the requested schema.\n\nINPUT:\n${context(project)}`,
        ),
      ),
    );

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
          'Awareness',
          'Consideration',
          'Decision',
          'Onboarding',
          'First Use',
          'Regular Use',
          'Retention',
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
    if (error instanceof SyntaxError) throw new Error('Groq returned malformed JSON. Please try again.');
    if (error instanceof z.ZodError) {
      throw new Error(
        `Groq returned data that did not match the persona schema: ${error.issues[0]?.message || 'invalid response'}`,
      );
    }
    if (error instanceof Error && error.message.includes('GROQ_API_KEY')) throw error;
    const message = error instanceof Error ? error.message : 'Unknown Groq error.';
    throw new Error(`Groq request failed: ${message}`);
  }
}

export async function regenerateSection(project: Project, persona: Persona, section: string) {
  const result = await generate(
    SectionTextSchema,
    `You are improving one section of a product persona. Return only a list of replacement strings. Section: ${section}. Use project and persona context. Be explicit about inference versus evidence where relevant.`,
    JSON.stringify({ project: context(project), persona, section }),
    (value) => SectionTextSchema.parse(value),
  );
  return result.items;
}

export async function chat(project: Project, persona: Persona | undefined, message: string) {
  return generate(
    ChatSchema,
    `You are a product research assistant scoped only to this project. Distinguish user-provided research, AI inference, and hypotheses. If asked to speak as a persona, explicitly frame the answer as a simulated perspective. Never claim generated content is actual customer feedback.`,
    JSON.stringify({ project: context(project), persona: persona || null, userMessage: message }),
    (value) => ChatSchema.parse(value),
  );
}

export async function interviewQuestions(project: Project, persona: Persona) {
  const result = await generate(
    ResearchQuestionsSchema,
    'Generate neutral customer interview questions designed to validate the biggest assumptions in this persona. Avoid leading questions.',
    JSON.stringify({ project: context(project), persona }),
    (value) => ResearchQuestionsSchema.parse(value),
  );
  return result.questions;
}
