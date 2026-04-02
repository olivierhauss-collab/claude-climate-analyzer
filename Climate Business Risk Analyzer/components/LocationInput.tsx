'use client'

export interface LocationValue {
  displayName: string
  lat: number
  lon: number
  scope: 'city' | 'region' | 'country' | 'global'
}

interface LocationInputProps {
  value: LocationValue | null
  onChange: (location: LocationValue) => void
}

// TODO: Debounced autocomplete (300ms) calling /api/geocode?q={value}
// TODO: Static "Worldwide" option always available: { lat: 0, lon: 0, scope: 'global' }
// TODO: Keyboard-navigable dropdown (ARIA)
// TODO: Fail silently if API unavailable — degrade to plain text input
export default function LocationInput(_props: LocationInputProps) {
  return <div />
}
