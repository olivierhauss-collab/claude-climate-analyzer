'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface CompanySuggestion {
  name: string
  siret?: string
  address?: string
  country?: string
}

interface CompanyInputProps {
  value: string
  onChange: (value: string) => void
  country?: string
  error?: string
}

export default function CompanyInput({ value, onChange, country, error }: CompanyInputProps) {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      try {
        const params = new URLSearchParams({ q: query })
        if (country) params.set('country', country)
        const res = await fetch(`/api/companies?${params}`)
        if (!res.ok) return
        const data = (await res.json()) as CompanySuggestion[]
        setSuggestions(data)
        setIsOpen(data.length > 0)
        setActiveIndex(-1)
      } catch {
        // Graceful degradation — fail silently
        setSuggestions([])
        setIsOpen(false)
      }
    },
    [country]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, fetchSuggestions])

  const selectSuggestion = (suggestion: CompanySuggestion) => {
    onChange(suggestion.name)
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

  return (
    <div className="relative">
      <label
        htmlFor="company-input"
        className="mb-1 block text-sm font-medium text-greenly-dark"
      >
        Company name
      </label>
      <input
        ref={inputRef}
        id="company-input"
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="company-listbox"
        aria-activedescendant={activeIndex >= 0 ? `company-option-${activeIndex}` : undefined}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Type a company name..."
        className={cn(
          'min-h-[48px] w-full rounded-md border bg-white px-3 py-2 text-sm text-greenly-dark',
          'focus:border-greenly-primary focus:outline-none focus:ring-2 focus:ring-greenly-primary/30',
          error ? 'border-greenly-danger' : 'border-gray-300'
        )}
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="company-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.name}-${i}`}
              id={`company-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm',
                i === activeIndex ? 'bg-greenly-primary/10 text-greenly-dark' : 'text-gray-700 hover:bg-gray-50'
              )}
              onMouseDown={() => selectSuggestion(s)}
            >
              <span className="font-medium">{s.name}</span>
              {s.address && (
                <span className="ml-2 text-xs text-gray-400">{s.address}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-greenly-danger">{error}</p>}
    </div>
  )
}
