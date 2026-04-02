import { z } from 'zod'

// ---------------------------------------------------------------------------
// Form input schema
// ---------------------------------------------------------------------------

export const analyzeInputSchema = z.object({
  companyName: z.string().min(1).max(200),
  sectorCode: z.string().min(1),
  sectorLabel: z.string().min(1),
  employeeRange: z.enum([
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5001-10000',
    '10000+',
  ]),
  location: z.object({
    displayName: z.string().max(300),
    lat: z.number(),
    lon: z.number(),
    scope: z.enum(['city', 'region', 'country', 'global']),
  }),
})

export type AnalyzeInput = z.infer<typeof analyzeInputSchema>

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

export const severitySchema = z.enum(['low', 'medium', 'high', 'critical'])
export type Severity = z.infer<typeof severitySchema>

// ---------------------------------------------------------------------------
// Scenario schema (shared between 2C and 3C)
// ---------------------------------------------------------------------------

export const scenarioSchema = z.object({
  overall_impact_score: z.number().min(0).max(5),
  impact_direction: z.enum(['positive', 'negative', 'mixed']),
  supply_chain_risks: z.array(
    z.object({
      risk: z.string(),
      severity: severitySchema,
      description: z.string(),
    })
  ),
  sector_outlook: z.object({
    trend: z.enum(['growth', 'stable', 'contraction', 'severe_contraction']),
    description: z.string(),
  }),
  operational_challenges: z.array(
    z.object({
      challenge: z.string(),
      description: z.string(),
    })
  ),
  climate_physical_risks: z.array(
    z.object({
      risk: z.string(),
      description: z.string(),
      geographic_relevance: z.string(),
    })
  ),
  transition_risks: z.array(
    z.object({
      risk: z.string(),
      description: z.string(),
    })
  ),
  opportunities: z.array(
    z.object({
      opportunity: z.string(),
      description: z.string(),
    })
  ),
  summary: z.string(),
})

export type Scenario = z.infer<typeof scenarioSchema>

// ---------------------------------------------------------------------------
// Full LLM response schema
// ---------------------------------------------------------------------------

export const analysisResponseSchema = z.object({
  company_name: z.string(),
  sector: z.string(),
  location: z.string(),
  scenarios: z.object({
    '2C': scenarioSchema,
    '3C': scenarioSchema,
  }),
  sources_referenced: z.array(z.string()),
  generated_at: z.string(),
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
  employeeRange: analyzeInputSchema.shape.employeeRange,
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to be contacted by Greenly.' }),
  }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
