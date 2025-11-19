// components/ui/forms/FormField.tsx
'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  name,
  required = false,
  error,
  helpText,
  children,
  className = ''
}: FormFieldProps) {
  return (
    <div className={className}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}