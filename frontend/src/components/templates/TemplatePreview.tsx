import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { DescriptionTemplate } from '../../api';

interface TemplatePreviewProps {
  template: DescriptionTemplate;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => (
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
          <strong className="text-sm">Name:</strong> {template.name}
        </div>
        <div>
          <strong className="text-sm">Template:</strong>
          <pre className="bg-white p-3 rounded mt-1 text-sm overflow-x-auto border">
            {template.template}
          </pre>
        </div>
        <div>
          <strong className="text-sm">Sample Output:</strong>
          <div className="bg-white border p-3 rounded mt-1 text-sm italic">
            {template.preview}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);