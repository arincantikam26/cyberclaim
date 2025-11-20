// components/users/ViewToggle.tsx
'use client';

import { ViewToggle as BaseViewToggle, ViewType } from '@/components/common/ViewToggle';

interface UserViewToggleProps {
  viewType: ViewType;
  onViewChange: (viewType: ViewType) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export default function UserViewToggle({ 
  viewType, 
  onViewChange, 
  size = 'md',
  className = '' 
}: UserViewToggleProps) {
  return (
    <BaseViewToggle
      viewType={viewType}
      onViewChange={onViewChange}
      size={size}
      className={className}
    />
  );
}