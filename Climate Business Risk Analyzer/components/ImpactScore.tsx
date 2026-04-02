interface ImpactScoreProps {
  score: number // 0–5
  direction: 'positive' | 'negative' | 'mixed'
}

// TODO: Render 5-dot gauge or circular indicator with green-to-red gradient fill
// TODO: Color score indicator based on severity:
//   0–1 → green, 2 → yellow-green, 3 → yellow, 4 → orange, 5 → red
// TODO: Accessible label: aria-label="Impact score: {score} out of 5 — {direction}"
// TODO: Pair color with text label so color is not the sole indicator (WCAG)
export default function ImpactScore(_props: ImpactScoreProps) {
  return <div />
}
