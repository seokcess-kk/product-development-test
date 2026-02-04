/**
 * 인증 커스텀 훅
 *
 * 사용자 인증 상태 관리, 로그인/로그아웃/회원가입 기능 제공
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, AuthError } from '@supabase/supabase-js'
import type { Profile, SchoolType, ProfileInsert, ProfileUpdate } from '@/types/database'

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface SignupParams {
  email: string
  password: string
  name: string
  grade: number
  schoolType: SchoolType
}

interface ProfileUpdateParams {
  name?: string
  grade?: number
  schoolType?: SchoolType
}

interface UseAuthReturn extends AuthState {
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signUp: (params: SignupParams) => Promise<{ error: AuthError | Error | null }>
  signOut: () => Promise<void>
  updateProfile: (
    params: ProfileUpdateParams
  ) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  })

  /**
   * 프로필 조회
   */
  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
        return null
      }

      return data
    },
    [supabase]
  )

  /**
   * 초기 인증 상태 확인 및 구독 설정
   */
  useEffect(() => {
    // 현재 세션 확인
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const profile = await fetchProfile(user.id)
        setState({
          user,
          profile,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    checkSession()

    // 인증 상태 변화 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({
          user: session.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
        })
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        })
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // 토큰 갱신 시 프로필은 유지
        setState((prev) => ({
          ...prev,
          user: session.user,
        }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  /**
   * 이메일/비밀번호 로그인
   */
  const signInWithEmail = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error) {
        router.refresh()
      }

      return { error }
    },
    [supabase, router]
  )

  /**
   * Google 소셜 로그인
   */
  const signInWithGoogle = useCallback(async (): Promise<{
    error: AuthError | null
  }> => {
    const redirectTo = `${window.location.origin}/api/auth/callback`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    return { error }
  }, [supabase])

  /**
   * 이메일/비밀번호 회원가입
   */
  const signUp = useCallback(
    async (
      params: SignupParams
    ): Promise<{ error: AuthError | Error | null }> => {
      const { email, password, name, grade, schoolType } = params

      // 1. Supabase Auth로 회원가입
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            grade,
            school_type: schoolType,
          },
        },
      })

      if (authError) {
        return { error: authError }
      }

      // 2. 프로필 생성
      if (data.user) {
        const profileData: ProfileInsert = {
          id: data.user.id,
          email,
          name,
          grade,
          school_type: schoolType,
        }
        const { error: profileError } = await supabase.from('profiles').insert(profileData as never)

        if (profileError) {
          console.error('Profile creation error:', profileError)
          return { error: new Error('프로필 생성에 실패했습니다.') }
        }
      }

      router.refresh()
      return { error: null }
    },
    [supabase, router]
  )

  /**
   * 로그아웃
   */
  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }, [supabase, router])

  /**
   * 프로필 업데이트
   */
  const updateProfile = useCallback(
    async (params: ProfileUpdateParams): Promise<{ error: Error | null }> => {
      if (!state.user) {
        return { error: new Error('로그인이 필요합니다.') }
      }

      const updateData: ProfileUpdate = {}
      if (params.name !== undefined) updateData.name = params.name
      if (params.grade !== undefined) updateData.grade = params.grade
      if (params.schoolType !== undefined)
        updateData.school_type = params.schoolType

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData as never)
        .eq('id', state.user.id)
        .select()
        .single()

      if (error) {
        console.error('Profile update error:', error)
        return { error: new Error('프로필 업데이트에 실패했습니다.') }
      }

      setState((prev) => ({
        ...prev,
        profile: data,
      }))

      return { error: null }
    },
    [supabase, state.user]
  )

  /**
   * 프로필 새로고침
   */
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!state.user) return

    const profile = await fetchProfile(state.user.id)
    if (profile) {
      setState((prev) => ({
        ...prev,
        profile,
      }))
    }
  }, [state.user, fetchProfile])

  return {
    ...state,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  }
}
