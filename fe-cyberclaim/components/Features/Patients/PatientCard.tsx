// components/patients/PatientCard.tsx
'use client';

import { Patient } from '@/types/patient';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  IdentificationIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { DataCard } from '@/components/common/DataCard';
import { ActionButtons } from '@/components/common/ActionButtons';

interface PatientCardProps {
  patient: Patient;
  onEdit: (path: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
  viewType: 'grid' | 'list';
}

export default function PatientCard({ patient, onEdit, onDelete, deleteLoading, viewType }: PatientCardProps) {
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

  const parseMembership = (membershipJson: string | null) => {
    if (!membershipJson) return null;
    try {
      return JSON.parse(membershipJson);
    } catch {
      return null;
    }
  };

  const membership = parseMembership(patient.membership_json);

  // Grid View menggunakan DataCard reusable
  if (viewType === 'grid') {
    return (
      <DataCard
        data={patient}
        title={patient.name}
        subtitle={`NIK: ${patient.nik}`}
        badge={membership ? {
          text: membership.type,
          color: getMembershipColor(membership.type)
        } : undefined}
        status={{
          isActive: patient.is_active,
          activeText: 'Aktif',
          inactiveText: 'Tidak Aktif'
        }}
        fields={[
          {
            icon: <UserIcon />,
            label: 'Gender',
            value: `${getGenderLabel(patient.gender)} • ${calculateAge(patient.birth_date)} tahun`
          },
          {
            icon: <CalendarIcon />,
            label: 'Lahir',
            value: `Lahir: ${formatDate(patient.birth_date)}`
          },
          {
            icon: <PhoneIcon />,
            label: 'Telepon',
            value: patient.telp
          },
          {
            icon: <IdentificationIcon />,
            label: 'BPJS',
            value: patient.bpjs_number || '-'
          },
          ...(membership ? [{
            icon: <DocumentTextIcon />,
            label: 'Membership',
            value: `${membership.number} (${membership.tier})`,
            truncate: true
          }] : []),
          {
            icon: <MapPinIcon />,
            label: 'Alamat',
            value: patient.address,
            truncate: true
          }
        ]}
        actions={
          <ActionButtons
            onEdit={() => patient.id && onEdit(`/dashboard/patients/${patient.id}/edit`)}
            onDelete={() => patient.id && onDelete(patient.id)}
            deleteLoading={deleteLoading === patient.id}
          />
        }
      />
    );
  }

  // List View
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-3 ${patient.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
            <div className="text-sm text-gray-500">NIK: {patient.nik}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
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
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{patient.telp}</div>
        <div className="text-sm text-gray-500">BPJS: {patient.bpjs_number || '-'}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">{patient.address}</div>
        {membership && (
          <div className="text-sm text-blue-600 mt-1">
            {membership.type} • {membership.tier}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          patient.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {patient.is_active ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <ActionButtons
          onEdit={() => patient.id && onEdit(`/dashboard/patients/${patient.id}/edit`)}
          onDelete={() => patient.id && onDelete(patient.id)}
          deleteLoading={deleteLoading === patient.id}
        />
      </td>
    </tr>
  );
}

// Helper function untuk membership color
function getMembershipColor(type: string): 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' {
  switch (type) {
    case 'Premium':
      return 'purple';
    case 'Standard':
      return 'blue';
    case 'Basic':
      return 'green';
    default:
      return 'gray';
  }
}