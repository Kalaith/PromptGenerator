import React, { useState } from 'react';
import { useGeneratorTypes, GeneratorTypeConfig } from '../hooks/useGeneratorTypes';
import GeneratorTypeManagerHeader from './GeneratorTypeManagerHeader';

const GeneratorTypeManager: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { generatorTypes, loading, error, updateType, addType, deleteType, resetToDefaults } = useGeneratorTypes();

  const handleAddType = async (newType: Partial<GeneratorTypeConfig>): Promise<boolean> => {
    const success = await addType(newType);
    if (success) {
      setShowAddForm(false);
    }
    return success;
  };

  const handleUpdateType = async (id: number, updates: Partial<GeneratorTypeConfig>): Promise<boolean> => {
    const success = await updateType(id, updates);
    if (success) {
      setEditingId(null);
    }
    return success;
  };

  const handleDeleteType = async (id: number): Promise<boolean> => {
    const confirmed = window.confirm('Are you sure you want to delete this generator type?');
    if (confirmed) {
      return await deleteType(id);
    }
    return false;
  };

  const handleResetToDefaults = async (): Promise<void> => {
    const confirmed = window.confirm(
      'Are you sure you want to reset to default generator types? This will lose all customizations.'
    );
    if (confirmed) {
      await resetToDefaults();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading generator types...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="card">
        <div className="card__body">
          <GeneratorTypeManagerHeader
            showAddForm={showAddForm}
            onToggleAddForm={() => setShowAddForm(!showAddForm)}
            onResetToDefaults={handleResetToDefaults}
          />

          {showAddForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-lg font-semibold mb-3">Add New Generator Type</h4>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newType: Partial<GeneratorTypeConfig> = {
                  name: formData.get('name') as string,
                  display_name: formData.get('display_name') as string,
                  description: formData.get('description') as string,
                  endpoint: formData.get('endpoint') as string,
                  route_key: formData.get('route_key') as string,
                  is_active: formData.get('is_active') === 'on',
                  sort_order: parseInt(formData.get('sort_order') as string) || 0
                };
                await handleAddType(newType);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name:</label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Display Name:</label>
                    <input
                      type="text"
                      name="display_name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Route Key:</label>
                    <input
                      type="text"
                      name="route_key"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Endpoint:</label>
                    <input
                      type="text"
                      name="endpoint"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description:</label>
                    <input
                      type="text"
                      name="description"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sort Order:</label>
                    <input
                      type="number"
                      name="sort_order"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked
                        className="rounded border-gray-300 text-indigo-600 shadow-sm"
                      />
                      <span className="ml-2">Active</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Create Type
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {generatorTypes.sort((a, b) => a.sort_order - b.sort_order).map((type) => (
              <div key={type.id} className="bg-white border border-gray-200 rounded-lg p-4">
                {editingId === type.id ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const updates: Partial<GeneratorTypeConfig> = {
                      name: formData.get('name') as string,
                      display_name: formData.get('display_name') as string,
                      description: formData.get('description') as string,
                      endpoint: formData.get('endpoint') as string,
                      route_key: formData.get('route_key') as string,
                      is_active: formData.get('is_active') === 'on',
                      sort_order: parseInt(formData.get('sort_order') as string) || 0
                    };
                    await handleUpdateType(type.id!, updates);
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={type.name}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Display Name:</label>
                        <input
                          type="text"
                          name="display_name"
                          defaultValue={type.display_name}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Route Key:</label>
                        <input
                          type="text"
                          name="route_key"
                          defaultValue={type.route_key}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Endpoint:</label>
                        <input
                          type="text"
                          name="endpoint"
                          defaultValue={type.endpoint}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description:</label>
                        <input
                          type="text"
                          name="description"
                          defaultValue={type.description}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sort Order:</label>
                        <input
                          type="number"
                          name="sort_order"
                          defaultValue={type.sort_order}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_active"
                            defaultChecked={type.is_active}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm"
                          />
                          <span className="ml-2">Active</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{type.display_name}</h3>
                      <p className="text-sm text-gray-600">Name: {type.name} | Route: {type.route_key} | Endpoint: {type.endpoint}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                      <p className="text-sm text-gray-400">Sort Order: {type.sort_order} | Status: {type.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingId(type.id!)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.id!)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorTypeManager;