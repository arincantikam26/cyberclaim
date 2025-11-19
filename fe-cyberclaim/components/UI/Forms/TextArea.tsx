// components/ui/forms/Textarea.tsx
'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={3}
        className={`
          block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          transition-colors
          ${error 
            ? 'border-red-300 text-red-900' 
            : 'border-gray-300 text-gray-900'
          }
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';