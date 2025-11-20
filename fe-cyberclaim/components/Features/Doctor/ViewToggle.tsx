// components/doctors/ViewToggle.tsx
'use client';

import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

const VIEW_TYPES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

interface ViewToggleProps {
  viewType: ViewType;
  onViewChange: (viewType: ViewType) => void;
}

export default function ViewToggle({ viewType, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange(VIEW_TYPES.GRID)}
        className={`p-2 rounded-md transition-colors ${
          viewType === VIEW_TYPES.GRID
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Tampilan Grid"
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange(VIEW_TYPES.LIST)}
        className={`p-2 rounded-md transition-colors ${
          viewType === VIEW_TYPES.LIST
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Tampilan List"
      >
        <ListBulletIcon className="w-5 h-5" />
      </button>
    </div>
  );
}