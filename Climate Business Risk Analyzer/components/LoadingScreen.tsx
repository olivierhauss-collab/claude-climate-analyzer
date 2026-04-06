'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  isVisible: boolean
}

const CLIMATE_FACTS = [
  'At +2\u00b0C, 2.6 billion people will be exposed to severe heat at least once every 5 years.',
  'Sea levels are rising at 3.7mm per year \u2014 accelerating from 1.3mm/year in the early 20th century.',
  'Global insured losses from natural catastrophes reached $108B in 2023.',
  'Extreme heat events that occurred once per 50 years now occur 13.9 times at +2\u00b0C.',
  'At +3\u00b0C, coral reefs decline by over 99% compared to pre-industrial levels.',
  'The global green technology market is projected to reach $9.5 trillion by 2030.',
  'Current policies put us on track for +2.5\u20132.9\u00b0C warming by 2100.',
]

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % CLIMATE_FACTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-greenly-dark/80 backdrop-blur-sm"
          role="alert"
          aria-live="polite"
          aria-label="Analyzing climate risks"
        >
          <div className="mx-4 max-w-md text-center">
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="h-12 w-12 rounded-full border-4 border-greenly-primary/30 border-t-greenly-primary"
              />
            </div>

            <h2 className="mb-2 text-lg font-semibold text-white">
              Analyzing climate risks...
            </h2>
            <p className="mb-6 text-sm text-gray-300">
              Our AI is assessing physical and transition risks under +2\u00b0C and +3\u00b0C scenarios
            </p>

            <AnimatePresence mode="wait">
              <motion.p
                key={factIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="rounded-lg bg-white/10 px-4 py-3 text-sm italic text-gray-200"
              >
                {CLIMATE_FACTS[factIndex]}
              </motion.p>
            </AnimatePresence>

            <p className="mt-4 text-xs text-gray-400">
              Source: IPCC AR6, Swiss Re, Climate Action Tracker
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
