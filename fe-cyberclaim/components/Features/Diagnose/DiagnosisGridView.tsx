// components/diagnosis/DiagnosisGridView.tsx
'use client';

import { Diagnosis } from '@/types/diagnosis';
import { DataGrid } from '@/components/common/DataGrid';
import DiagnosisCard from './DiagnosisCard';
import DiagnosisEmptyState from './DiagnosisEmptyState';

interface DiagnosisGridViewProps {
  diagnosis: Diagnosis[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function DiagnosisGridView({ 
  diagnosis, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  loading = false 
}: DiagnosisGridViewProps) {
  return (
    <DataGrid
      data={diagnosis}
      renderItem={(diagnosis) => (
        <DiagnosisCard
          diagnosis={diagnosis}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLoading={deleteLoading}
          viewType="grid"
        />
      )}
      emptyState={
        <DiagnosisEmptyState 
          onAddDiagnosis={() => window.location.href = '/diagnose/create'}
        />
      }
      loading={loading}
      columns={3}
      gap="md"
    />
  );
}