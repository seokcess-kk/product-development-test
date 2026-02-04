'use client'

import { Layout, PageContainer } from '@/components/common'
import { AccountSettings, ProfileSettings } from '@/components/features/settings'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { profile, signOut, updateProfile } = useAuth()

  // Handle profile update
  const handleProfileUpdate = async (data: { name: string; grade: number; schoolType: 'middle' | 'high' }) => {
    return await updateProfile({
      name: data.name,
      grade: data.grade,
      schoolType: data.schoolType,
    })
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut()
  }

  // Handle account deletion (placeholder)
  const handleDeleteAccount = async () => {
    // TODO: Implement actual account deletion
    return { error: null }
  }

  return (
    <Layout user={profile ? { name: profile.name, email: profile.email } : undefined} onLogout={handleLogout}>
      <PageContainer
        title="설정"
        description="프로필 및 계정 설정을 관리하세요"
      >
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Profile Settings */}
          <ProfileSettings
            initialData={profile ? {
              name: profile.name,
              grade: profile.grade,
              schoolType: profile.school_type,
            } : undefined}
            onSubmit={handleProfileUpdate}
          />

          {/* Account Settings */}
          <AccountSettings
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </PageContainer>
    </Layout>
  )
}
