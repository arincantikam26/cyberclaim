// components/patients/PatientGridView.tsx
'use client';

import { Patient } from '@/types/patient';
import { DataGrid } from '@/components/common/DataGrid';
import PatientCard from './PatientCard';
import PatientsEmptyState from './PatientsEmptyState';

interface PatientGridViewProps {
  patients: Patient[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function PatientGridView({ 
  patients, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  loading = false 
}: PatientGridViewProps) {
  return (
    <DataGrid
      data={patients}
      renderItem={(patient) => (
        <PatientCard
          patient={patient}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLoading={deleteLoading}
          viewType="grid"
        />
      )}
      emptyState={
        <PatientsEmptyState 
          onAddPatient={() => window.location.href = '/dashboard/patients/create'}
        />
      }
      loading={loading}
      columns={3}
      gap="md"
    />
  );
}