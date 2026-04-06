'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Severity } from '@/lib/schemas'
import { ChevronDown } from 'lucide-react'

interface RiskItemData {
  name: string
  severity: Severity
  description: string
  metadata?: Record<string, string | string[] | null | undefined>
}

interface RiskListProps {
  title: string
  items: RiskItemData[]
  icon?: React.ReactNode
}

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string }> = {
  low: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  moderate: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700' },
  critical: { bg: 'bg-red-100', text: 'text-red-700' },
}

const COLLAPSE_THRESHOLD = 3

export default function RiskList({ title, items, icon }: RiskListProps) {
  const [expanded, setExpanded] = useState(false)
  const shouldCollapse = items.length > COLLAPSE_THRESHOLD
  const visibleItems = shouldCollapse && !expanded ? items.slice(0, COLLAPSE_THRESHOLD) : items

  if (items.length === 0) return null

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </h4>
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-medium text-gray-600">
          {items.length}
        </span>
      </div>

      <ul className="space-y-2">
        {visibleItems.map((item, i) => {
          const severity = SEVERITY_STYLES[item.severity]
          return (
            <li key={i} className="rounded-lg border border-gray-100 bg-white p-3">
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    'mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    severity.bg,
                    severity.text
                  )}
                >
                  {item.severity}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-greenly-dark">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  {item.metadata && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(item.metadata).map(([key, val]) => {
                        if (val == null) return null
                        const display = Array.isArray(val) ? val.join(', ') : val
                        if (!display) return null
                        return (
                          <span
                            key={key}
                            className="inline-flex rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-500"
                          >
                            <span className="font-medium">{key.replace(/_/g, ' ')}:</span>{' '}
                            {display}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {shouldCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-sm font-medium text-greenly-primary hover:text-greenly-primary/80"
        >
          {expanded ? 'Show less' : `Show ${items.length - COLLAPSE_THRESHOLD} more`}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
          />
        </button>
      )}
    </section>
  )
}
