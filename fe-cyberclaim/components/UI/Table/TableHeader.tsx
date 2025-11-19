// components/UI/Table/TableHeader.tsx
'use client';

import { ReactNode } from 'react';

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  width?: string | number;
}

export default function TableHeader({
  children,
  className = '',
  align = 'left',
  sortable = false,
  sortDirection = null,
  onSort,
  width
}: TableHeaderProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th
      className={`
        px-6 py-4 text-xs font-semibold uppercase tracking-wider
        bg-gradient-to-r from-blue-50 to-green-50
        border-b-2 border-blue-200
        text-gray-700
        ${alignmentClasses[align]}
        ${sortable ? 'cursor-pointer hover:bg-blue-100 transition-colors' : ''}
        ${className}
      `}
      style={{ width }}
      onClick={handleClick}
    >
      <div className={`flex items-center ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'} space-x-2`}>
        <span>{children}</span>
        
        {sortable && (
          <div className="flex flex-col space-y-0">
            <svg
              className={`h-3 w-3 ${
                sortDirection === 'asc' 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <svg
              className={`h-3 w-3 ${
                sortDirection === 'desc' 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </th>
  );
}