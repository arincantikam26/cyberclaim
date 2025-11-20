// components/common/ActionButtons.tsx
'use client';

import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  deleteLoading?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  onView,
  deleteLoading = false,
  size = 'md',
  className = ''
}: ActionButtonsProps) {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const buttonSize = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {onView && (
        <button
          onClick={onView}
          className={`text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${buttonSize}`}
          title="Lihat"
        >
          <EyeIcon className={iconSize} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className={`text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${buttonSize}`}
          title="Edit"
        >
          <PencilIcon className={iconSize} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={deleteLoading}
          className={`text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 ${buttonSize}`}
          title="Hapus"
        >
          {deleteLoading ? (
            <div className={`border-2 border-red-600 border-t-transparent rounded-full animate-spin ${iconSize}`} />
          ) : (
            <TrashIcon className={iconSize} />
          )}
        </button>
      )}
    </div>
  );
}