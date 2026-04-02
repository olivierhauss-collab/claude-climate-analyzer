'use client'

interface CompanyInputProps {
  value: string
  onChange: (value: string) => void
  country?: string
}

// TODO: Debounced autocomplete (300ms) calling /api/companies?q={value}&country={country}
// TODO: Keyboard-navigable dropdown (ARIA: role="combobox" + role="listbox" + role="option")
// TODO: sessionStorage cache for repeated queries
// TODO: Fail silently if API unavailable — degrade to plain text input
// TODO: Min touch target 48px, accessible <label>
export default function CompanyInput(_props: CompanyInputProps) {
  return <div />
}
