// components/UI/Table/TableCell.tsx
'use client';

import { ReactNode } from 'react';

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
  rowSpan?: number;
  onClick?: () => void;
  truncate?: boolean;
  nowrap?: boolean;
}

export default function TableCell({
  children,
  className = '',
  align = 'left',
  colSpan,
  rowSpan,
  onClick,
  truncate = false,
  nowrap = false
}: TableCellProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const textClasses = `
    ${truncate ? 'truncate' : ''}
    ${nowrap ? 'whitespace-nowrap' : 'whitespace-normal'}
  `;

  return (
    <td
      className={`
        px-6 py-4 text-sm
        ${alignmentClasses[align]}
        ${textClasses}
        ${onClick ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''}
        ${className}
      `}
      colSpan={colSpan}
      rowSpan={rowSpan}
      onClick={onClick}
    >
      {children}
    </td>
  );
}