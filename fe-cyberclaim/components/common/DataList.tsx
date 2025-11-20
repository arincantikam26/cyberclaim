// components/common/DataList.tsx
'use client';

import { ReactNode } from 'react';

export interface DataListProps<T> {
  data: T[];
  columns: {
    key: string;
    label: string;
    width?: string;
    render?: (value: any, item: T, index: number) => ReactNode;
    className?: string;
  }[];
  renderRow?: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  loadingComponent?: ReactNode;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataList<T>({
  data,
  columns,
  renderRow,
  emptyState,
  loading = false,
  loadingComponent,
  onRowClick,
  className = ''
}: DataListProps<T>) {
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

  const getColumnWidth = (width?: string) => {
    if (!width) return '';
    return `w-${width}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    getColumnWidth(column.width)
                  } ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr 
                key={index}
                className={`hover:bg-gray-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {renderRow ? (
                  renderRow(item, index)
                ) : (
                  columns.map((column) => (
                    <td 
                      key={column.key} 
                      className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                    >
                      {column.render 
                        ? column.render((item as any)[column.key], item, index)
                        : (item as any)[column.key]
                      }
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}