// components/diagnosis/DiagnosisGridView.tsx
'use client';

import { Tindakan } from '@/types/tindakan';
import { DataGrid } from '@/components/common/DataGrid';
import TindakanCard from './TindakanCard';
import TindakanEmptyState from './TindakanEmptyState';

interface DiagnosisGridViewProps {
  tindakan: Tindakan[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function DiagnosisGridView({ 
  tindakan, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  loading = false 
}: DiagnosisGridViewProps) {
  return (
    <DataGrid
      data={tindakan}
      renderItem={(tindakan) => (
        <TindakanCard
            tindakan={tindakan}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLoading={deleteLoading}
          viewType="grid"
        />
      )}
      emptyState={
        <TindakanEmptyState 
          onAddTindakan={() => window.location.href = '/tindakan/create'}
        />
      }
      loading={loading}
      columns={3}
      gap="md"
    />
  );
}