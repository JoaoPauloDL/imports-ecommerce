'use client'

import { useState, useCallback, useMemo } from 'react'
import Toast, { ToastType } from '@/components/ui/Toast'

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const ToastContainer = useMemo(() => {
    const ToastComponent = () => {
      if (!toast) return null
      
      return (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )
    }
    return ToastComponent
  }, [toast, hideToast])

  return {
    showToast,
    hideToast,
    ToastContainer
  }
}
