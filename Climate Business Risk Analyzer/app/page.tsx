'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import CompanyInput from '@/components/CompanyInput'
import SectorInput, { type SectorValue } from '@/components/SectorInput'
import LocationInput, { type LocationValue } from '@/components/LocationInput'
import EmployeeSelect, { type EmployeeRange } from '@/components/EmployeeSelect'
import LoadingScreen from '@/components/LoadingScreen'
import { employeeRangeSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import { AlertCircle, Shield, BookOpen, Zap } from 'lucide-react'

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  sector: z.object(
    {
      code: z.string().min(1),
      label: z.string().min(1),
    },
    { required_error: 'Please select a sector from the list' }
  ),
  location: z.object(
    {
      displayName: z.string().min(1),
      lat: z.number(),
      lon: z.number(),
      scope: z.enum(['city', 'region', 'country', 'global']),
    },
    { required_error: 'Please select a location' }
  ),
  employeeRange: employeeRangeSchema,
})

type FormValues = z.infer<typeof formSchema>

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      employeeRange: undefined,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setApiError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: data.companyName,
          sectorCode: data.sector.code,
          sectorLabel: data.sector.label,
          employeeRange: data.employeeRange,
          location: {
            displayName: data.location.displayName,
            lat: data.location.lat,
            lon: data.location.lon,
            scope: data.location.scope,
          },
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        if (res.status === 429) {
          setApiError('Rate limit reached. Please try again later.')
        } else {
          setApiError(
            body?.error ?? "We couldn't generate an analysis. Please try with different details."
          )
        }
        return
      }

      const result = await res.json()
      sessionStorage.setItem('climate-analysis', JSON.stringify(result))
      sessionStorage.setItem(
        'climate-analysis-input',
        JSON.stringify({
          companyName: data.companyName,
          sectorCode: data.sector.code,
          employeeRange: data.employeeRange,
        })
      )
      router.push('/results')
    } catch {
      setApiError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <LoadingScreen isVisible={isLoading} />

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-greenly-dark sm:text-4xl">
            Understand your company&apos;s climate risk exposure
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Get a free, AI-powered analysis under +2&deg;C and +3&deg;C warming scenarios,
            grounded in IPCC science.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          noValidate
        >
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <CompanyInput
                value={field.value}
                onChange={field.onChange}
                error={errors.companyName?.message}
              />
            )}
          />

          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <SectorInput
                value={field.value ?? null}
                onChange={(sector: SectorValue) => field.onChange(sector)}
                error={errors.sector?.message}
              />
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <LocationInput
                value={field.value ?? null}
                onChange={(location: LocationValue) => field.onChange(location)}
                error={errors.location?.message}
              />
            )}
          />

          <Controller
            name="employeeRange"
            control={control}
            render={({ field }) => (
              <EmployeeSelect
                value={(field.value as EmployeeRange) ?? ''}
                onChange={(val: EmployeeRange) => field.onChange(val)}
                error={errors.employeeRange?.message}
              />
            )}
          />

          {apiError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'min-h-[48px] w-full rounded-md bg-greenly-primary px-6 py-3 text-base font-semibold text-white',
              'hover:bg-greenly-primary/90 focus:outline-none focus:ring-2 focus:ring-greenly-primary/30 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-60'
            )}
          >
            Analyze climate risks
          </button>
        </form>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg p-3">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-greenly-primary" />
            <div>
              <p className="text-sm font-medium text-greenly-dark">IPCC-based science</p>
              <p className="text-xs text-gray-500">
                Analysis grounded in AR6, NGFS, and IEA data
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-greenly-primary" />
            <div>
              <p className="text-sm font-medium text-greenly-dark">Privacy-first</p>
              <p className="text-xs text-gray-500">
                No data stored. Analysis generated in real-time.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-greenly-primary" />
            <div>
              <p className="text-sm font-medium text-greenly-dark">Two scenarios</p>
              <p className="text-xs text-gray-500">
                Compare +2&deg;C (Paris-aligned) vs +3&deg;C (current trajectory)
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
