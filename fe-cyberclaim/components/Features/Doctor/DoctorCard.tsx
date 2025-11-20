// components/doctors/DoctorCard.tsx
'use client';

import { Doctor } from '@/types/doctor';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { DataCard } from '@/components/common/DataCard';
import { ActionButtons } from '@/components/common/ActionButtons';

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  viewType: 'grid' | 'list';
}

export default function DoctorCard({ doctor, onEdit, onDelete, deleteLoading, viewType }: DoctorCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  // Grid View menggunakan DataCard reusable
  if (viewType === 'grid') {
    return (
      <DataCard
        data={doctor}
        title={doctor.name}
        subtitle={`ID BPJS: ${doctor.bpjs_id}`}
        badge={{
          text: doctor.specialization,
          color: 'gray'
        }}
        status={{
          isActive: doctor.is_active,
          activeText: 'Aktif',
          inactiveText: 'Tidak Aktif'
        }}
        fields={[
          {
            icon: <UserIcon />,
            label: 'Gender',
            value: `${getGenderLabel(doctor.gender)} • ${calculateAge(doctor.birth_date)} tahun`
          },
          {
            icon: <CalendarIcon />,
            label: 'Lahir',
            value: `Lahir: ${formatDate(doctor.birth_date)}`
          },
          {
            icon: <PhoneIcon />,
            label: 'Telepon',
            value: doctor.telp
          },
          ...(doctor.facility_name ? [{
            icon: <BuildingOfficeIcon />,
            label: 'Faskes',
            value: doctor.facility_name,
            truncate: true
          }] : []),
          {
            icon: <MapPinIcon />,
            label: 'Alamat',
            value: doctor.address,
            truncate: true
          }
        ]}
        actions={
          <ActionButtons
            onEdit={() => doctor.id && onEdit(`/dashboard/doctors/${doctor.id}/edit`)}
            onDelete={() => doctor.id && onDelete(doctor.id)}
            deleteLoading={deleteLoading === doctor.id}
          />
        }
      />
    );
  }

  // List View (tetap menggunakan custom implementation untuk fleksibilitas)
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-3 ${doctor.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
            <div className="text-sm text-gray-500">ID BPJS: {doctor.bpjs_id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <div className="flex items-center space-x-1">
            <UserIcon className="w-4 h-4" />
            <span>{getGenderLabel(doctor.gender)}, {calculateAge(doctor.birth_date)} tahun</span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <PhoneIcon className="w-4 h-4" />
            <span>{doctor.telp}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{doctor.specialization}</span>
        {doctor.facility_name && (
          <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
            <BuildingOfficeIcon className="w-4 h-4" />
            <span className="truncate max-w-xs">{doctor.facility_name}</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          doctor.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {doctor.is_active ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ActionButtons
          onEdit={() => doctor.id && onEdit(`/dashboard/doctors/${doctor.id}/edit`)}
          onDelete={() => doctor.id && onDelete(doctor.id)}
          deleteLoading={deleteLoading === doctor.id}
        />
      </td>
    </tr>
  );
}