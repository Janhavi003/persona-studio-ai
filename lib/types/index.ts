export type EvidenceKind = 'known' | 'inferred' | 'assumption';
export type Priority = 'High' | 'Medium' | 'Low';
export type Severity = 'High' | 'Medium' | 'Low';
export type ProductStage = 'Idea' | 'Prototype' | 'MVP' | 'Launched' | 'Growing';

export interface PainPoint { title: string; description: string; severity: Severity; frequency: string; impact: Severity; evidence: string; evidenceKind: EvidenceKind; potentialResponse: string; }
export interface JTBD { type: 'Functional' | 'Emotional' | 'Social'; statement: string; evidenceKind: EvidenceKind; }
export interface JourneyStage { stage: string; userGoal: string; userAction: string; emotion: string; painPoint: string; opportunity: string; evidenceKind: EvidenceKind; }
export interface FeatureOpportunity { feature: string; problemSolved: string; targetPersona: string; expectedValue: string; reasoning: string; priority: Priority; evidenceKind: EvidenceKind; }
export interface Persona {
  id: string; name: string; role: string; archetype: string; summary: string;
  demographics: { ageRange: string; occupation: string; location: string; experience: string; incomeRange: string; companySize: string };
  goals: string[]; painPoints: PainPoint[]; motivations: string[]; behaviors: string[]; frustrations: string[]; needs: string[]; objections: string[]; buyingTriggers: string[]; preferredChannels: string[]; technologyComfort: string; decisionFactors: string[]; jobsToBeDone: JTBD[]; featureNeeds: string[]; quotes: string[];
  evidence: { known: string[]; inferred: string[]; assumptions: string[] };
  journey: JourneyStage[]; featureOpportunities: FeatureOpportunity[];
  createdAt: string; updatedAt: string;
}
export interface ResearchNotes { interviews: string; surveys: string; analytics: string; reviews: string; competitors: string; painPoints: string; }
export interface Project {
  id: string; name: string; productDescription: string; websiteUrl: string; industry: string; stage: ProductStage;
  targetMarket: string; targetLocation: string; ageRange: string; occupation: string; experienceLevel: string; audience: 'B2B' | 'B2C' | 'Both'; companySize: string;
  research: ResearchNotes; learningGoals: string[]; personas: Persona[]; createdAt: string; updatedAt: string;
}
