'use client'

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

interface EmployeeSelectProps {
  value: EmployeeRange | ''
  onChange: (value: EmployeeRange) => void
}

// TODO: Render <select> with EMPLOYEE_OPTIONS
// TODO: Min touch target 48px, accessible <label>
export default function EmployeeSelect(_props: EmployeeSelectProps) {
  return <div />
}
