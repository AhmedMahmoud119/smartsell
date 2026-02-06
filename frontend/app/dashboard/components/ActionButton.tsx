import React from 'react';

type ActionButtonVariant = 'edit' | 'delete' | 'view' | 'custom';

interface ActionButtonProps {
  variant: ActionButtonVariant;
  onClick: () => void;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ActionButtonVariant, string> = {
  edit: 'text-cyan-600 hover:bg-cyan-50',
  delete: 'text-red-600 hover:bg-red-50',
  view: 'text-blue-600 hover:bg-blue-50',
  custom: 'text-gray-600 hover:bg-gray-50',
};

const defaultIcons: Record<Exclude<ActionButtonVariant, 'custom'>, React.ReactNode> = {
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  delete: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  view: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
};

export default function ActionButton({ variant, onClick, title, icon, className = '' }: ActionButtonProps) {
  const displayIcon = icon || (variant !== 'custom' ? defaultIcons[variant] : null);
  
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${variantStyles[variant]} ${className}`}
    >
      {displayIcon}
    </button>
  );
}
