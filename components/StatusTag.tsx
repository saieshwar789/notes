import React from 'react';

interface StatusTagProps {
  status: string;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'normal' | 'small';
}

const statusColors: { [key: string]: string } = {
  'Todo': 'bg-gray-600 text-gray-100',
  'In Progress': 'bg-blue-600 text-blue-100',
  'Completed': 'bg-green-600 text-green-100',
};

const StatusTag: React.FC<StatusTagProps> = ({ status, onClick, size = 'normal' }) => {
  const colorClass = statusColors[status] || 'bg-gray-600 text-gray-100';
  
  const sizeClasses = size === 'small' 
    ? 'px-1.5 py-px text-[10px]' 
    : 'px-1.5 py-0.5 text-xs';

  const interactiveClasses = onClick 
    ? 'cursor-pointer transition-transform hover:scale-110' 
    : '';

  return (
    <span 
      className={`${sizeClasses} font-semibold rounded-full ${colorClass} ${interactiveClasses}`}
      onClick={onClick}
    >
      {status}
    </span>
  );
};

export default StatusTag;