import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-sakura-200 border-t-sakura-500 rounded-full mx-auto mb-4"></div>
          <p className="text-dark-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};