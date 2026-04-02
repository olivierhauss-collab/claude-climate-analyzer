'use client'

interface SectorInputProps {
  value: string
  onChange: (code: string, label: string) => void
}

// TODO: Load data/nace-taxonomy.json and filter client-side as user types
// TODO: Group dropdown by section (A–U)
// TODO: User MUST select from list only — no freeform entry accepted
// TODO: Keyboard-navigable (ARIA: role="combobox")
// TODO: Display: human-readable label + code as secondary text
export default function SectorInput(_props: SectorInputProps) {
  return <div />
}
