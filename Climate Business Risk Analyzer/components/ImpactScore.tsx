import { cn } from '@/lib/utils'
import type { Verdict } from '@/lib/schemas'

interface ImpactScoreProps {
  verdict: Verdict
}

const DOT_COLORS = [
  'bg-emerald-400',
  'bg-lime-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-red-500',
]

const DIRECTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  positive: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Positive' },
  negative: { bg: 'bg-red-100', text: 'text-red-700', label: 'Negative' },
  mixed: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Mixed' },
}

function getScoreLabel(score: number): string {
  if (score <= 1) return 'Low impact'
  if (score <= 2) return 'Moderate impact'
  if (score <= 3) return 'Significant impact'
  if (score <= 4) return 'High impact'
  return 'Critical impact'
}

export default function ImpactScore({ verdict }: ImpactScoreProps) {
  const { impact_score, impact_direction, headline, summary } = verdict
  const roundedScore = Math.round(impact_score)
  const direction = DIRECTION_STYLES[impact_direction]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="flex gap-1.5"
          role="img"
          aria-label={`Impact score: ${impact_score} out of 5 \u2014 ${getScoreLabel(roundedScore)}`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-3.5 w-3.5 rounded-full',
                i < roundedScore ? DOT_COLORS[i] : 'bg-gray-200'
              )}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-600">
          {impact_score.toFixed(1)}/5 &mdash; {getScoreLabel(roundedScore)}
        </span>
      </div>

      <div className="flex items-start gap-2">
        <span
          className={cn(
            'mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
            direction.bg,
            direction.text
          )}
        >
          {direction.label}
        </span>
        <h3 className="text-lg font-bold text-greenly-dark">{headline}</h3>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
    </div>
  )
}
