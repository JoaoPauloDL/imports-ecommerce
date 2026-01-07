'use client';

import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'minimal' | 'underline';
  onChange?: (value: string) => void;
}

const getInputClasses = (variant: 'default' | 'minimal' | 'underline', error?: string, fullWidth?: boolean, className?: string) => {
  const baseClasses = fullWidth ? 'w-full' : 'w-auto'
  
  const variantClasses = {
    default: `px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200 ${
      error ? 'border-red-500 focus:border-red-500' : ''
    }`,
    minimal: `px-0 py-3 bg-transparent border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200 ${
      error ? 'border-red-500 focus:border-red-500' : ''
    }`,
    underline: `px-0 py-3 bg-transparent border-0 border-b border-black focus:border-b-2 focus:outline-none transition-all duration-200 ${
      error ? 'border-red-500' : ''
    }`
  }
  
  return `${baseClasses} ${variantClasses[variant]} placeholder:text-gray-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed ${className || ''}`
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  variant = 'minimal',
  className,
  onChange,
  ...inputProps
}: InputProps) {
  const inputId = React.useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-black tracking-wide uppercase"
        >
          {label}
          {inputProps.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        className={getInputClasses(variant, error, fullWidth, className)}
        onChange={handleChange}
        {...inputProps}
      />
      
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
}