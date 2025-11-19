// components/ui/forms/BaseForm.tsx
'use client';

import { FormEvent, ReactNode } from 'react';

interface BaseFormProps {
  children: ReactNode;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export function BaseForm({
  children,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Simpan',
  cancelLabel = 'Batal',
  className = ''
}: BaseFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit?.(data);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      {children}
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Menyimpan...
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}