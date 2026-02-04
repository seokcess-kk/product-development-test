'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      children,
      footer,
      className,
      closeOnOverlayClick = true,
      showCloseButton = true,
    },
    ref
  ) => {
    const overlayRef = React.useRef<HTMLDivElement>(null)
    const modalRef = React.useRef<HTMLDivElement>(null)

    // Handle escape key
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, onClose])

    // Lock body scroll when modal is open
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }

      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    // Focus trap
    React.useEffect(() => {
      if (open && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstFocusable = focusableElements[0] as HTMLElement
        const lastFocusable = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement

        const handleTabKeyPress = (event: KeyboardEvent) => {
          if (event.key !== 'Tab') return

          if (event.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable?.focus()
              event.preventDefault()
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable?.focus()
              event.preventDefault()
            }
          }
        }

        document.addEventListener('keydown', handleTabKeyPress)
        firstFocusable?.focus()

        return () => document.removeEventListener('keydown', handleTabKeyPress)
      }
    }, [open])

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === overlayRef.current) {
        onClose()
      }
    }

    if (!open) return null

    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div
          ref={(node) => {
            (modalRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
            }
          }}
          className={cn(
            'relative w-full max-w-md rounded-xl bg-white shadow-xl',
            className
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
              <div>
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="mt-1 text-sm text-gray-500"
                  >
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-4 h-8 w-8 p-0"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Modal.displayName = 'Modal'

export { Modal }
