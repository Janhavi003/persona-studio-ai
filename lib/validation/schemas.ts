import { z } from 'zod';
export const SeveritySchema = z.enum(['High','Medium','Low']);
export const EvidenceKindSchema = z.enum(['known','inferred','assumption']);
export const PainPointSchema = z.object({ title:z.string(), description:z.string(), severity:SeveritySchema, frequency:z.string(), impact:SeveritySchema, evidence:z.string(), evidenceKind:EvidenceKindSchema, potentialResponse:z.string() });
export const JTBDSchema = z.object({ type:z.enum(['Functional','Emotional','Social']), statement:z.string(), evidenceKind:EvidenceKindSchema });
export const JourneyStageSchema = z.object({ stage:z.string(), userGoal:z.string(), userAction:z.string(), emotion:z.string(), painPoint:z.string(), opportunity:z.string(), evidenceKind:EvidenceKindSchema });
export const FeatureOpportunitySchema = z.object({ feature:z.string(), problemSolved:z.string(), targetPersona:z.string(), expectedValue:z.string(), reasoning:z.string(), priority:SeveritySchema, evidenceKind:EvidenceKindSchema });
export const PersonaSchema = z.object({
  id:z.string(), name:z.string(), role:z.string(), archetype:z.string(), summary:z.string(),
  demographics:z.object({ ageRange:z.string(), occupation:z.string(), location:z.string(), experience:z.string(), incomeRange:z.string(), companySize:z.string() }),
  goals:z.array(z.string()), painPoints:z.array(PainPointSchema), motivations:z.array(z.string()), behaviors:z.array(z.string()), frustrations:z.array(z.string()), needs:z.array(z.string()), objections:z.array(z.string()), buyingTriggers:z.array(z.string()), preferredChannels:z.array(z.string()), technologyComfort:z.string(), decisionFactors:z.array(z.string()), jobsToBeDone:z.array(JTBDSchema), featureNeeds:z.array(z.string()), quotes:z.array(z.string()),
  evidence:z.object({ known:z.array(z.string()), inferred:z.array(z.string()), assumptions:z.array(z.string()) }),
  journey:z.array(JourneyStageSchema), featureOpportunities:z.array(FeatureOpportunitySchema), createdAt:z.string(), updatedAt:z.string()
});
export const PersonaGenerationSchema = z.object({ personas:z.array(PersonaSchema).min(2).max(5) });
export const SectionTextSchema = z.object({ items:z.array(z.string()).min(1).max(12) });
export const ChatSchema = z.object({ answer:z.string(), evidenceKind:z.enum(['known','inferred','assumption']), validationNote:z.string() });
export const ResearchQuestionsSchema = z.object({ questions:z.array(z.string()).min(3).max(12) });
