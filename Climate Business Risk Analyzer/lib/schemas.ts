import { z } from 'zod'

// ---------------------------------------------------------------------------
// Form input schema
// ---------------------------------------------------------------------------

export const employeeRangeSchema = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10000+',
])

export type EmployeeRange = z.infer<typeof employeeRangeSchema>

export const geographicScopeSchema = z.enum(['city', 'region', 'country', 'global'])
export type GeographicScope = z.infer<typeof geographicScopeSchema>

export const analyzeInputSchema = z.object({
  companyName: z.string().min(1).max(200),
  sectorCode: z.string().min(1),
  sectorLabel: z.string().min(1),
  employeeRange: employeeRangeSchema,
  location: z.object({
    displayName: z.string().max(300),
    lat: z.number(),
    lon: z.number(),
    scope: geographicScopeSchema,
  }),
})

export type AnalyzeInput = z.infer<typeof analyzeInputSchema>

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

export const severitySchema = z.enum(['low', 'moderate', 'high', 'critical'])
export type Severity = z.infer<typeof severitySchema>

export const impactDirectionSchema = z.enum(['positive', 'negative', 'mixed'])
export type ImpactDirection = z.infer<typeof impactDirectionSchema>

export const trendSchema = z.enum([
  'strong_growth',
  'growth',
  'stable',
  'contraction',
  'severe_contraction',
])
export type Trend = z.infer<typeof trendSchema>

export const trendIconSchema = z.enum(['↑', '↗', '→', '↘', '↓'])
export type TrendIcon = z.infer<typeof trendIconSchema>

export const horizonSchema = z.enum(['2030', '2040', '2050'])
export type Horizon = z.infer<typeof horizonSchema>

export const transitionRiskCategorySchema = z.enum([
  'regulatory',
  'technological',
  'market',
  'reputational',
])
export type TransitionRiskCategory = z.infer<typeof transitionRiskCategorySchema>

export const potentialSchema = z.enum(['low', 'moderate', 'high'])
export type Potential = z.infer<typeof potentialSchema>

// ---------------------------------------------------------------------------
// Verdict schema
// ---------------------------------------------------------------------------

export const verdictSchema = z.object({
  impact_score: z.number().min(0).max(5),
  impact_direction: impactDirectionSchema,
  headline: z.string(),
  summary: z.string(),
})

export type Verdict = z.infer<typeof verdictSchema>

// ---------------------------------------------------------------------------
// Sector outlook schema
// ---------------------------------------------------------------------------

export const sectorOutlookSchema = z.object({
  trend: trendSchema,
  trend_icon: trendIconSchema,
  horizon: horizonSchema,
  description: z.string(),
})

export type SectorOutlook = z.infer<typeof sectorOutlookSchema>

// ---------------------------------------------------------------------------
// Risk schemas
// ---------------------------------------------------------------------------

export const physicalRiskSchema = z.object({
  risk: z.string(),
  severity: severitySchema,
  geographic_relevance: z.string(),
  description: z.string(),
  data_point: z.string().nullable(),
})

export type PhysicalRisk = z.infer<typeof physicalRiskSchema>

export const transitionRiskSchema = z.object({
  risk: z.string(),
  category: transitionRiskCategorySchema,
  severity: severitySchema,
  description: z.string(),
  timeline: z.string().nullable(),
})

export type TransitionRisk = z.infer<typeof transitionRiskSchema>

export const supplyChainRiskSchema = z.object({
  risk: z.string(),
  severity: severitySchema,
  description: z.string(),
  affected_inputs: z.array(z.string()),
})

export type SupplyChainRisk = z.infer<typeof supplyChainRiskSchema>

export const operationalImpactSchema = z.object({
  impact: z.string(),
  severity: severitySchema,
  description: z.string(),
  cost_indicator: z.string().nullable(),
})

export type OperationalImpact = z.infer<typeof operationalImpactSchema>

export const opportunitySchema = z.object({
  opportunity: z.string(),
  potential: potentialSchema,
  description: z.string(),
})

export type Opportunity = z.infer<typeof opportunitySchema>

// ---------------------------------------------------------------------------
// Scenario schema (shared between 2C and 3C)
// ---------------------------------------------------------------------------

export const scenarioSchema = z.object({
  verdict: verdictSchema,
  sector_outlook: sectorOutlookSchema,
  physical_risks: z.array(physicalRiskSchema),
  transition_risks: z.array(transitionRiskSchema),
  supply_chain_risks: z.array(supplyChainRiskSchema),
  operational_impacts: z.array(operationalImpactSchema),
  opportunities: z.array(opportunitySchema),
  executive_summary: z.string(),
})

export type Scenario = z.infer<typeof scenarioSchema>

// ---------------------------------------------------------------------------
// Full LLM response schema
// ---------------------------------------------------------------------------

export const analysisResponseSchema = z.object({
  company_name: z.string(),
  sector_code: z.string(),
  sector_label: z.string(),
  location: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  geographic_scope: geographicScopeSchema,
  employee_range: z.string(),
  generated_at: z.string(),
  scenarios: z.object({
    '2C': scenarioSchema,
    '3C': scenarioSchema,
  }),
  methodology_note: z.string(),
  sources_referenced: z.array(z.string()),
})

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>

// ---------------------------------------------------------------------------
// Contact form schema
// ---------------------------------------------------------------------------

export const contactFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().min(1),
  jobTitle: z.string().min(1),
  sectorCode: z.string().min(1),
  employeeRange: employeeRangeSchema,
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to be contacted by Greenly.' }),
  }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
