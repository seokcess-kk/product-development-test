'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const selectVariants = cva(
  'flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 pr-10 text-sm text-gray-900 transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        error:
          'border-danger-500 focus:ring-2 focus:ring-danger-500 focus:border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string
  placeholder?: string
  options: SelectOption[]
  error?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, variant, label, placeholder, options, error, id, ...props },
    ref
  ) => {
    const selectId = id || React.useId()
    const errorId = `${selectId}-error`

    const selectVariant = error ? 'error' : variant

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(selectVariants({ variant: selectVariant, className }))}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={errorId} className="text-xs text-danger-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select, selectVariants }
