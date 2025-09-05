import React, { useState, useEffect } from 'react';
import { defaultGeneratorTypes, GeneratorTypeConfig } from '../config/generatorTypes';

const GeneratorTypeManager: React.FC = () => {
  const [generatorTypes, setGeneratorTypes] = useState<GeneratorTypeConfig[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<Partial<GeneratorTypeConfig>>({
    isActive: true,
    order: 0
  });

  useEffect(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('generatorTypes');
    if (saved) {
      try {
        setGeneratorTypes(JSON.parse(saved));
      } catch {
        setGeneratorTypes([...defaultGeneratorTypes]);
      }
    } else {
      setGeneratorTypes([...defaultGeneratorTypes]);
    }
  }, []);

  const saveToStorage = (types: GeneratorTypeConfig[]) => {
    localStorage.setItem('generatorTypes', JSON.stringify(types));
    setGeneratorTypes(types);
  };

  const updateType = (id: string, updates: Partial<GeneratorTypeConfig>) => {
    const updated = generatorTypes.map(type =>
      type.id === id ? { ...type, ...updates } : type
    );
    saveToStorage(updated);
  };

  const addNewType = () => {
    if (!newType.name || !newType.slug || !newType.apiType) {
      alert('Please fill in required fields: Name, Slug, and API Type');
      return;
    }

    const id = newType.slug || `type_${Date.now()}`;
    const maxOrder = Math.max(...generatorTypes.map(t => t.order), 0);
    
    const typeToAdd: GeneratorTypeConfig = {
      id,
      slug: newType.slug || id,
      name: newType.name || 'New Generator',
      description: newType.description || 'Description not set',
      icon: newType.icon || '🎯',
      apiType: newType.apiType || 'anime',
      buttonGradient: newType.buttonGradient || 'bg-gradient-to-r from-blue-500 to-purple-500',
      focusColor: newType.focusColor || 'blue',
      isActive: newType.isActive !== false,
      order: newType.order || maxOrder + 1
    };

    const updated = [...generatorTypes, typeToAdd];
    saveToStorage(updated);
    
    setNewType({ isActive: true, order: 0 });
    setShowAddForm(false);
  };

  const deleteType = (id: string) => {
    if (confirm('Are you sure you want to delete this generator type?')) {
      const updated = generatorTypes.filter(type => type.id !== id);
      saveToStorage(updated);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default generator types? This will lose all customizations.')) {
      saveToStorage([...defaultGeneratorTypes]);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="card">
        <div className="card__body">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Generator Type Manager</h2>
              <p className="text-slate-600">Manage and configure generator types</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
              >
                {showAddForm ? 'Cancel' : 'Add New Type'}
              </button>
              <button
                onClick={resetToDefaults}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-medium"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Add New Type Form */}
          {showAddForm && (
            <div className="mb-8 p-6 border-2 border-green-200 rounded-xl bg-green-50">
              <h3 className="text-xl font-semibold mb-4">Add New Generator Type</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Name (e.g., 'Dragon')"
                  className="form-control"
                  value={newType.name || ''}
                  onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  placeholder="Slug (e.g., 'dragon')"
                  className="form-control"
                  value={newType.slug || ''}
                  onChange={(e) => setNewType(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                />
                <input
                  placeholder="Description"
                  className="form-control"
                  value={newType.description || ''}
                  onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
                />
                <input
                  placeholder="Icon (emoji)"
                  className="form-control"
                  value={newType.icon || ''}
                  onChange={(e) => setNewType(prev => ({ ...prev, icon: e.target.value }))}
                />
                <select
                  className="form-control"
                  value={newType.apiType || ''}
                  onChange={(e) => setNewType(prev => ({ ...prev, apiType: e.target.value }))}
                >
                  <option value="">Select API Type</option>
                  <option value="animalGirl">Animal Girl</option>
                  <option value="monsterGirl">Monster Girl</option>
                  <option value="monster">Monster</option>
                  <option value="race">Race/Adventurer</option>
                  <option value="alien">Alien</option>
                </select>
                <input
                  placeholder="Focus Color (e.g., 'blue')"
                  className="form-control"
                  value={newType.focusColor || ''}
                  onChange={(e) => setNewType(prev => ({ ...prev, focusColor: e.target.value }))}
                />
                <input
                  placeholder="Button Gradient Class"
                  className="form-control col-span-2"
                  value={newType.buttonGradient || ''}
                  onChange={(e) => setNewType(prev => ({ ...prev, buttonGradient: e.target.value }))}
                />
                <div className="col-span-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newType.isActive !== false}
                      onChange={(e) => setNewType(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    Active
                  </label>
                  <input
                    type="number"
                    placeholder="Order"
                    className="form-control w-20"
                    value={newType.order || 0}
                    onChange={(e) => setNewType(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                  <button
                    onClick={addNewType}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Add Type
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generator Types List */}
          <div className="space-y-4">
            {generatorTypes.sort((a, b) => a.order - b.order).map((type) => (
              <div
                key={type.id}
                className={`p-4 border rounded-xl ${type.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{type.name}</h3>
                      <p className="text-sm text-gray-600">/{type.slug} → {type.apiType}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Order: {type.order}</span>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={type.isActive}
                        onChange={(e) => updateType(type.id, { isActive: e.target.checked })}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <button
                      onClick={() => setEditingId(editingId === type.id ? null : type.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      {editingId === type.id ? 'Close' : 'Edit'}
                    </button>
                    <button
                      onClick={() => deleteType(type.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Editing Form */}
                {editingId === type.id && (
                  <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        placeholder="Name"
                        className="form-control"
                        value={type.name}
                        onChange={(e) => updateType(type.id, { name: e.target.value })}
                      />
                      <input
                        placeholder="Description"
                        className="form-control"
                        value={type.description}
                        onChange={(e) => updateType(type.id, { description: e.target.value })}
                      />
                      <input
                        placeholder="Icon"
                        className="form-control"
                        value={type.icon}
                        onChange={(e) => updateType(type.id, { icon: e.target.value })}
                      />
                      <input
                        placeholder="Focus Color"
                        className="form-control"
                        value={type.focusColor}
                        onChange={(e) => updateType(type.id, { focusColor: e.target.value })}
                      />
                      <input
                        placeholder="Button Gradient"
                        className="form-control col-span-2"
                        value={type.buttonGradient}
                        onChange={(e) => updateType(type.id, { buttonGradient: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Order"
                        className="form-control"
                        value={type.order}
                        onChange={(e) => updateType(type.id, { order: parseInt(e.target.value) || 0 })}
                      />
                      <select
                        className="form-control"
                        value={type.apiType}
                        onChange={(e) => updateType(type.id, { apiType: e.target.value })}
                      >
                        <option value="animalGirl">Animal Girl</option>
                        <option value="monsterGirl">Monster Girl</option>
                        <option value="monster">Monster</option>
                        <option value="race">Race/Adventurer</option>
                        <option value="alien">Alien</option>
                      </select>
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