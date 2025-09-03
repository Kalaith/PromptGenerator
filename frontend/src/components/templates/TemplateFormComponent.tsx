import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Save, X } from 'lucide-react';
import { GENERATOR_TYPES } from '../../constants/templateConstants';
import { PlaceholderButtons } from './PlaceholderButtons';

interface TemplateFormData {
  name: string;
  generator_type: string;
  template: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

interface TemplateFormComponentProps {
  formData: TemplateFormData;
  editingTemplate: { available_placeholders?: string[] } | null;
  templates: { generator_type: string; available_placeholders?: string[] }[];
  loading: boolean;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onUpdateFormData: <K extends keyof TemplateFormData>(key: K, value: TemplateFormData[K]) => void;
  onInsertPlaceholder: (placeholder: string) => void;
}

export const TemplateFormComponent: React.FC<TemplateFormComponentProps> = ({
  formData,
  editingTemplate,
  templates,
  loading,
  onSave,
  onCancel,
  onUpdateFormData,
  onInsertPlaceholder,
}) => {
  const handleSave = async (): Promise<void> => {
    await onSave();
  };

  const availablePlaceholders = editingTemplate?.available_placeholders 
    ?? templates.find(template => template.generator_type === formData.generator_type)?.available_placeholders 
    ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{editingTemplate ? 'Edit Template' : 'Create Template'}</span>
          <div className="flex gap-2">
            <Button disabled={loading} onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={onCancel} variant="outline">
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onUpdateFormData('name', event.target.value)}
              placeholder="Template name"
              value={formData.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Generator Type</label>
            <Select 
              onValueChange={(value: string) => onUpdateFormData('generator_type', value)}
              value={formData.generator_type} 
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onUpdateFormData('description', event.target.value)}
            placeholder="Template description (optional)"
            value={formData.description}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              checked={formData.is_active}
              id="is_active"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onUpdateFormData('is_active', event.target.checked)}
              type="checkbox"
            />
            <label className="text-sm font-medium" htmlFor="is_active">Active</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              checked={formData.is_default}
              id="is_default"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onUpdateFormData('is_default', event.target.checked)}
              type="checkbox"
            />
            <label className="text-sm font-medium" htmlFor="is_default">Set as Default</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Template</label>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Textarea
                name="template"
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onUpdateFormData('template', event.target.value)}
                placeholder="Enter your template with {placeholder} variables"
                rows={8}
                value={formData.template}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use placeholders like {'{hairColor}'}, {'{race}'}, {'{pronoun_subject}'} to create dynamic descriptions.
              </p>
            </div>
            <PlaceholderButtons
              onInsertPlaceholder={onInsertPlaceholder}
              placeholders={availablePlaceholders}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};