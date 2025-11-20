// components/common/DataGrid.tsx
'use client';

import { ReactNode } from 'react';

export interface DataGridProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  loadingComponent?: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
};

const gridGaps = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8'
};

export function DataGrid<T>({
  data,
  renderItem,
  emptyState,
  loading = false,
  loadingComponent,
  columns = 3,
  gap = 'md',
  className = ''
}: DataGridProps<T>) {
  if (loading) {
    return (
      <div className={className}>
        {loadingComponent || (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={className}>
        {emptyState || (
          <div className="text-center py-12 text-gray-500">
            Tidak ada data yang ditemukan
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${gridColumns[columns]} ${gridGaps[gap]} ${className}`}>
      {data.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}