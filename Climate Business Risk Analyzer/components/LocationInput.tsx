'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface LocationValue {
  displayName: string
  lat: number
  lon: number
  scope: 'city' | 'region' | 'country' | 'global'
}

interface LocationInputProps {
  value: LocationValue | null
  onChange: (location: LocationValue) => void
  error?: string
}

interface GeocodeSuggestion {
  display_name: string
  lat: number
  lon: number
  scope: 'city' | 'region' | 'country' | 'global'
}

export default function LocationInput({ value, onChange, error }: LocationInputProps) {
  const [query, setQuery] = useState(value?.displayName ?? '')
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      if (!res.ok) return
      const data = (await res.json()) as GeocodeSuggestion[]
      setSuggestions(data)
      setIsOpen(data.length > 0)
      setActiveIndex(-1)
    } catch {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchSuggestions])

  const selectSuggestion = (s: GeocodeSuggestion) => {
    onChange({
      displayName: s.display_name,
      lat: s.lat,
      lon: s.lon,
      scope: s.scope,
    })
    setQuery(s.display_name)
    setSuggestions([])
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          selectSuggestion(suggestions[activeIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
      if (!value) {
        setQuery('')
      } else {
        setQuery(value.displayName)
      }
    }, 200)
  }

  return (
    <div className="relative">
      <label
        htmlFor="location-input"
        className="mb-1 block text-sm font-medium text-greenly-dark"
      >
        Location
      </label>
      <input
        ref={inputRef}
        id="location-input"
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="location-listbox"
        aria-activedescendant={activeIndex >= 0 ? `location-option-${activeIndex}` : undefined}
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && setIsOpen(suggestions.length > 0)}
        onBlur={handleBlur}
        placeholder="Type a city, region or country..."
        className={cn(
          'min-h-[48px] w-full rounded-md border bg-white px-3 py-2 text-sm text-greenly-dark',
          'focus:border-greenly-primary focus:outline-none focus:ring-2 focus:ring-greenly-primary/30',
          error ? 'border-greenly-danger' : 'border-gray-300'
        )}
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          id="location-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.display_name}-${i}`}
              id={`location-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm',
                i === activeIndex
                  ? 'bg-greenly-primary/10 text-greenly-dark'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
              onMouseDown={() => selectSuggestion(s)}
            >
              <span className="font-medium">{s.display_name}</span>
              <span className="ml-2 text-xs capitalize text-gray-400">{s.scope}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-greenly-danger">{error}</p>}
    </div>
  )
}
