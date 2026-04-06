'use client'

import { cn } from '@/lib/utils'

export type EmployeeRange =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5001-10000'
  | '10000+'

export const EMPLOYEE_OPTIONS: EmployeeRange[] = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10000+',
]

const DISPLAY_LABELS: Record<EmployeeRange, string> = {
  '1-10': '1 – 10',
  '11-50': '11 – 50',
  '51-200': '51 – 200',
  '201-500': '201 – 500',
  '501-1000': '501 – 1,000',
  '1001-5000': '1,001 – 5,000',
  '5001-10000': '5,001 – 10,000',
  '10000+': '10,000+',
}

interface EmployeeSelectProps {
  value: EmployeeRange | ''
  onChange: (value: EmployeeRange) => void
  error?: string
}

export default function EmployeeSelect({ value, onChange, error }: EmployeeSelectProps) {
  return (
    <div>
      <label
        htmlFor="employee-select"
        className="mb-1 block text-sm font-medium text-greenly-dark"
      >
        Number of employees
      </label>
      <select
        id="employee-select"
        value={value}
        onChange={(e) => onChange(e.target.value as EmployeeRange)}
        className={cn(
          'min-h-[48px] w-full rounded-md border bg-white px-3 py-2 text-sm text-greenly-dark',
          'focus:border-greenly-primary focus:outline-none focus:ring-2 focus:ring-greenly-primary/30',
          error ? 'border-greenly-danger' : 'border-gray-300'
        )}
      >
        <option value="" disabled>
          Select employee range...
        </option>
        {EMPLOYEE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {DISPLAY_LABELS[opt]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-greenly-danger">{error}</p>}
    </div>
  )
}
