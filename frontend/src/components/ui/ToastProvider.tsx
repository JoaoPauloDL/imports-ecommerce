'use client'

import { useEffect, useState } from 'react'
import Toast, { ToastType } from './Toast'

export default function ToastProvider() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  useEffect(() => {
    const handleShowToast = (event: CustomEvent) => {
      const { message, type } = event.detail
      setToast({ message, type })
    }

    window.addEventListener('show-toast' as any, handleShowToast)

    return () => {
      window.removeEventListener('show-toast' as any, handleShowToast)
    }
  }, [])

  if (!toast) return null

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  )
}
