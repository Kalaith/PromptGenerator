import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trash2, Edit, Plus, Eye, Save, X } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  generator_type: string;
  template: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
  available_placeholders: string[];
  preview: string;
  created_at: string;
  updated_at: string;
}

interface TemplateFormData {
  name: string;
  generator_type: string;
  template: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

const GENERATOR_TYPES = [
  { value: 'adventurer', label: 'Adventurer' },
  { value: 'alien', label: 'Alien' },
  { value: 'anime', label: 'Anime' },
  { value: 'base', label: 'Base' }
];

export function DescriptionTemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedType, setSelectedType] = useState<string>('adventurer');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    generator_type: 'adventurer',
    template: '',
    description: '',
    is_active: true,
    is_default: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [selectedType]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/description-templates?generator_type=${selectedType}`);
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data);
      } else {
        setError('Failed to fetch templates');
      }
    } catch (err) {
      setError('Network error while fetching templates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      generator_type: template.generator_type,
      template: template.template,
      description: template.description || '',
      is_active: template.is_active,
      is_default: template.is_default
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      generator_type: selectedType,
      template: '',
      description: '',
      is_active: true,
      is_default: false
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setLoading(true);

      const url = editingTemplate 
        ? `/api/description-templates/${editingTemplate.id}`
        : '/api/description-templates';
      
      const method = editingTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingTemplate ? 'Template updated successfully!' : 'Template created successfully!');
        setEditingTemplate(null);
        setIsCreating(false);
        fetchTemplates();
      } else {
        setError(data.error || 'Failed to save template');
        if (data.validation_errors) {
          setError(`Validation errors: ${data.validation_errors.join(', ')}`);
        }
      }
    } catch (err) {
      setError('Network error while saving template');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (template: Template) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/description-templates/${template.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Template deleted successfully!');
        fetchTemplates();
      } else {
        setError(data.error || 'Failed to delete template');
      }
    } catch (err) {
      setError('Network error while deleting template');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setIsCreating(false);
    setError(null);
  };

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.querySelector('textarea[name="template"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + `{${placeholder}}` + value.substring(end);
      
      setFormData(prev => ({ ...prev, template: newValue }));
      
      // Set cursor position after inserted placeholder
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + placeholder.length + 2;
        textarea.focus();
      }, 0);
    }
  };

  const currentTemplate = templates.find(t => t.generator_type === selectedType && t.is_default);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Description Template Manager</span>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage description templates for bulk prompt generation. Templates use placeholder variables like {'{hairColor}'} and {'{race}'}.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="grid w-full grid-cols-4">
              {GENERATOR_TYPES.map(type => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {GENERATOR_TYPES.map(type => (
              <TabsContent key={type.value} value={type.value}>
                <div className="space-y-4">
                  {/* Current Default Template Preview */}
                  {currentTemplate && !editingTemplate && !isCreating && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span>Current Default Template</span>
                          <Badge variant="secondary">Default</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <strong className="text-sm">Name:</strong> {currentTemplate.name}
                          </div>
                          <div>
                            <strong className="text-sm">Template:</strong>
                            <pre className="bg-white p-3 rounded mt-1 text-sm overflow-x-auto border">
                              {currentTemplate.template}
                            </pre>
                          </div>
                          <div>
                            <strong className="text-sm">Sample Output:</strong>
                            <div className="bg-white border p-3 rounded mt-1 text-sm italic">
                              {currentTemplate.preview}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Template Form */}
                  {(editingTemplate || isCreating) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{editingTemplate ? 'Edit Template' : 'Create Template'}</span>
                          <div className="flex gap-2">
                            <Button onClick={handleSave} disabled={loading}>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button onClick={handleCancel} variant="outline">
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Template name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Generator Type</label>
                            <Select 
                              value={formData.generator_type} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, generator_type: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {GENERATOR_TYPES.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Input
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Template description (optional)"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="is_active"
                              checked={formData.is_active}
                              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                            <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="is_default"
                              checked={formData.is_default}
                              onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                            />
                            <label htmlFor="is_default" className="text-sm font-medium">Set as Default</label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Template</label>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                              <Textarea
                                name="template"
                                value={formData.template}
                                onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                                placeholder="Enter your template with {placeholder} variables"
                                rows={8}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Use placeholders like {'{hairColor}'}, {'{race}'}, {'{pronoun_subject}'} to create dynamic descriptions.
                              </p>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-2">Available Placeholders</div>
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {(editingTemplate?.available_placeholders || 
                                  templates.find(t => t.generator_type === formData.generator_type)?.available_placeholders || 
                                  []).map(placeholder => (
                                  <Button
                                    key={placeholder}
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-xs"
                                    onClick={() => insertPlaceholder(placeholder)}
                                  >
                                    {`{${placeholder}}`}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Templates List */}
                  {!editingTemplate && !isCreating && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">All {type.label} Templates</h3>
                      {loading ? (
                        <div className="text-center py-8">Loading templates...</div>
                      ) : templates.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No templates found for {type.label} generator
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {templates.map(template => (
                            <Card key={template.id}>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span>{template.name}</span>
                                    {template.is_default && <Badge variant="secondary">Default</Badge>}
                                    {!template.is_active && <Badge variant="destructive">Inactive</Badge>}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(template)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    {!template.is_default && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(template)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {template.description && (
                                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                )}
                                <div className="text-sm">
                                  <strong>Template:</strong>
                                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                                    {template.template}
                                  </pre>
                                </div>
                                <div className="text-sm mt-3">
                                  <strong>Sample Output:</strong>
                                  <div className="bg-blue-50 p-2 rounded mt-1 text-xs italic">
                                    {template.preview}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}