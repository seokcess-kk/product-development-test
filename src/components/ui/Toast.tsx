'use client'

import { cn } from '@/lib/utils'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

// Toast 타입
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

// Toast 아이콘 및 스타일
const toastConfig: Record<ToastType, { icon: typeof CheckCircle; className: string }> = {
  success: {
    icon: CheckCircle,
    className: 'bg-success-50 border-success-200 text-success-800',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-danger-50 border-danger-200 text-danger-800',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-warning-50 border-warning-200 text-warning-800',
  },
  info: {
    icon: Info,
    className: 'bg-primary-50 border-primary-200 text-primary-800',
  },
}

// Toast 아이템 컴포넌트
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const { icon: Icon, className } = toastConfig[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove()
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.duration, onRemove])

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300',
        'animate-in slide-in-from-top-2 fade-in',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="알림 닫기"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

// Toast 컨테이너 컴포넌트
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2"
      aria-label="알림 목록"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  )
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const newToast: Toast = { id, message, type, duration }
    setToasts((prev) => [...prev, newToast])
  }, [])

  const success = useCallback((message: string, duration?: number) => {
    addToast(message, 'success', duration)
  }, [addToast])

  const error = useCallback((message: string, duration?: number) => {
    addToast(message, 'error', duration)
  }, [addToast])

  const warning = useCallback((message: string, duration?: number) => {
    addToast(message, 'warning', duration)
  }, [addToast])

  const info = useCallback((message: string, duration?: number) => {
    addToast(message, 'info', duration)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// useToast 훅
export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
