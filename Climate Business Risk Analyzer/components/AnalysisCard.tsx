import type { Scenario } from '@/lib/schemas'

interface AnalysisCardProps {
  scenario: Scenario
  scenarioLabel: '2C' | '3C'
}

// Server Component — no interactivity needed at render time.
// framer-motion entrance animations can be added via a "use client" wrapper later.
//
// TODO: Render in order:
//   1. Scenario header with color-coded badge
//      — 2C: top border #00C48C (greenly-primary)
//      — 3C: top border #E85D3A (greenly-danger)
//   2. <ImpactScore score={...} direction={...} />
//   3. Sector outlook (trend icon + description)
//   4. <RiskList> for supply_chain_risks (with severity badges)
//   5. <RiskList> for climate_physical_risks (with geographic_relevance tags)
//   6. <RiskList> for transition_risks
//   7. <RiskList> for operational_challenges
//   8. <RiskList> for opportunities
//   9. Executive summary paragraph
export default function AnalysisCard(_props: AnalysisCardProps) {
  return <article />
}
