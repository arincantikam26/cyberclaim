// components/diagnosis/DiagnosisPagination.tsx
'use client';

import { Pagination } from '@/components/common/Pagination';

interface DiagnosisPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function DiagnosisPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}: DiagnosisPaginationProps) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      className={className}
      labels={{
        showing: 'Menampilkan',
        of: 'dari',
        patients: 'diagnosis'
      }}
    />
  );
}