'use client'

import type { ContactFormData } from '@/lib/schemas'

interface ContactFormProps {
  prefill?: Partial<Pick<ContactFormData, 'company' | 'sectorCode' | 'employeeRange'>>
}

// TODO: react-hook-form + @hookform/resolvers/zod with contactFormSchema
// TODO: Pre-fill company, sectorCode, employeeRange from prefill prop
// TODO: On submit: POST to HubSpot Forms API
//   POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
//   portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID
//   formGuid  = process.env.NEXT_PUBLIC_HUBSPOT_FORM_GUID
//   Include hutk cookie if HubSpot analytics script is loaded
// TODO: Show inline success message on submit — no page redirect
// TODO: GDPR consent checkbox (required, z.literal(true))
// TODO: Map fields to HubSpot contact properties; tag with "Climate Tool Source"
export default function ContactForm(_props: ContactFormProps) {
  return <form />
}
