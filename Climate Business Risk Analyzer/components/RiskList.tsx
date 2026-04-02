import type { Severity } from '@/lib/schemas'

export interface RiskItem {
  label: string
  description: string
  severity?: Severity
  geographicRelevance?: string
}

interface RiskListProps {
  title: string
  items: RiskItem[]
}

// TODO: Render section title + list of risk items
// TODO: Severity badge colors (chip): low=green · medium=yellow · high=orange · critical=red
// TODO: Never use color as the sole indicator — pair badge with text label
// TODO: Geographic relevance rendered as a secondary tag when present
export default function RiskList(_props: RiskListProps) {
  return <section />
}
