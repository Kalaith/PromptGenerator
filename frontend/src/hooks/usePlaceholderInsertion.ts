import { useRef, useCallback } from 'react';

export const usePlaceholderInsertion = (onUpdateTemplate: (value: string) => void) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertPlaceholder = useCallback((placeholder: string): void => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const newValue = value.slice(0, start) + `{${placeholder}}` + value.slice(end);
    
    onUpdateTemplate(newValue);
    
    // Set cursor position after inserted placeholder
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + placeholder.length + 2;
      textarea.focus();
    }, 0);
  }, [onUpdateTemplate]);

  return { textareaRef, insertPlaceholder };
};