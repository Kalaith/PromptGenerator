import React from 'react';
import { Button } from '../ui/button';

interface PlaceholderButtonsProps {
  placeholders: string[];
  onInsertPlaceholder: (placeholder: string) => void;
}

export const PlaceholderButtons: React.FC<PlaceholderButtonsProps> = ({
  placeholders,
  onInsertPlaceholder,
}) => (
  <div>
    <div className="text-sm font-medium mb-2">Available Placeholders</div>
    <div className="space-y-1 max-h-48 overflow-y-auto">
      {placeholders.map((placeholder: string) => (
        <Button
          className="w-full justify-start text-xs"
          key={placeholder}
          onClick={() => onInsertPlaceholder(placeholder)}
          size="sm"
          variant="outline"
        >
          {`{${placeholder}}`}
        </Button>
      ))}
    </div>
  </div>
);