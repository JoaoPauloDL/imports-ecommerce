'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Erro capturado pelo ErrorBoundary:', error, errorInfo)
    
    // Enviar para Sentry se configurado
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry será inicializado no _app ou layout
      try {
        const Sentry = require('@sentry/nextjs')
        Sentry.captureException(error, {
          extra: {
            componentStack: errorInfo.componentStack
          }
        })
      } catch (e) {
        console.log('Sentry não disponível')
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <svg 
                  className="w-16 h-16 mx-auto text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Ops! Algo deu errado
              </h1>
              
              <p className="text-gray-600 mb-6">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded text-left">
                  <p className="text-sm font-mono text-red-800 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Recarregar Página
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Voltar para Início
                </button>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              Se o problema persistir, entre em contato pelo{' '}
              <a href="/contact" className="text-amber-600 hover:underline">
                formulário de contato
              </a>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
