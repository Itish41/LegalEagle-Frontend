import React from 'react';
import { FileText } from 'lucide-react';

export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="w-10 h-10 border-4 border-[#2C9ED4]/20 border-t-[#2C9ED4] rounded-full animate-spin"></div>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, description, icon, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-16 h-16 bg-[#2C2C2C] rounded-full flex items-center justify-center mb-4 
      border border-[#3C3C3C] shadow-lg">
      {icon || <FileText className="w-8 h-8 text-[#2C9ED4]" />}
    </div>
    <h3 className="text-xl font-semibold mb-2 
      bg-gradient-to-br from-[#2C9ED4] to-[#7ED4BD] bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">{description}</p>
    {action && (
      <div className="transform hover:scale-105 transition-transform duration-200">
        {action}
      </div>
    )}
  </div>
);
