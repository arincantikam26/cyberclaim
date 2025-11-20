// components/diagnosis/ViewToggle.tsx
'use client';

import { ViewToggle as BaseViewToggle, ViewType } from '@/components/common/ViewToggle';

interface TindakanViewToggleProps {
  viewType: ViewType;
  onViewChange: (viewType: ViewType) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export default function TindakanViewToggle({ 
  viewType, 
  onViewChange, 
  size = 'md',
  className = '' 
}: TindakanViewToggleProps) {
  return (
    <BaseViewToggle
      viewType={viewType}
      onViewChange={onViewChange}
      size={size}
      className={className}
    />
  );
}