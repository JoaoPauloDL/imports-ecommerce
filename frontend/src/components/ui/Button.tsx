import React from 'react'

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
type ButtonSize = 'sm' | 'default' | 'lg' | 'xl' | 'icon'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const getButtonClasses = (variant: ButtonVariant, size: ButtonSize, className?: string) => {
  const baseClasses = "inline-flex items-center justify-center font-medium tracking-wide uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
    secondary: "bg-white text-black border-2 border-black hover:bg-black hover:text-white focus:ring-gray-500",
    outline: "bg-transparent text-black border border-black hover:bg-black hover:text-white focus:ring-gray-500",
    ghost: "bg-transparent text-black hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    link: "text-black underline-offset-4 hover:underline focus:ring-gray-500 normal-case",
  }
  
  const sizeClasses = {
    sm: "h-9 px-4 text-xs",
    default: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
    xl: "h-16 px-10 text-lg",
    icon: "h-12 w-12",
  }
  
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={getButtonClasses(variant, size, className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
