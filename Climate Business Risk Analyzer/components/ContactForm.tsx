'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { contactFormSchema, type ContactFormData, type EmployeeRange } from '@/lib/schemas'
import { EMPLOYEE_OPTIONS } from './EmployeeSelect'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormProps {
  prefill?: Partial<Pick<ContactFormData, 'company' | 'sectorCode' | 'employeeRange'>>
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm({ prefill }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      company: prefill?.company ?? '',
      sectorCode: prefill?.sectorCode ?? '',
      employeeRange: prefill?.employeeRange,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID
    const formGuid = process.env.NEXT_PUBLIC_HUBSPOT_FORM_GUID

    if (!portalId || !formGuid) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: data.firstName },
              { name: 'lastname', value: data.lastName },
              { name: 'email', value: data.email },
              { name: 'phone', value: data.phone ?? '' },
              { name: 'company', value: data.company },
              { name: 'jobtitle', value: data.jobTitle },
              { name: 'sector_code', value: data.sectorCode },
              { name: 'numemployees', value: data.employeeRange },
            ],
            context: {
              pageUri: typeof window !== 'undefined' ? window.location.href : '',
              pageName: 'Climate Business Risk Analyzer - Results',
            },
            legalConsentOptions: {
              consent: {
                consentToProcess: true,
                text: 'I agree to be contacted by Greenly about their climate solutions.',
              },
            },
          }),
        }
      )

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-greenly-success-bg p-8 text-center">
        <CheckCircle className="h-10 w-10 text-greenly-primary" />
        <h3 className="text-lg font-bold text-greenly-dark">Thank you!</h3>
        <p className="text-sm text-gray-600">
          A Greenly expert will be in touch shortly to discuss your climate strategy.
        </p>
      </div>
    )
  }

  const inputClass = (fieldError?: { message?: string }) =>
    cn(
      'min-h-[48px] w-full rounded-md border bg-white px-3 py-2 text-sm text-greenly-dark',
      'focus:border-greenly-primary focus:outline-none focus:ring-2 focus:ring-greenly-primary/30',
      fieldError ? 'border-greenly-danger' : 'border-gray-300'
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-firstname" className="mb-1 block text-sm font-medium text-greenly-dark">
            First name *
          </label>
          <input
            id="cf-firstname"
            type="text"
            {...register('firstName')}
            className={inputClass(errors.firstName)}
          />
          {errors.firstName && <p className="mt-1 text-sm text-greenly-danger">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="cf-lastname" className="mb-1 block text-sm font-medium text-greenly-dark">
            Last name *
          </label>
          <input
            id="cf-lastname"
            type="text"
            {...register('lastName')}
            className={inputClass(errors.lastName)}
          />
          {errors.lastName && <p className="mt-1 text-sm text-greenly-danger">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="cf-email" className="mb-1 block text-sm font-medium text-greenly-dark">
          Work email *
        </label>
        <input
          id="cf-email"
          type="email"
          {...register('email')}
          className={inputClass(errors.email)}
        />
        {errors.email && <p className="mt-1 text-sm text-greenly-danger">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="cf-phone" className="mb-1 block text-sm font-medium text-greenly-dark">
          Phone (optional)
        </label>
        <input
          id="cf-phone"
          type="tel"
          {...register('phone')}
          className={inputClass()}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-company" className="mb-1 block text-sm font-medium text-greenly-dark">
            Company *
          </label>
          <input
            id="cf-company"
            type="text"
            {...register('company')}
            className={inputClass(errors.company)}
          />
          {errors.company && <p className="mt-1 text-sm text-greenly-danger">{errors.company.message}</p>}
        </div>
        <div>
          <label htmlFor="cf-jobtitle" className="mb-1 block text-sm font-medium text-greenly-dark">
            Job title *
          </label>
          <input
            id="cf-jobtitle"
            type="text"
            {...register('jobTitle')}
            className={inputClass(errors.jobTitle)}
          />
          {errors.jobTitle && <p className="mt-1 text-sm text-greenly-danger">{errors.jobTitle.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="cf-employees" className="mb-1 block text-sm font-medium text-greenly-dark">
          Number of employees *
        </label>
        <select
          id="cf-employees"
          {...register('employeeRange')}
          className={inputClass(errors.employeeRange)}
        >
          <option value="" disabled>Select...</option>
          {EMPLOYEE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.employeeRange && <p className="mt-1 text-sm text-greenly-danger">{errors.employeeRange.message}</p>}
      </div>

      <input type="hidden" {...register('sectorCode')} />

      <div className="flex items-start gap-2">
        <input
          id="cf-gdpr"
          type="checkbox"
          {...register('gdprConsent')}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-greenly-primary focus:ring-greenly-primary/30"
        />
        <label htmlFor="cf-gdpr" className="text-sm text-gray-600">
          I agree to be contacted by Greenly about their carbon management solutions. *
        </label>
      </div>
      {errors.gdprConsent && <p className="text-sm text-greenly-danger">{errors.gdprConsent.message}</p>}

      {status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn(
          'min-h-[48px] w-full rounded-md bg-greenly-primary px-6 py-3 text-sm font-semibold text-white',
          'hover:bg-greenly-primary/90 focus:outline-none focus:ring-2 focus:ring-greenly-primary/30 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
      >
        {status === 'submitting' ? 'Sending...' : 'Get a free consultation with Greenly'}
      </button>
    </form>
  )
}
