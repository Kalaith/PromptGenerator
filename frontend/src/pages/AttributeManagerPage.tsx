import React from 'react';
import AttributeManager from '../components/AttributeManager';

const AttributeManagerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex space-x-4 text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-800">← Back to Generators</a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Attribute Configuration Manager</span>
          </nav>
        </div>
      </div>
      
      <AttributeManager />
      
      <div className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          Changes take effect immediately. Generators will automatically use the updated configuration.
        </div>
      </div>
    </div>
  );
};

export default AttributeManagerPage;