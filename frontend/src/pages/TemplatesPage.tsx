import React, { useState } from 'react';
import TemplateManager from '../components/TemplateManager';
import TemplateCreator from '../components/TemplateCreator';

const TemplatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Template Management</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Browse Templates
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Template
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'browse' && (
          <>
            <div>
              <h2 className="text-lg font-semibold mb-4">Anime Templates</h2>
              <TemplateManager type="anime" showCreateButton={false} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Alien Templates</h2>
              <TemplateManager type="alien" showCreateButton={false} />
            </div>
          </>
        )}
        
        {activeTab === 'create' && (
          <div className="lg:col-span-2">
            <TemplateCreator />
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;