'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  helperText?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type = 'text', label, helperText, error, id, ...props }, ref) => {
    const inputId = id || React.useId()
    const helperTextId = `${inputId}-helper`
    const errorId = `${inputId}-error`

    const inputVariant = error ? 'error' : variant

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(inputVariants({ variant: inputVariant, className }))}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-danger-500" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperTextId} className="text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
