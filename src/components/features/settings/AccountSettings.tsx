'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { Loader2, LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface AccountSettingsProps {
  onLogout: () => Promise<void>
  onDeleteAccount: () => Promise<{ error: Error | null }>
  className?: string
}

export function AccountSettings({ onLogout, onDeleteAccount, className }: AccountSettingsProps) {
  const toast = useToast()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
      toast.success('로그아웃되었습니다.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const { error } = await onDeleteAccount()
      if (error) {
        toast.error('계정 삭제에 실패했습니다.')
      } else {
        toast.success('계정이 삭제되었습니다.')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>계정 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 로그아웃 */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <h3 className="font-medium text-gray-900">로그아웃</h3>
              <p className="text-sm text-gray-500">현재 기기에서 로그아웃합니다.</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleLogout}
              disabled={isLoggingOut}
              leftIcon={isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            >
              로그아웃
            </Button>
          </div>

          {/* 계정 삭제 */}
          <div className="flex items-center justify-between rounded-lg border border-danger-200 bg-danger-50 p-4">
            <div>
              <h3 className="font-medium text-danger-700">계정 삭제</h3>
              <p className="text-sm text-danger-600">
                모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 계정 삭제 확인 모달 */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="계정 삭제 확인"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            정말로 계정을 삭제하시겠습니까? 모든 학습 기록, 계획, 통계가 영구적으로 삭제됩니다.
            이 작업은 되돌릴 수 없습니다.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              leftIcon={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isDeleting ? '삭제 중...' : '계정 삭제'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
