'use client'

import { useState, useCallback } from 'react'
import Toast, { ToastType } from '@/components/ui/Toast'

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const ToastContainer = useCallback(() => {
    if (!toast) return null
    
    return (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    )
  }, [toast, hideToast])

  return {
    showToast,
    hideToast,
    ToastContainer
  }
}
