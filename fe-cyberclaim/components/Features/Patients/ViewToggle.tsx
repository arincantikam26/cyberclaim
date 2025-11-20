// components/patients/ViewToggle.tsx
'use client';

import { ViewToggle as BaseViewToggle, ViewType } from '@/components/common/ViewToggle';

interface PatientViewToggleProps {
  viewType: ViewType;
  onViewChange: (viewType: ViewType) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export default function PatientViewToggle({ 
  viewType, 
  onViewChange, 
  size = 'md',
  className = '' 
}: PatientViewToggleProps) {
  return (
    <BaseViewToggle
      viewType={viewType}
      onViewChange={onViewChange}
      size={size}
      className={className}
    />
  );
}