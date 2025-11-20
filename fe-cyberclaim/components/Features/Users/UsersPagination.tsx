// components/users/UsersPagination.tsx
'use client';

import { Pagination } from '@/components/common/Pagination';

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function UsersPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}: UsersPaginationProps) {
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
        patients: 'user'
      }}
    />
  );
}