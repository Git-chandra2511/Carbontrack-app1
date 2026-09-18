import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-[#E5E7EB] rounded-2xl h-full min-h-[300px]">
      {icon && (
        <div className="w-16 h-16 bg-[#F9FAFB] text-[#9CA3AF] rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-[#111827] mb-2">{title}</h3>
      <p className="text-[#6B7280] max-w-sm mb-8">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}


