// components/common/DataCard.tsx
'use client';

import { ReactNode } from 'react';

export interface DataCardProps<T> {
  data: T;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    color: 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  };
  status?: {
    isActive: boolean;
    activeText?: string;
    inactiveText?: string;
  };
  fields: {
    icon: ReactNode;
    label: string;
    value: string | ReactNode;
    truncate?: boolean;
  }[];
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const badgeColors = {
  gray: 'bg-gray-100 text-gray-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-800'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800'
};

export function DataCard<T>({
  data,
  title,
  subtitle,
  badge,
  status,
  fields,
  actions,
  onClick,
  className = ''
}: DataCardProps<T>) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className} ${
        onClick ? 'cursor-pointer hover:border-gray-300' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {status && (
            <div 
              className={`w-3 h-3 rounded-full ${
                status.isActive ? 'bg-green-500' : 'bg-red-500'
              }`} 
            />
          )}
          {badge && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${badgeColors[badge.color]}`}>
              {badge.text}
            </span>
          )}
        </div>
        {actions && (
          <div className="flex space-x-1">
            {actions}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title Section */}
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div 
              key={index}
              className="flex items-start space-x-2 text-sm text-gray-600"
            >
              <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                {field.icon}
              </div>
              <span className={`flex-1 ${field.truncate ? 'line-clamp-2' : ''}`}>
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {/* Status */}
        {status && (
          <div className="pt-2 border-t border-gray-200">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status.isActive ? statusColors.active : statusColors.inactive
            }`}>
              {status.isActive 
                ? (status.activeText || 'Aktif') 
                : (status.inactiveText || 'Tidak Aktif')
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
}