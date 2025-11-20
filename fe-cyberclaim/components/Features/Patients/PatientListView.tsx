// components/patients/PatientListView.tsx
'use client';

import { Patient } from '@/types/patient';
import { DataList } from '@/components/common/DataList';
import PatientCard from './PatientCard';
import PatientsEmptyState from './PatientsEmptyState';
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { ActionButtons } from '@/components/common/ActionButtons';

interface PatientListViewProps {
  patients: Patient[];
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  loading?: boolean;
}

export default function PatientListView({ 
  patients, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  loading = false 
}: PatientListViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getGenderLabel = (gender: 'L' | 'P') => {
    return gender === 'L' ? 'Laki-laki' : 'Perempuan';
  };

  const parseMembership = (membershipJson: string | null) => {
    if (!membershipJson) return null;
    try {
      return JSON.parse(membershipJson);
    } catch {
      return null;
    }
  };

  return (
    <DataList
      data={patients}
      columns={[
        {
          key: 'name',
          label: 'Pasien',
          width: 'auto',
          render: (value, patient: Patient) => (
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${patient.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-500">NIK: {patient.nik}</div>
              </div>
            </div>
          )
        },
        {
          key: 'info',
          label: 'Informasi',
          width: 'auto',
          render: (value, patient: Patient) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-center space-x-1">
                <UserIcon className="w-4 h-4" />
                <span>{getGenderLabel(patient.gender)}, {calculateAge(patient.birth_date)} tahun</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(patient.birth_date)}</span>
              </div>
            </div>
          )
        },
        {
          key: 'contact',
          label: 'Kontak',
          width: 'auto',
          render: (value, patient: Patient) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-center space-x-1">
                <PhoneIcon className="w-4 h-4" />
                <span>{patient.telp}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                BPJS: {patient.bpjs_number || '-'}
              </div>
            </div>
          )
        },
        {
          key: 'address',
          label: 'Alamat',
          width: '96',
          render: (value, patient: Patient) => (
            <div className="text-sm text-gray-900">
              <div className="flex items-start space-x-1">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{patient.address}</span>
              </div>
              {patient.membership_json && (
                <div className="text-xs text-blue-600 mt-1">
                  {parseMembership(patient.membership_json)?.type} Member
                </div>
              )}
            </div>
          )
        },
        {
          key: 'status',
          label: 'Status',
          width: '32',
          render: (value, patient: Patient) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              patient.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {patient.is_active ? 'Aktif' : 'Tidak Aktif'}
            </span>
          )
        },
        {
          key: 'actions',
          label: 'Aksi',
          width: '24',
          className: 'text-right',
          render: (value, patient: Patient) => (
            <ActionButtons
              onEdit={() => patient.id && onEdit(`/dashboard/patients/${patient.id}/edit`)}
              onDelete={() => patient.id && onDelete(patient.id)}
              deleteLoading={deleteLoading === patient.id}
              size="sm"
            />
          )
        }
      ]}
      emptyState={
        <PatientsEmptyState 
          onAddPatient={() => window.location.href = '/dashboard/patients/create'}
        />
      }
      loading={loading}
    />
  );
}