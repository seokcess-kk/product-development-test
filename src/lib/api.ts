import type { ApiError, ApiResponse } from '@/types'

/**
 * API 클라이언트 기본 설정
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

/**
 * API 에러 클래스
 */
export class ApiClientError extends Error {
  code: string
  status: number
  details?: Record<string, string[]>

  constructor(error: ApiError, status: number) {
    super(error.message)
    this.name = 'ApiClientError'
    this.code = error.code
    this.status = status
    this.details = error.details
  }
}

/**
 * HTTP 요청 옵션 타입
 */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * URL에 쿼리 파라미터 추가
 */
function buildUrl(endpoint: string, params?: RequestOptions['params']): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * 기본 fetch 래퍼
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, params, headers, ...restOptions } = options

  const url = buildUrl(endpoint, params)

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let error: ApiError
    try {
      const errorData = await response.json()
      error = errorData
    } catch {
      error = {
        code: 'UNKNOWN_ERROR',
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      }
    }
    throw new ApiClientError(error, response.status)
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

/**
 * API 클라이언트
 */
export const api = {
  /**
   * GET 요청
   */
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' })
  },

  /**
   * POST 요청
   */
  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body })
  },

  /**
   * PUT 요청
   */
  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body })
  },

  /**
   * PATCH 요청
   */
  patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PATCH', body })
  },

  /**
   * DELETE 요청
   */
  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' })
  },
}

/**
 * API 응답 타입 래퍼
 */
export async function apiRequest<T>(
  requestFn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await requestFn()
    return { data, success: true }
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        data: undefined as T,
        success: false,
        message: error.message,
      }
    }
    return {
      data: undefined as T,
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
    }
  }
}
