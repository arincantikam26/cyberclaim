// components/UI/Table/TableFilters.tsx
'use client';

import { useState } from 'react';

interface Column {
  key: string;
  label: string;
  filterable?: boolean;
}

interface TableFiltersProps {
  columns: Column[];
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
}

export default function TableFilters({ columns, filters, onFilterChange }: TableFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filterableColumns = columns.filter(col => col.filterable);

  const clearAllFilters = () => {
    filterableColumns.forEach(col => {
      onFilterChange(col.key, '');
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value != null);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-xl border transition-colors
          ${hasActiveFilters
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object.values(filters).filter(v => v !== '' && v != null).length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Data</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Hapus Semua
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filterableColumns.map(column => (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {column.label}
                  </label>
                  <input
                    type="text"
                    value={filters[column.key] || ''}
                    onChange={(e) => onFilterChange(column.key, e.target.value)}
                    placeholder={`Filter ${column.label.toLowerCase()}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Terapkan
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}