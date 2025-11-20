// components/diagnosis/DiagnosisPagination.tsx
'use client';

import { Pagination } from '@/components/common/Pagination';

interface TindakanPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function TindakanPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}: TindakanPaginationProps) {
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
        patients: 'tindakan'
      }}
    />
  );
}