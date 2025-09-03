import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import type { DescriptionTemplate } from '../../api';

interface TemplateListComponentProps {
  templates: DescriptionTemplate[];
  loading: boolean;
  generatorTypeLabel: string;
  onEdit: (template: DescriptionTemplate) => void;
  onDelete: (template: DescriptionTemplate) => Promise<void>;
}

export const TemplateListComponent: React.FC<TemplateListComponentProps> = ({
  templates,
  loading,
  generatorTypeLabel,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No templates found for {generatorTypeLabel} generator
      </div>
    );
  }

  const handleDelete = async (template: DescriptionTemplate): Promise<void> => {
    await onDelete(template);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">All {generatorTypeLabel} Templates</h3>
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
                    onClick={() => onEdit(template)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!template.is_default && (
                    <Button
                      onClick={() => handleDelete(template)}
                      size="sm"
                      variant="outline"
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
    </div>
  );
};