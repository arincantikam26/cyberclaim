// components/common/EmptyState.tsx
'use client';

import { ReactNode } from 'react';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  const buttonClass = action?.variant === 'secondary' 
    ? 'bg-gray-600 hover:bg-gray-700'
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-gray-400 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-500 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`mt-4 text-white px-6 py-2.5 rounded-lg transition-colors font-semibold ${buttonClass}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}