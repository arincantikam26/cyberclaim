// components/UI/Table/Table.tsx (Updated Version)
'use client';

import { useState, useMemo } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableCell from './TableCell';
import TablePagination from './TablePagination';
import TableFilters from './TableFilters';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  truncate?: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
  pageSize?: number;
  searchable?: boolean;
  filterable?: boolean;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  emptyState?: React.ReactNode;
}

export default function Table({
  columns,
  data,
  pageSize = 10,
  searchable = true,
  filterable = true,
  onRowClick,
  loading = false,
  striped = true,
  hoverable = true,
  emptyState
}: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Filter data berdasarkan search term
  const filteredData = useMemo(() => {
    let result = data;

    // Search filter
    if (searchTerm) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => {
          const rowValue = row[key];
          if (typeof value === 'string') {
            return rowValue?.toString().toLowerCase().includes(value.toLowerCase());
          }
          return rowValue === value;
        });
      }
    });

    // Sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sortConfig, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Default empty state
  const defaultEmptyState = (
    <TableRow>
      <TableCell colSpan={columns.length} align="center" className="py-12">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <svg className="h-16 w-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium mb-2">Tidak ada data ditemukan</p>
          <p className="text-sm">Coba ubah pencarian atau filter Anda</p>
        </div>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Skeleton Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-64"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
          </div>
        </div>
        
        {/* Skeleton Table */}
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded mb-3"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Controls */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          {searchable && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Filters */}
          {filterable && (
            <TableFilters
              columns={columns}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <span className="font-semibold text-blue-600">{paginatedData.length}</span> dari{' '}
            <span className="font-semibold text-green-600">{filteredData.length}</span> data
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column) => (
                <TableHeader
                  key={column.key}
                  align={column.align}
                  sortable={column.sortable}
                  sortDirection={sortConfig?.key === column.key ? sortConfig.direction : null}
                  onSort={() => column.sortable && handleSort(column.key)}
                  width={column.width}
                >
                  {column.label}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  hoverable={hoverable}
                  striped={striped}
                  className={onRowClick ? 'group' : ''}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      truncate={column.truncate}
                      onClick={onRowClick ? () => onRowClick?.(row) : undefined}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              emptyState || defaultEmptyState
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}