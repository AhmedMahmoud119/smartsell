import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'cyan';
  iconColor?: string;
}

const bgColorMap = {
  pink: 'bg-pink-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  orange: 'bg-orange-50',
  purple: 'bg-purple-50',
  cyan: 'bg-cyan-50',
};

const iconBgColorMap = {
  pink: 'bg-pink-100',
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  orange: 'bg-orange-100',
  purple: 'bg-purple-100',
  cyan: 'bg-cyan-100',
};

const iconColorMap = {
  pink: 'text-pink-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  cyan: 'text-cyan-600',
};

export default function StatCard({ title, value, icon, bgColor, iconColor }: StatCardProps) {
  return (
    <div className={`${bgColorMap[bgColor]} rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${iconBgColorMap[bgColor]} ${iconColor || iconColorMap[bgColor]} w-12 h-12 rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
