'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export type DateRange = '7d' | '30d' | '90d' | '1y' | 'custom';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange, startDate?: string, endDate?: string) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: DateRange; label: string }[] = [
    { value: '7d', label: t('analytics.last7Days') },
    { value: '30d', label: t('analytics.last30Days') },
    { value: '90d', label: t('analytics.last90Days') },
    { value: '1y', label: t('analytics.lastYear') },
  ];

  const getDateRange = (range: DateRange): { start: string; end: string } => {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const handleSelect = (range: DateRange) => {
    const { start, end } = getDateRange(range);
    onChange(range, start, end);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">{selectedLabel}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 end-0 z-20 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-start px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  value === option.value
                    ? 'text-blue-600 bg-blue-50 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
