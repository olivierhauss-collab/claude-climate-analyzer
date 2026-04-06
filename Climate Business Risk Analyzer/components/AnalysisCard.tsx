import { cn } from '@/lib/utils'
import type { Scenario } from '@/lib/schemas'
import ImpactScore from './ImpactScore'
import RiskList from './RiskList'
import {
  Thermometer,
  Zap,
  Link2,
  Settings,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'

interface AnalysisCardProps {
  scenario: Scenario
  scenarioLabel: '2C' | '3C'
}

const TREND_CONFIG: Record<string, { icon: typeof TrendingUp; label: string; color: string }> = {
  strong_growth: { icon: TrendingUp, label: 'Strong Growth', color: 'text-emerald-600' },
  growth: { icon: TrendingUp, label: 'Growth', color: 'text-emerald-500' },
  stable: { icon: Minus, label: 'Stable', color: 'text-gray-500' },
  contraction: { icon: TrendingDown, label: 'Contraction', color: 'text-orange-500' },
  severe_contraction: { icon: TrendingDown, label: 'Severe Contraction', color: 'text-red-600' },
}

export default function AnalysisCard({ scenario, scenarioLabel }: AnalysisCardProps) {
  const is2C = scenarioLabel === '2C'
  const trend = TREND_CONFIG[scenario.sector_outlook.trend]
  const TrendIcon = trend?.icon ?? Minus

  return (
    <article
      className={cn(
        'flex flex-col gap-6 rounded-xl border-t-4 bg-white p-6 shadow-sm',
        is2C ? 'border-t-greenly-primary' : 'border-t-greenly-danger'
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'inline-flex rounded-full px-3 py-1 text-sm font-bold text-white',
            is2C ? 'bg-greenly-primary' : 'bg-greenly-danger'
          )}
        >
          +{scenarioLabel.replace('C', '')}&deg;C
        </span>
        <h2 className="text-xl font-bold text-greenly-dark">
          {is2C ? 'Paris-Aligned Scenario' : 'Current Trajectory'}
        </h2>
      </div>

      <ImpactScore verdict={scenario.verdict} />

      <div className="rounded-lg bg-greenly-light p-4">
        <div className="mb-1 flex items-center gap-2">
          <TrendIcon className={cn('h-5 w-5', trend?.color ?? 'text-gray-500')} />
          <span className={cn('text-sm font-semibold', trend?.color ?? 'text-gray-500')}>
            Sector Outlook: {trend?.label ?? scenario.sector_outlook.trend}
          </span>
          <span className="text-xs text-gray-400">
            Horizon: {scenario.sector_outlook.horizon}
          </span>
        </div>
        <p className="text-sm text-gray-600">{scenario.sector_outlook.description}</p>
      </div>

      <RiskList
        title="Physical Risks"
        icon={<Thermometer className="h-4 w-4 text-orange-500" />}
        items={scenario.physical_risks.map((r) => ({
          name: r.risk,
          severity: r.severity,
          description: r.description,
          metadata: {
            geographic_relevance: r.geographic_relevance,
            data_point: r.data_point,
          },
        }))}
      />

      <RiskList
        title="Transition Risks"
        icon={<Zap className="h-4 w-4 text-amber-500" />}
        items={scenario.transition_risks.map((r) => ({
          name: r.risk,
          severity: r.severity,
          description: r.description,
          metadata: {
            category: r.category,
            timeline: r.timeline,
          },
        }))}
      />

      <RiskList
        title="Supply Chain Risks"
        icon={<Link2 className="h-4 w-4 text-blue-500" />}
        items={scenario.supply_chain_risks.map((r) => ({
          name: r.risk,
          severity: r.severity,
          description: r.description,
          metadata: {
            affected_inputs: r.affected_inputs,
          },
        }))}
      />

      <RiskList
        title="Operational Impacts"
        icon={<Settings className="h-4 w-4 text-gray-500" />}
        items={scenario.operational_impacts.map((r) => ({
          name: r.impact,
          severity: r.severity,
          description: r.description,
          metadata: {
            cost_indicator: r.cost_indicator,
          },
        }))}
      />

      {scenario.opportunities.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-emerald-500" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Opportunities
            </h4>
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-50 px-1.5 text-xs font-medium text-emerald-600">
              {scenario.opportunities.length}
            </span>
          </div>
          <ul className="space-y-2">
            {scenario.opportunities.map((opp, i) => (
              <li
                key={i}
                className="rounded-lg border border-emerald-100 bg-greenly-success-bg p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium capitalize text-emerald-700">
                    {opp.potential}
                  </span>
                  <div>
                    <p className="font-medium text-greenly-dark">{opp.opportunity}</p>
                    <p className="mt-1 text-sm text-gray-600">{opp.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="border-t border-gray-100 pt-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-500">Executive Summary</h4>
        <p className="text-sm leading-relaxed text-gray-700">{scenario.executive_summary}</p>
      </div>
    </article>
  )
}
