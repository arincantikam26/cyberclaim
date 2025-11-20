// components/doctors/DoctorGridView.tsx
'use client';

import { Doctor } from '@/types/doctor';
import DoctorCard from './DoctorCard';

interface DoctorGridViewProps {
  doctors: Doctor[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
}

export default function DoctorGridView({ doctors, onEdit, onDelete, deleteLoading }: DoctorGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard 
          key={doctor.id} 
          doctor={doctor} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          deleteLoading={deleteLoading}
          viewType="grid"
        />
      ))}
    </div>
  );
}