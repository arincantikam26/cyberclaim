// components/common/Pagination.tsx
'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  labels?: {
    showing?: string;
    of?: string;
    patients?: string;
  };
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  labels = {},
  className = ''
}: PaginationProps) {
  const {
    showing = 'Menampilkan',
    of = 'dari',
    patients = 'item'
  } = labels;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    if (currentPage > delta + 2 && currentPage < totalPages - delta - 1) {
      for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        range.push(i);
      }
      rangeWithDots.push(1, '...', ...range, '...', totalPages);
    } else if (currentPage <= delta + 2) {
      for (let i = 1; i <= delta * 2 + 3; i++) {
        range.push(i);
      }
      rangeWithDots.push(...range, '...', totalPages);
    } else if (currentPage >= totalPages - delta - 1) {
      for (let i = totalPages - (delta * 2 + 2); i <= totalPages; i++) {
        range.push(i);
      }
      rangeWithDots.push(1, '...', ...range);
    }

    return rangeWithDots.length ? rangeWithDots : range;
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Showing information */}
      <div className="text-sm text-gray-700">
        {showing} <span className="font-semibold">{startItem}</span> -{' '}
        <span className="font-semibold">{endItem}</span> {of}{' '}
        <span className="font-semibold">{totalItems}</span> {patients}
      </div>
      
      {/* Page navigation */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : page === '...'
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
              aria-label={
                page === '...' 
                  ? 'Halaman lain' 
                  : `Halaman ${page}`
              }
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman berikutnya"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}