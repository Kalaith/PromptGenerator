import React from 'react';
import AttributeOptionsManager from '../components/AttributeOptionsManager';

const AttributeOptionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex space-x-4 text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-800">← Back to Generators</a>
            <span className="text-gray-400">|</span>
            <a href="/generator-types" className="text-blue-600 hover:text-blue-800">Generator Types</a>
            <span className="text-gray-400">|</span>
            <a href="/attribute-manager" className="text-blue-600 hover:text-blue-800">Attributes</a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Attribute Options</span>
          </nav>
        </div>
      </div>
      
      <AttributeOptionsManager />
      
      <div className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          Changes take effect immediately. Generators will automatically use the updated options.
        </div>
      </div>
    </div>
  );
};

export default AttributeOptionsPage;