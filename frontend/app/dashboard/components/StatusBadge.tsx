import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-orange-100 text-orange-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ children, variant = 'default' }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
