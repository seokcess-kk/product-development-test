'use client'

import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * 전역 에러 경계 컴포넌트
 *
 * 자식 컴포넌트에서 발생하는 JavaScript 에러를 캐치하고
 * 사용자 친화적인 폴백 UI를 표시합니다.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: 에러 로깅 서비스에 전송 (예: Sentry)
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-100">
              <AlertTriangle className="h-8 w-8 text-danger-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                문제가 발생했습니다
              </h2>
              <p className="max-w-md text-sm text-gray-600">
                페이지를 불러오는 중 오류가 발생했습니다.
                새로고침을 시도해 주세요.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 max-w-md rounded-lg bg-gray-100 p-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  에러 상세 정보
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-600">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <Button
              variant="primary"
              onClick={this.handleRetry}
              leftIcon={<RefreshCw className="h-4 w-4" />}
              className="mt-4"
            >
              새로고침
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
