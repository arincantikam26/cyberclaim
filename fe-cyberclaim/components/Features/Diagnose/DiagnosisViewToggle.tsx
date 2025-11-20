// components/diagnosis/ViewToggle.tsx
'use client';

import { ViewToggle as BaseViewToggle, ViewType } from '@/components/common/ViewToggle';

interface DiagnosisViewToggleProps {
  viewType: ViewType;
  onViewChange: (viewType: ViewType) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export default function DiagnosisViewToggle({ 
  viewType, 
  onViewChange, 
  size = 'md',
  className = '' 
}: DiagnosisViewToggleProps) {
  return (
    <BaseViewToggle
      viewType={viewType}
      onViewChange={onViewChange}
      size={size}
      className={className}
    />
  );
}