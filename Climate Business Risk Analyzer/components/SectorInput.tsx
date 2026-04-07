'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import naceData from '@/data/nace-taxonomy.json'

interface NaceEntry {
  code: string
  label: string
  section: string
  section_label: string
}

export interface SectorValue {
  code: string
  label: string
}

interface SectorInputProps {
  value: SectorValue | null
  onChange: (sector: SectorValue) => void
  error?: string
}

const taxonomy = naceData as NaceEntry[]

export default function SectorInput({ value, onChange, error }: SectorInputProps) {
  const [query, setQuery] = useState(value ? `${value.label} (${value.code})` : '')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = useMemo(() => {
    if (query.length < 1) return []
    const q = query.toLowerCase()
    return taxonomy
      .filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [query])

  const grouped = useMemo(() => {
    const groups: Record<string, NaceEntry[]> = {}
    for (const entry of filtered) {
      const key = entry.section_label
      if (!groups[key]) groups[key] = []
      groups[key].push(entry)
    }
    return groups
  }, [filtered])

  const flatList = useMemo(() => filtered, [filtered])

  const selectEntry = useCallback(
    (entry: NaceEntry) => {
      onChange({ code: entry.code, label: entry.label })
      setQuery(`${entry.label} (${entry.code})`)
      setIsOpen(false)
      setActiveIndex(-1)
    },
    [onChange]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || flatList.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, flatList.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < flatList.length) {
          selectEntry(flatList[activeIndex])
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
        setQuery(`${value.label} (${value.code})`)
      }
    }, 200)
  }

  return (
    <div className="relative">
      <label
        htmlFor="sector-input"
        className="mb-1 block text-sm font-medium text-greenly-dark"
      >
        Sector (NACE)
      </label>
      <input
        ref={inputRef}
        id="sector-input"
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="sector-listbox"
        aria-activedescendant={activeIndex >= 0 ? `sector-option-${activeIndex}` : undefined}
        autoComplete="off"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 1 && setIsOpen(true)}
        onBlur={handleBlur}
        placeholder="Type to search sectors..."
        className={cn(
          'min-h-[48px] w-full rounded-md border bg-white px-3 py-2 text-sm text-greenly-dark',
          'focus:border-greenly-primary focus:outline-none focus:ring-2 focus:ring-greenly-primary/30',
          error ? 'border-greenly-danger' : 'border-gray-300'
        )}
      />

      {isOpen && flatList.length > 0 && (
        <ul
          ref={listRef}
          id="sector-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          {Object.entries(grouped).map(([sectionLabel, entries]) => (
            <li key={sectionLabel} role="presentation">
              <div className="sticky top-0 bg-greenly-light px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {sectionLabel}
              </div>
              <ul role="group" aria-label={sectionLabel}>
                {entries.map((entry) => {
                  const idx = flatList.indexOf(entry)
                  return (
                    <li
                      key={entry.code}
                      id={`sector-option-${idx}`}
                      role="option"
                      aria-selected={idx === activeIndex}
                      className={cn(
                        'cursor-pointer px-3 py-2 text-sm',
                        idx === activeIndex
                          ? 'bg-greenly-primary/10 text-greenly-dark'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                      onMouseDown={() => selectEntry(entry)}
                    >
                      <span className="font-medium">{entry.label}</span>
                      <span className="ml-2 text-xs text-gray-400">{entry.code}</span>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-greenly-danger">{error}</p>}
    </div>
  )
}
