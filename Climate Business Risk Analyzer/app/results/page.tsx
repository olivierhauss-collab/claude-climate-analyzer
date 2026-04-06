'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { AnalysisResponse, EmployeeRange } from '@/lib/schemas'
import AnalysisCard from '@/components/AnalysisCard'
import ContactForm from '@/components/ContactForm'
import ShareBar from '@/components/ShareBar'
import { MapPin, Building2, Users, Calendar } from 'lucide-react'

export default function ResultsPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [prefill, setPrefill] = useState<{
    company?: string
    sectorCode?: string
    employeeRange?: string
  }>({})
  const [activeTab, setActiveTab] = useState<'2C' | '3C'>('2C')

  useEffect(() => {
    const stored = sessionStorage.getItem('climate-analysis')
    const inputStored = sessionStorage.getItem('climate-analysis-input')

    if (!stored) {
      router.replace('/')
      return
    }

    try {
      setAnalysis(JSON.parse(stored) as AnalysisResponse)
      if (inputStored) setPrefill(JSON.parse(inputStored))
    } catch {
      router.replace('/')
    }
  }, [router])

  if (!analysis) return null

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-greenly-dark sm:text-3xl">
          Climate Risk Analysis: {analysis.company_name}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {analysis.sector_label} ({analysis.sector_code})
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {analysis.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" />
            {analysis.employee_range} employees
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(analysis.generated_at), 'MMM d, yyyy')}
          </span>
        </div>
      </section>

      {/* Mobile tab switcher */}
      <div className="mb-6 flex gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('2C')}
          className={cn(
            'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === '2C'
              ? 'bg-greenly-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          +2&deg;C Scenario
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('3C')}
          className={cn(
            'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
            activeTab === '3C'
              ? 'bg-greenly-danger text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          +3&deg;C Scenario
        </button>
      </div>

      {/* Desktop: two columns. Mobile: active tab only. */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className={cn('md:block', activeTab === '2C' ? 'block' : 'hidden')}>
          <AnalysisCard scenario={analysis.scenarios['2C']} scenarioLabel="2C" />
        </div>
        <div className={cn('md:block', activeTab === '3C' ? 'block' : 'hidden')}>
          <AnalysisCard scenario={analysis.scenarios['3C']} scenarioLabel="3C" />
        </div>
      </section>

      {/* CTA Banner + Contact Form */}
      <section className="mt-10 rounded-xl bg-greenly-success-bg p-6 sm:p-8">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-2 text-center text-xl font-bold text-greenly-dark">
            Turn insights into action
          </h2>
          <p className="mb-6 text-center text-sm text-gray-600">
            Greenly helps companies measure, reduce, and report their carbon emissions.
            Get a free consultation with our climate experts.
          </p>
          <ContactForm
            prefill={{
              company: prefill.company,
              sectorCode: prefill.sectorCode,
              employeeRange: prefill.employeeRange as EmployeeRange | undefined,
            }}
          />
        </div>
      </section>

      {/* Share */}
      <section className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-gray-500">Share this analysis</h3>
        <ShareBar companyName={analysis.company_name} appUrl={appUrl} />
      </section>

      {/* Footer: methodology + sources */}
      <footer className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-500">
        <p className="mb-3">{analysis.methodology_note}</p>
        {analysis.sources_referenced.length > 0 && (
          <div>
            <p className="mb-1 font-medium">Sources referenced:</p>
            <ul className="list-inside list-disc space-y-0.5">
              {analysis.sources_referenced.map((source, i) => (
                <li key={i}>{source}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-4 text-xs text-gray-400">
          Location data powered by Photon (Komoot) &mdash; &copy; OpenStreetMap contributors.
          Climate data from IPCC AR6, NGFS, IEA, and peer-reviewed sources.
        </p>
      </footer>
    </main>
  )
}
