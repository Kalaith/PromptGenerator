import React from 'react';
import type { PromptsPayload } from '../types/Prompt';

interface OutputPanelProps {
  generatedJSON: string;
  errors?: string[];
}

const OutputPanel: React.FC<OutputPanelProps> = ({ generatedJSON, errors }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedJSON);
    alert('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Output Panel</h2>
      {errors && errors.length > 0 && (
        <div className="mb-2 text-red-600">{errors.join('; ')}</div>
      )}
      <textarea
        value={generatedJSON}
        readOnly
        className="w-full h-40 p-2 border border-gray-300 rounded-md resize-none mb-4"
      />
      <div className="flex space-x-4">
        <button
          onClick={handleCopy}
          disabled={!generatedJSON}
          className={`py-2 px-4 rounded-md ${generatedJSON ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Copy to Clipboard
        </button>
        <button
          onClick={handleDownload}
          disabled={!generatedJSON}
          className={`py-2 px-4 rounded-md ${generatedJSON ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Download JSON
        </button>
      </div>
    </div>
  );
};

export default OutputPanel;
