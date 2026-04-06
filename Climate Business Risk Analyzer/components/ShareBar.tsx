'use client'

import { useState } from 'react'
import { Linkedin, Twitter, Mail, Link as LinkIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareBarProps {
  companyName: string
  appUrl: string
}

export default function ShareBar({ companyName, appUrl }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `I just analyzed ${companyName}'s climate risk exposure with Greenly's free tool. Check it out!`
  const encodedUrl = encodeURIComponent(appUrl)
  const encodedText = encodeURIComponent(shareText)

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Climate Risk Analysis: ${companyName}`)}&body=${encodedText}%0A%0A${encodedUrl}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  const buttonClass =
    'inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenly-primary/30'

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
        LinkedIn
      </a>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on X"
      >
        <Twitter className="h-4 w-4 text-gray-900" />
        X
      </a>

      <a href={emailUrl} className={buttonClass} aria-label="Share via email">
        <Mail className="h-4 w-4 text-gray-500" />
        Email
      </a>

      <button
        type="button"
        onClick={copyLink}
        className={cn(buttonClass, copied && 'border-greenly-primary text-greenly-primary')}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            Copy link
          </>
        )}
      </button>
    </div>
  )
}
