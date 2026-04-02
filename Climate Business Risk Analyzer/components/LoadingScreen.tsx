'use client'

interface LoadingScreenProps {
  isVisible: boolean
}

// TODO: framer-motion animated progress indicator (spinner or progress bar)
// TODO: Rotating IPCC AR6 micro-facts displayed every ~3s
//   Example: "Did you know? A +2°C world means 2.7 billion more people exposed to extreme heat."
// TODO: Skeleton layout overlay of results page to reduce perceived wait time
// TODO: Hide/unmount when isVisible=false
export default function LoadingScreen(_props: LoadingScreenProps) {
  return <div />
}
