// components/UI/Table/TableRow.tsx
'use client';

import { ReactNode } from 'react';

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
  striped?: boolean;
}

export default function TableRow({
  children,
  className = '',
  onClick,
  hoverable = true,
  selected = false,
  striped = false
}: TableRowProps) {
  const baseClasses = `
    transition-all duration-200
    border-b border-gray-100
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const stateClasses = selected
    ? 'bg-gradient-to-r from-blue-50 to-blue-25 shadow-inner'
    : striped
    ? 'bg-gray-50 even:bg-white'
    : 'bg-white';

  const hoverClasses = hoverable
    ? `hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:shadow-sm ${
        onClick ? 'hover:scale-[1.002] transform' : ''
      }`
    : '';

  return (
    <tr
      className={`
        ${baseClasses}
        ${stateClasses}
        ${hoverClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}