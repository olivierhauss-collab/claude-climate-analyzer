'use client'

interface ShareBarProps {
  companyName: string
  appUrl: string
}

// TODO: Render horizontal bar with three share buttons
// TODO: LinkedIn: https://www.linkedin.com/sharing/share-offsite/?url={encodedAppUrl}
// TODO: X (Twitter): https://twitter.com/intent/tweet?url={encodedAppUrl}&text={encodedText}
// TODO: Email: mailto:?subject={encodedSubject}&body={encodedBody}
// TODO: Pre-filled share text: "I just analyzed [companyName]'s climate risk exposure with Greenly's free tool. Check it out →"
// TODO: Shared URL points to the tool's landing page (not dynamic results)
// TODO: Icon buttons: LinkedIn=blue · X=black · email=gray
export default function ShareBar(_props: ShareBarProps) {
  return <div />
}
