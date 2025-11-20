// components/common/ViewToggle.tsx
'use client';

import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

export const VIEW_TYPES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

export type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

interface ViewToggleProps {
  viewType: ViewType;
  onViewChange: (viewType: ViewType) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function ViewToggle({ 
  viewType, 
  onViewChange, 
  size = 'md',
  className = '' 
}: ViewToggleProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange(VIEW_TYPES.GRID)}
        className={`${padding} rounded-md transition-colors ${
          viewType === VIEW_TYPES.GRID
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Tampilan Grid"
      >
        <Squares2X2Icon className={iconSize} />
      </button>
      <button
        onClick={() => onViewChange(VIEW_TYPES.LIST)}
        className={`${padding} rounded-md transition-colors ${
          viewType === VIEW_TYPES.LIST
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Tampilan List"
      >
        <ListBulletIcon className={iconSize} />
      </button>
    </div>
  );
}