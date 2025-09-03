import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus } from 'lucide-react';
import { GENERATOR_TYPES } from '../constants/templateConstants';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { useTemplateForm } from '../hooks/useTemplateForm';
import { usePlaceholderInsertion } from '../hooks/usePlaceholderInsertion';
import { TemplateFormComponent } from './templates/TemplateFormComponent';
import { TemplateListComponent } from './templates/TemplateListComponent';
import { TemplatePreview } from './templates/TemplatePreview';

const DescriptionTemplateManager: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('adventurer');
  
  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
    success: templatesSuccess,
    fetchTemplates,
    deleteTemplate,
    clearMessages: clearTemplateMessages,
  } = useTemplateManager(selectedType);

  const {
    formData,
    editingTemplate,
    isCreating,
    loading: formLoading,
    error: formError,
    success: formSuccess,
    startEdit,
    startCreate,
    cancel,
    updateFormData,
    save,
    clearMessages: clearFormMessages,
  } = useTemplateForm();

  const { insertPlaceholder } = usePlaceholderInsertion((value: string) => {
    updateFormData('template', value);
  });

  const handleSave = async (): Promise<void> => {
    await save(fetchTemplates);
  };

  const handleCreate = (): void => {
    startCreate(selectedType);
    clearTemplateMessages();
    clearFormMessages();
  };

  const handleCancel = (): void => {
    cancel();
    clearFormMessages();
  };

  const currentTemplate = templates.find(template => 
    template.generator_type === selectedType && template.is_default
  );

  const error = templatesError ?? formError;
  const success = templatesSuccess ?? formSuccess;
  const loading = templatesLoading || formLoading;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Description Template Manager</span>
            <Button className="flex items-center gap-2" onClick={handleCreate}>
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

          <Tabs onValueChange={setSelectedType} value={selectedType}>
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
                    <TemplatePreview template={currentTemplate} />
                  )}

                  {/* Template Form */}
                  {(editingTemplate || isCreating) && (
                    <TemplateFormComponent
                      editingTemplate={editingTemplate}
                      formData={formData}
                      loading={loading}
                      onCancel={handleCancel}
                      onInsertPlaceholder={insertPlaceholder}
                      onSave={handleSave}
                      onUpdateFormData={updateFormData}
                      templates={templates}
                    />
                  )}

                  {/* Templates List */}
                  {!editingTemplate && !isCreating && (
                    <TemplateListComponent
                      generatorTypeLabel={type.label}
                      loading={loading}
                      onDelete={deleteTemplate}
                      onEdit={startEdit}
                      templates={templates}
                    />
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DescriptionTemplateManager;